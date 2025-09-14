import pandas as pd
from pathlib import Path
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    accuracy_score, RocCurveDisplay
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import seaborn as sns
import matplotlib.pyplot as plt
import joblib

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
REPORT_DIR = BASE_DIR / "report"
MODEL_DIR = BASE_DIR / "models"
REPORT_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

# Load train/test sets
X_train = pd.read_csv(PROCESSED_DIR / "X_train.csv")
X_test = pd.read_csv(PROCESSED_DIR / "X_test.csv")
y_train = pd.read_csv(PROCESSED_DIR / "y_train.csv").values.ravel()
y_test = pd.read_csv(PROCESSED_DIR / "y_test.csv").values.ravel()

# === Detect categorical & numerical features ===
categorical = X_train.select_dtypes(include=["object"]).columns.tolist()
numerical = X_train.select_dtypes(include=["int64", "float64"]).columns.tolist()

print("Categorical features:", categorical)
print("Numerical features:", numerical)

# Preprocessor
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", StandardScaler(), numerical)
])

# === Define Models + Param Grids ===
models = {
    "Logistic Regression": (
        Pipeline([
            ("preprocessor", preprocessor),
            ("clf", LogisticRegression(max_iter=1000, random_state=42))
        ]),
        {
            "clf__C": [0.01, 0.1, 1, 10],
            "clf__penalty": ["l2"],
            "clf__solver": ["lbfgs"]
        }
    ),
    "Random Forest": (
        Pipeline([
            ("preprocessor", preprocessor),
            ("clf", RandomForestClassifier(random_state=42))
        ]),
        {
            "clf__n_estimators": [100, 200, 300],
            "clf__max_depth": [None, 5, 10],
            "clf__min_samples_split": [2, 5],
            "clf__min_samples_leaf": [1, 2]
        }
    ),
    "Gradient Boosting": (
        Pipeline([
            ("preprocessor", preprocessor),
            ("clf", GradientBoostingClassifier(random_state=42))
        ]),
        {
            "clf__n_estimators": [100, 200],
            "clf__learning_rate": [0.01, 0.1, 0.2],
            "clf__max_depth": [3, 5]
        }
    )
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = []
best_model = None
best_score = -1
best_name = None

for name, (pipeline, param_grid) in models.items():
    print(f"\n🔹 Tuning {name}...")
    grid = GridSearchCV(
        estimator=pipeline,
        param_grid=param_grid,
        scoring="roc_auc",
        cv=cv,
        n_jobs=-1,
        verbose=1
    )
    grid.fit(X_train, y_train)

    # Evaluate on test set
    best_estimator = grid.best_estimator_
    y_pred = best_estimator.predict(X_test)
    y_proba = best_estimator.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)

    print(f"✅ {name} best params: {grid.best_params_}")
    print(f"Accuracy: {acc:.4f} | ROC-AUC: {auc:.4f}")
    print(classification_report(y_test, y_pred))

    results.append({
        "Model": name,
        "Best Params": grid.best_params_,
        "Accuracy": acc,
        "ROC-AUC": auc
    })

    # Track best model
    if auc > best_score:
        best_score = auc
        best_model = best_estimator
        best_name = name

    # === Save Confusion Matrix ===
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=[0, 1], yticklabels=[0, 1])
    plt.title(f"Confusion Matrix - {name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.tight_layout()
    plt.savefig(REPORT_DIR / f"confusion_matrix_{name.replace(' ', '_')}.png")
    plt.close()

    # === Save ROC Curve ===
    RocCurveDisplay.from_estimator(best_estimator, X_test, y_test)
    plt.title(f"ROC Curve - {name}")
    plt.savefig(REPORT_DIR / f"roc_curve_{name.replace(' ', '_')}.png")
    plt.close()

# === Save comparison table ===
results_df = pd.DataFrame(results)
results_df.to_csv(REPORT_DIR / "model_comparison.csv", index=False)
print("\n📊 Model comparison saved to report/model_comparison.csv")
print(results_df)

# === Save best model ===
joblib.dump(best_model, MODEL_DIR / "heart_disease_model_final.pkl")
print(f"\n🏆 Best Model: {best_name} | ROC-AUC: {best_score:.4f}")
print(f"✅ Final tuned model saved to {MODEL_DIR / 'heart_disease_model_final.pkl'}")
