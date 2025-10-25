# 📓 Jupyter Notebooks

Machine learning training and analysis notebooks for the hate speech detection system.

## 📁 Structure

```
notebooks/
├── hate_speech_model_training.ipynb  # Main training notebook
└── README.md                         # This file
```

## 🚀 Quick Start

### 1. Start Jupyter
```bash
cd notebooks/
jupyter notebook
```

### 2. Open Training Notebook
Open `hate_speech_model_training.ipynb`

### 3. Run All Cells
Execute cells in order to train the model

## 📊 Training Pipeline

The notebook follows this complete pipeline:

1. **📊 Data Loading** - Load and explore dataset
2. **🔧 Data Preprocessing** - Clean and prepare data
3. **🎯 Binary Classification** - Create foul vs proper labels
4. **🔄 Train/Test Split** - Split data for training/testing
5. **🔧 Feature Extraction** - TF-IDF with bigrams
6. **🔍 Fair Model Comparison** - Test 3 models fairly
7. **🎯 Manual Model Selection** - Choose best model
8. **🔧 Grid Search Optimization** - Optimize selected model
9. **🎯 Threshold Optimization** - Tune decision threshold
10. **💾 Save Model** - Save optimized model
11. **🧪 Test Model** - Verify model works

## 🎯 Models Tested

1. **Logistic Regression** - Linear model, interpretable
2. **SVM Linear** - Support Vector Machine, robust
3. **SVM RBF** - Non-linear SVM, flexible
4. **Naive Bayes** - Probabilistic, fast

## 📈 Performance Metrics

- **Accuracy** - Overall correctness
- **Precision** - Avoid false alarms
- **Recall** - Catch all bad content
- **F1-Score** - Balanced performance
- **ROC-AUC** - Discrimination ability

## 🔧 Requirements

```bash
pip install jupyter pandas numpy scikit-learn matplotlib seaborn
```

## 📝 Usage Tips

### Running the Notebook
1. **Run cells sequentially** - Don't skip cells
2. **Check outputs** - Verify each step works
3. **Save frequently** - Save your progress
4. **Read comments** - Follow the explanations

### Model Selection
- The notebook **automatically selects** the best model
- You can **manually override** in Cell 11 if needed
- Grid search **optimizes** the selected model
- Final model is **saved automatically**

### Troubleshooting
- **NaN errors**: Check data preprocessing
- **Memory issues**: Reduce dataset size
- **Slow training**: Use fewer grid search parameters

## 🎯 Expected Results

After running the complete pipeline:
- **Model saved**: `../models/saved/hate_speech_model.pkl`
- **Performance**: F1 > 0.95, Accuracy > 0.95
- **Ready for API**: Model can be loaded by Flask API

## 🔧 Customization

### Change Model Selection
In Cell 11, modify:
```python
SELECTED_MODEL = "Your Preferred Model"
```

### Adjust Threshold
In Cell 15, change:
```python
optimal_threshold = 0.3  # Your preferred threshold
```

### Modify Grid Search
In Cell 13, adjust parameter grids for different models.
