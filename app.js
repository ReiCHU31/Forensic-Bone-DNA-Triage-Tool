/**
 * Bone DNA Triage Tool - Core Logic
 * Center for DNA Identification (CDI), IB, VAST
 * Optimized with Hybrid XGBoost (n=5) and Strict 25% Probability Filter
 * 2026 Version
 */



let dlModel;

/**
 * Initialize Deep Learning model
 */
async function init() {
    try {
        dlModel = await tf.loadLayersModel('./dl_model/model.json');
        console.log("Deep Learning model loaded successfully.");
    } catch (e) {
        console.error("Detailed Error:", e);
        console.warn("DL Model load failed. Ensure the folder name is 'dl_model' (lowercase) and contains model.json");
    }
}

function sigmoid(x) { 
    return 1 / (1 + Math.exp(-x)); 
}

/**
 * Get Prediction Probability
 */
async function getProb(modelId, scaled, raw) {
    let p = 0;
    try {
        const inputData = new Float64Array(scaled);
        const rawData = new Float64Array(raw);
        
        if (modelId === 'dl') {
            if (!dlModel) return -1;
            const pred = dlModel.predict(tf.tensor2d([scaled]));
            const data = await pred.data();
            p = data[0];
        } else {
            if (modelId === 'svm') {
                p = sigmoid(predict_svm(inputData)); 
            } else if (modelId === 'xgb') {
                p = predict_xgb(rawData)[1]; 
            } else if (modelId === 'rf') {
                p = predict_rf(rawData)[1]; 
            } else if (modelId === 'lr') {
                p = sigmoid(predict_lr(inputData));
            }
        }
    } catch (e) {
        console.error(`Prediction error (${modelId}):`, e);
        return 0;
    }
    return isNaN(p) ? 0 : p;
}

/**
 * Main Prediction Execution
 */
async function predict() {
    let rawInputs = [];
    let severeCount = 0;

    // 1. Data Collection & Feature Degradation Counting
    for(let i=0; i<7; i++) {
        let val = parseFloat(document.getElementById('f'+i).value);
        rawInputs.push(val);
        if (val >= 0.25) severeCount++;
    }
    
    let scaled = rawInputs.map((val, i) => (val - scaler_means[i]) / scaler_scales[i]);

    const choice = document.getElementById('model-choice').value;
    const multiBox = document.getElementById('multi-result');
    const singleBox = document.getElementById('single-result');

    // Get Logistic Regression probability as a "Sanity Check" baseline
    const lrProbCheck = await getProb('lr', scaled, rawInputs);

    if (choice === 'all') {
        singleBox.classList.add('hidden');
        multiBox.classList.remove('hidden');
        
        const modelList = [
            {id:'xgb', n:'XGBoost (Hybrid)'}, 
            {id:'dl',  n:'Deep Learning'}, 
            {id:'svm', n:'SVM'}, 
            {id:'rf',  n:'Random Forest'}, 
            {id:'lr',  n:'Logistic Regression'}
        ];

        let html = '';
        for (let m of modelList) {
            let p = await getProb(m.id, scaled, rawInputs);
            
            // Map threshold keys from scaler_params.js
            let thresholdKey = (m.id === 'xgb') ? "XGBoost (Tuned)" : 
                               (m.id === 'svm') ? "Support Vector Machine" :
                               (m.id === 'rf') ? "Random Forest" :
                               (m.id === 'lr') ? "Logistic Regression" : "dl";
            
            let threshold = (m.id === 'dl') ? 0.2823 : THRESHOLDS[thresholdKey];
            
            let displayP, status;
            if (p === -1) {
                displayP = "N/A";
                status = '<span class="fail-text">LOAD ERROR</span>';
            } else {
                displayP = (p * 100).toFixed(2) + "%";
                let isPass = p >= threshold;

                // --- INTEGRATED HYBRID & SANITY LOGIC ---

                // 1. Exclusive Heuristic Penalty for XGBoost (n=5)
                if (m.id === 'xgb' && severeCount >= HEURISTIC_N) {
                    isPass = false;
                }

                /**
                 * 2. STRICT 25% FILTER (Correcting SVM/RF Optimism)
                 * If Logistic Regression (most sensitive) is < 25%, 
                 * OR the model's own probability is < 25%, force FAIL.
                 * (Note: DL is excluded from this specific rule to maintain its independent logic)
                 */
                if (m.id !== 'dl' && (lrProbCheck < 0.25 || p < 0.25)) {
                    isPass = false;
                }

                status = isPass ? '<span class="pass-text">PASS</span>' : '<span class="fail-text">FAIL</span>';
            }
            html += `<tr><td>${m.n}</td><td>${displayP}</td><td>${status}</td></tr>`;
        }
        document.getElementById('multi-table-body').innerHTML = html;

    } else {
        // Single Model Mode Logic
        multiBox.classList.add('hidden');
        singleBox.classList.remove('hidden', 'pass', 'fail');
        
        let p = await getProb(choice, scaled, rawInputs);
        if (p === -1) {
            document.getElementById('prob-val').innerText = "Load Error";
            return;
        }
        
        document.getElementById('prob-val').innerText = (p * 100).toFixed(2);
        
        let thresholdKey = (choice === 'xgb') ? "XGBoost (Tuned)" : 
                           (choice === 'svm') ? "Support Vector Machine" :
                           (choice === 'rf') ? "Random Forest" :
                           (choice === 'lr') ? "Logistic Regression" : "dl";
        
        let threshold = (choice === 'dl') ? 0.2823 : THRESHOLDS[thresholdKey];
        let isPass = p >= threshold;

        // Apply same strict filters to Single Mode
        if (choice === 'xgb' && severeCount >= HEURISTIC_N) isPass = false;
        if (choice !== 'dl' && (lrProbCheck < 0.25 || p < 0.25)) isPass = false;

        document.getElementById('status-text').innerText = isPass ? "PASS" : "FAIL";
        singleBox.classList.add(isPass ? 'pass' : 'fail');
    }
}

init();
