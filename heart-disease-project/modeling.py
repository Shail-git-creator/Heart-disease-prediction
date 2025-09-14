import pandas as pd
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
import joblib

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# Load train/test sets
X_train = pd.read_csv(PROCESSED_DIR / "X_train.csv")
X_test = pd.read_csv(PROCESSED_DIR / "X_test.csv")
y_train = pd.read_csv(PROCESSED_DIR / "y_train.csv").values.ravel()
y_test = pd.read_csv(PROCESSED_DIR / "y_test.csv").values.ravel()

print("✅ Data loaded")
print("X_train shape:", X_train.shape)
print("Columns available:", X_train.columns.tolist())

# === Define expected feature groups ===
categorical = ["cp", "sex", "fbs", "restecg", "exang", "slope", "thal"]
numerical = ["age", "trestbps", "chol", "thalach", "oldpeak", "ca"]

# Keep only columns that actually exist in the dataset
categorical = [c for c in categorical if c in X_train.columns]
numerical = [c for c in numerical if c in X_train.columns]

print("Final categorical features used:", categorical)
print("Final numerical features used:", numerical)

# Preprocessing
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
    ("num", StandardScaler(), numerical)
])

# === Define models to test (inside pipeline) ===
models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest": RandomForestClassifier(n_estimators=200, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(random_state=42),
    "SVM": SVC(probability=True, random_state=42),
    "KNN": KNeighborsClassifier(n_neighbors=7)
}

results = []

# === Train & evaluate each model ===
for name, model in models.items():
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else None

    results.append({
        "Model": name,
        "Accuracy": accuracy_score(y_test, y_pred),
        "Precision": precision_score(y_test, y_pred),
        "Recall": recall_score(y_test, y_pred),
        "F1": f1_score(y_test, y_pred),
        "ROC-AUC": roc_auc_score(y_test, y_prob) if y_prob is not None else "N/A"
    })

# === Convert results to DataFrame ===
results_df = pd.DataFrame(results).set_index("Model")
print("\n🔹 Model Comparison:\n")
print(results_df)

# === Save best pipeline (highest F1) ===
best_model_name = results_df["F1"].astype(float).idxmax()
best_model = models[best_model_name]

# Rebuild pipeline with best model
best_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", best_model)
])

best_pipeline.fit(X_train, y_train)

MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(best_pipeline, MODEL_DIR / "heart_disease_pipeline.pkl")
print(f"\n✅ Best pipeline ({best_model_name}) saved to {MODEL_DIR / 'heart_disease_pipeline.pkl'}")
