# 😊 Facial Expression Recognition (CNN vs Swin Transformer)

## 📌 Project Overview

This project focuses on building a **Facial Expression Recognition system** and comparing the performance of two different deep learning approaches:

* Convolutional Neural Networks (CNN)
* Swin Transformer

The goal was not only to build a working model, but also to analyze how architecture choice impacts performance on facial expression data.

---

## 🧠 Data Preprocessing

During preprocessing, we carefully prepared the dataset to ensure the models could learn effectively.

This included:

* Data cleaning
* Image resizing and normalization
* Data augmentation to improve generalization

The preprocessing step played a key role in improving model stability and performance.

---

## 🧪 CNN Approach (Baseline Model)

We first implemented a **Convolutional Neural Network (CNN)** as a baseline model.

### Results:

* The model was able to learn basic patterns
* However, performance was limited

### Limitations:

* Fixed receptive field
* Focus on local features only
* Difficulty capturing full facial context
* Struggled with variations in pose and expression

Although CNN worked, it did not achieve strong generalization.

---

## 🚀 Swin Transformer Approach (Improved Model)

After initial experiments, we switched to the **Swin Transformer architecture**.

The decision was based on its ability to capture both local and global dependencies in images.

### Why Swin Transformer:

* Uses self-attention mechanism
* Shifted window strategy improves context understanding
* Better at capturing global facial relationships
* Handles variations in pose and expressions more effectively

### Optimization:

We fine-tuned pretrained Swin Transformer weights and performed multiple experiments to achieve optimal performance.

---

## 🔄 System Design (End-to-End)

We also built a simple **frontend-backend pipeline** to demonstrate the system in real use:

* Backend: Model inference and prediction
* Frontend: User interface for interaction

This allowed us to visualize the complete workflow from input image to predicted emotion.

---

## 📊 Key Insights

* CNN performs well as a baseline but has limitations in complex visual understanding
* Swin Transformer significantly improves performance due to self-attention
* Architecture choice has a major impact on model effectiveness
* Real experimentation and tuning are essential for good results

---

## 🎓 Conclusion

This project demonstrated that model selection, preprocessing quality, and iterative experimentation are crucial in deep learning workflows.

The transition from CNN to Swin Transformer clearly showed how modern architectures can better handle complex vision tasks like facial expression recognition.

---
<img width="1457" height="868" alt="Screenshot 2026-01-25 031626" src="https://github.com/user-attachments/assets/6c6010c6-d382-4f36-9970-1aa12e0b0520" />

## 👩‍💻 Author

**Marihan Sabry**
AI Student | Machine Learning & Computer Vision Enthusiast

💭 *"The best results come from experimenting, failing, and improving."*
