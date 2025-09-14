import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "raw" / "heart_disease_uci.csv"
OUTPUTPATH = BASE_DIR / "data" / "processed" / "processed.csv"
OUTPUTPATH.parent.mkdir(exist_ok=True)

# === Load Data ===
heartData = pd.read_csv(DATA_FILE)
print("Original shape:", heartData.shape)
print("Missing values:", heartData.isnull().sum())
print("DataTypes:", heartData.dtypes)

# === Handle Missing Values ===
heartData['trestbps'] = heartData['trestbps'].fillna(heartData['trestbps'].median())
heartData['chol'] = heartData['chol'].fillna(heartData['chol'].median())
heartData['thalch'] = heartData['thalch'].fillna(heartData['thalch'].median())
heartData['oldpeak'] = heartData['oldpeak'].fillna(heartData['oldpeak'].median())
heartData['ca'] = heartData['ca'].fillna(heartData['ca'].median())

for col in ["slope", "thal", "restecg", "cp", "sex", "exang", "fbs"]:
    heartData[col] = heartData[col].fillna("missing")

# === Drop useless columns ===
if "id" in heartData.columns:
    heartData.drop(columns=["id"], inplace=True)

if "dataset" in heartData.columns:
    heartData.drop(columns=["dataset"], inplace=True)

# === Simplify target column ===
heartData["target"] = heartData["num"].apply(lambda x: 1 if x > 0 else 0)
heartData.drop(columns=["num"], inplace=True)

# === After cleaning ===
print(heartData.info())
print(heartData.head(6))

# === Save cleaned data ===
heartData.to_csv(OUTPUTPATH, index=False)
print(f"✅ Cleaned dataset saved to {OUTPUTPATH.resolve()}")

# === Visualization ===
REPORT_DIR = BASE_DIR / "report"
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# Class balance
plt.figure(figsize=(7, 5))
sns.countplot(x='target', data=heartData)
plt.title("Class balance: Heart Disease (0 = NO, 1 = YES)")
plt.savefig(REPORT_DIR / "class_balance.png")
plt.close()

# Age distribution
plt.figure(figsize=(7, 5))
sns.histplot(data=heartData, x="age", hue="target", multiple="stack", bins=20)
plt.title("Age distribution by Heart Disease")
plt.savefig(REPORT_DIR / "age_distribution.png")
plt.close()

# Correlation heatmap
plt.figure(figsize=(7, 5))
numeric_col = heartData.select_dtypes(include=["int64", "float64"]).columns
corr = heartData[numeric_col].corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm")
plt.title("Correlation heatmap (numeric features)")
plt.savefig(REPORT_DIR / "correlation_heatmap.png")
plt.close()

# Cholesterol vs Target (hue = sex)
plt.figure(figsize=(8, 6))
sns.boxplot(x="target", y="chol", data=heartData, hue="sex", palette="Set2")
plt.title("Cholesterol level v/s Heart Disease")
plt.xlabel("Heart Disease (0 = NO, 1 = YES)")
plt.ylabel("Cholesterol level (mg/dl)")
plt.tight_layout()
plt.savefig(REPORT_DIR / "Cholesterol_vs_target.png")
plt.close()

# Max heart rate (thalach) by age group
heartData['age_group'] = pd.cut(
    heartData['age'],
    bins=[20, 35, 50, 65, 80],
    labels=["20-35", "36-50", "51-65", "66-80"]
)
plt.figure(figsize=(8, 6))
sns.boxplot(x="age_group", y="thalch", hue="target", data=heartData, palette="Set1")
plt.title("Max heart rate (thalch) by Age Group & Target")
plt.xlabel("Age group")
plt.ylabel("Max heart rate (thalch)")
plt.tight_layout()
plt.savefig(REPORT_DIR / "thalch_by_agegroup.png")
plt.close()
