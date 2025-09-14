import pandas as pd
from sklearn.model_selection import train_test_split
from pathlib import Path

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
PROCESSED_PATH = BASE_DIR / "data" / "processed" / "processed.csv"
OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("🔍 Looking for processed.csv at:", PROCESSED_PATH)

# === Load data ===
if not PROCESSED_PATH.exists():
    raise FileNotFoundError(f"❌ processed.csv not found at {PROCESSED_PATH}. "
                            f"Make sure you ran clean_and_eda.py first!")

df = pd.read_csv(PROCESSED_PATH)
print("✅ Loaded processed.csv successfully, shape:", df.shape)

# === Features & target ===
if "target" not in df.columns:
    raise KeyError("❌ 'target' column not found in processed.csv. Check clean_and_eda.py preprocessing.")

X = df.drop(columns=["target"])
y = df["target"]

# === Train/Test split ===
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# === Save to processed folder ===
X_train.to_csv(OUTPUT_DIR / "X_train.csv", index=False)
X_test.to_csv(OUTPUT_DIR / "X_test.csv", index=False)
y_train.to_csv(OUTPUT_DIR / "y_train.csv", index=False)
y_test.to_csv(OUTPUT_DIR / "y_test.csv", index=False)

print("✅ Train/Test data saved to:", OUTPUT_DIR.resolve())
print("   - X_train.csv, X_test.csv, y_train.csv, y_test.csv")