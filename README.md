# Forensic Bone DNA Triage ver 1.0: A Multi-Model Machine Learning Approach

Developed by: **Phuong T.M. Chu (Rei)** 

Affiliation: **Center for DNA Identification (CDI), Institute of Biology (IB), Vietnam Academy of Science and Technology (VAST)**

---

## 📌 Project Overview
This repository presents a **pilot study** and a **prototype screening tool** designed to explore the potential of predicting mtDNA PCR success in degraded skeletal remains. Given the inherent complexity of forensic samples, this tool serves as a **preliminary decision-support system** rather than a definitive diagnostic solution.

Unlike single-algorithm approaches, this framework provides a **Multi-Model Comparison interface**, allowing researchers to observe predictions across five different machine learning architectures. This multi-perspective approach is intended to assist forensic experts in cross-validating results, thereby reducing the risk of prematurely discarding potentially viable samples.

**Current Limitations & Future Development:**
As a first-version prototype, the models are trained on a specific dataset from CDI and may exhibit limitations in generalized accuracy. Further refinement, including the integration of larger multi-center datasets and more robust feature engineering, is required to enhance the system's predictive power and reliability for routine forensic casework.

## 🔬 Predictive Architectures
The tool integrates five optimized models, each selected for its unique strengths in handling complex morphological data:

1.  **Deep Learning (Neural Network):** Captures high-dimensional non-linear patterns.
2.  **XGBoost (Gradient Boosting):** Optimized with a **Hybrid Heuristic Filter (n=5)** for superior specificity in extreme degradation cases.
3.  **Support Vector Machine (SVM):** Utilizes RBF kernels for robust classification in sparse feature spaces.
4.  **Random Forest (Ensemble Trees):** Provides stable predictions by reducing variance through bagging.
5.  **Logistic Regression:** Serves as a highly sensitive baseline and a "Strict 25% Filter" to ensure forensic safety.

## 🛠️ Hybrid Decision Logic
To bridge the gap between Artificial Intelligence and Forensic Expertise, the system employs a dual-layer validation:
- **Layer 1 (ML Probability):** Each model calculates a probability score based on 7 morphological characteristics.
- **Layer 2 (Expert Heuristics):**
    - **XGBoost Penalty:** If $\ge 5$ features show severe degradation, the model is penalized to prevent false PASS results.
    - **Strict Probability Guard:** If the baseline sensitivity (Logistic Regression) drops below 25%, traditional models are re-evaluated to prioritize forensic caution.

## 📂 File Structure
- `index.html`: The main user interface.
- `app.js`: Core logic for data processing and hybrid rules.
- `models.js`: JavaScript-transpiled ML model functions.
- `scaler_params.js`: Standardization parameters (mean/scale) and optimized thresholds.
- `dl_model/`: Contains the pre-trained Deep Learning model (JSON & Binary shards).
- `style.css`: UI styling.

## 🚀 How to Use
1. Access the tool via GitHub Pages: [Forensic Bone DNA Triage ver 1.0]([https://reichu31.github.io/CDI-Bone-Triage-Tool](https://reichu31.github.io/Forensic-Bone-DNA-Triage-Tool/)
2. Select the morphological grades for each of the 7 characteristics.
3. Choose a specific model or "All Models" for comparison.
4. Click **"Run Prediction"** to see the probability and PASS/FAIL status.

## 📜 Citation
If you find this tool useful for your research, please cite our manuscript and article:

- *Phuong T.M. Chu, Thomas J. Parsons, Anh P. Nguyen, Vinh V. Tran, Tuan A. Vu, Phong H. Do, Ha M. Tran, Mai T.T. Bui, Lan T.T. Ninh, Vu H. Nguyen, Ha H. Chu, Tien Q. Phi, Thanh T. Tran (2026). Application of Machine Learning to Evaluate the Predictive Potential of Morphological Characteristics for Mitochondrial DNA Profiling from Challenging Bone Samples. (Manuscript)*
- *Parsons TJ, Nguyen NN, Le DT, Chu PT, Vu TA, Tran VV, Do PH, Tran LH, Tran HM, Bui MT, Hoang TT (2026) DNA Preservation in Highly Degraded Skeletal Remains from the Vietnam War—Characterization and DNA Extraction Evaluation for Nuclear SNP Panel Testing. Forensic Science International: Genetics. 2026 Feb 2:103443.*

---
© 2026 Center for DNA Identification (CDI) | IB | VAST
