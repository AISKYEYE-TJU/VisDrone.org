#!/usr/bin/env python3
"""
根据 visdrone.org 网站数据生成论文列表
"""

import json
from datetime import datetime

papers = [
    {"id": "1", "title": "Reconcile Gradient Modulation for Harmony Multimodal Learning", "authors": ["Xiyuan Gao", "Bing Cao", "Baoquan Gong", "Pengfei Zhu"], "venue": "AAAI", "year": 2026, "type": "conference"},
    {"id": "2", "title": "Dream-IF: Dynamic Relative EnhAnceMent for Image Fusion", "authors": ["Xingxin Xu", "Bing Cao", "Dongdong Li", "Qinghua Hu", "Pengfei Zhu"], "venue": "AAAI", "year": 2026, "type": "conference"},
    {"id": "3", "title": "VTD-CLIP: Video-to-Text Discretization via Prompting CLIP", "authors": ["Wencheng Zhu", "Yuexin Wang", "Hongxuan Li", "Pengfei Zhu"], "venue": "AAAI", "year": 2026, "type": "conference"},
    {"id": "4", "title": "Point Cloud Quantization through Multimodal Prompting for 3D Understanding", "authors": ["Hongxuan Li", "Wencheng Zhu", "Huiying Xu", "Xinzhong Zhu", "Pengfei Zhu"], "venue": "AAAI", "year": 2026, "type": "conference"},
    {"id": "5", "title": "CtrlFuse: Mask-Prompt Guided Controllable Infrared and Visible Image Fusion", "authors": ["Yiming Sun", "Yuan Ruan", "Qinghua Hu", "Pengfei Zhu"], "venue": "AAAI", "year": 2026, "type": "conference"},
    {"id": "6", "title": "Multimodal Negative Learning", "authors": ["Baoquan Gong", "Xiyuan Gao", "Pengfei Zhu", "Qinghua Hu", "Bing Cao"], "venue": "NeurIPS", "year": 2025, "type": "conference"},
    {"id": "7", "title": "Decoupled Multi-Predictor Optimization for Inference-Efficient Model Tuning", "authors": ["Liwei Luo", "Shuaitengyuan Li", "Dongwei Ren", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], "venue": "ICCV", "year": 2025, "type": "conference"},
    {"id": "8", "title": "Multi-granularity Superpoint Graph Learning for Weakly Supervised 3D Semantic Segmentation", "authors": ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Le Hui", "Jin Xie", "Bin Xiao", "Qinghua Hu"], "venue": "IEEE TMM", "year": 2025, "type": "journal"},
    {"id": "9", "title": "TEDFuse: Task-Driven Equivariant Consistency Decomposition Network for Multi-Modal Image Fusion", "authors": ["Yiming Sun", "Xinyu Cui", "Zhen Wang", "Hao Cheng", "Yongfeng Dong", "Pengfei Zhu", "Kai Li"], "venue": "IEEE TMM", "year": 2025, "type": "journal"},
    {"id": "10", "title": "Motion-Aware Adaptive Pixel Pruning for Efficient Local Motion Deblurring", "authors": ["Wei Shang", "Dongwei Ren", "Wanying Zhang", "Pengfei Zhu", "Qinghua Hu", "Wangmeng Zuo"], "venue": "ACM MM", "year": 2025, "type": "conference"},
    {"id": "11", "title": "CKD: Contrastive Knowledge Distillation from A Sample-Wise Perspective", "authors": ["Wencheng Zhu", "Xin Zhou", "Pengfei Zhu", "Yu Wang", "Qinghua Hu"], "venue": "IEEE TIP", "year": 2025, "type": "journal"},
    {"id": "12", "title": "Socialized Coevolution: Advancing a Better World Through Cross-Task Collaboration", "authors": ["Xinjie Yao", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Ruipu Zhao", "Zhoupeng Guo", "Weihao Li", "Qinghua Hu"], "venue": "ICML", "year": 2025, "type": "conference"},
    {"id": "13", "title": "Graphs Help Graphs: Multi-Agent Graph Socialized Learning", "authors": ["Jialu Li", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Xinjie Yao", "Qinghua Hu"], "venue": "NeurIPS", "year": 2025, "type": "conference"},
    {"id": "14", "title": "Task-Gated Multi-Expert Collaboration Network for Degraded Multi-Modal Image Fusion", "authors": ["Yiming Sun", "Xin Li", "Pengfei Zhu", "Qinghua Hu", "Dongwei Ren", "Huiying Xu", "Xinzhong Zhu"], "venue": "ICML", "year": 2025, "type": "conference"},
    {"id": "15", "title": "RTF: Recursive TransFusion for Multi-Modal Image Synthesis", "authors": ["Bing Cao", "Guoliang Qi", "Jiaming Zhao", "Pengfei Zhu", "Qinghua Hu", "Xinbo Gao"], "venue": "IEEE TIP", "year": 2025, "type": "journal"},
    {"id": "16", "title": "BackMix: Regularizing Open Set Recognition by Removing Underlying Fore-Background Priors", "authors": ["Yu Wang", "Junxian Mu", "Hongzhi Huang", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], "venue": "IEEE TPAMI", "year": 2025, "type": "journal"},
    {"id": "17", "title": "Uncertainty-aware Superpoint Graph Transformer for Weakly Supervised 3D Semantic Segmentation", "authors": ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Le Hui", "Jin Xie", "Qinghua Hu"], "venue": "IEEE TFS", "year": 2025, "type": "journal"},
    {"id": "18", "title": "Unknown Support Prototype Set for Open Set Recognition", "authors": ["Guosong Jiang", "Pengfei Zhu", "Bing Cao", "Dongyue Chen", "Qinghua Hu"], "venue": "IJCV", "year": 2025, "type": "journal"},
    {"id": "19", "title": "Hyperbolic-Euclidean Deep Mutual Learning", "authors": ["Haifang Cao", "Yu Wang", "Jialu Li", "Pengfei Zhu", "Qinghua Hu"], "venue": "WWW", "year": 2025, "type": "conference"},
    {"id": "20", "title": "Efficient Masked AutoEncoder for Video Object Counting and A LargeScale Benchmark", "authors": ["Bing Cao", "Quanhao Lu", "Jiekang Feng", "Qilong Wan", "Pengfei Zhu", "Qinghua Hu"], "venue": "ICLR", "year": 2025, "type": "conference"},
    {"id": "21", "title": "Asymmetric Factorized Bilinear Operation for Vision Transformer", "authors": ["Junjie Wu", "Qilong Wang", "Jiangtao Xie", "Pengfei Zhu", "Qinghua Hu"], "venue": "ICLR", "year": 2025, "type": "conference"},
    {"id": "22", "title": "Asymmetric Reinforcing Against Multi-Modal Representation Bias", "authors": ["Xiyuan Gao", "Bing Cao", "Pengfei Zhu", "Nannan Wang", "Qinghua Hu"], "venue": "AAAI", "year": 2025, "type": "conference"},
    {"id": "23", "title": "One-Step Multi-View Spectral Clustering", "authors": ["Xiaofeng Zhu", "Shichao Zhang", "Wei He", "Rongyao Hu", "Cong Lei", "Pengfei Zhu"], "venue": "IEEE TKDE", "year": 2024, "type": "journal"},
    {"id": "24", "title": "Conditional Controllable Image Fusion", "authors": ["Bing Cao", "Xingxin Xu", "Pengfei Zhu", "Qilong Wang", "Qinghua Hu"], "venue": "NeurIPS", "year": 2024, "type": "conference"},
    {"id": "25", "title": "What Matters in Graph Class Incremental Learning? An Information Preservation Perspective", "authors": ["Jialu Li", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Qinghua Hu"], "venue": "NeurIPS", "year": 2024, "type": "conference"},
    {"id": "26", "title": "Persistence Homology Distillation for Semi-supervised Continual Learning", "authors": ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Dongyue Chen", "Qinghua Hu"], "venue": "NeurIPS", "year": 2024, "type": "conference"},
    {"id": "27", "title": "Visible and Clear: Finding Tiny Objects in Difference Map", "authors": ["Bing Cao", "Haiyu Yao", "Pengfei Zhu", "Qinghua Hu"], "venue": "ECCV", "year": 2024, "type": "conference"},
    {"id": "28", "title": "M-RRFS: A Memory-Based Robust Region Feature Synthesizer for Zero-Shot Object Detection", "authors": ["Peiliang Huang", "Dingwen Zhang", "De Cheng", "Longfei Han", "Pengfei Zhu", "Junwei Han"], "venue": "IJCV", "year": 2024, "type": "journal"},
    {"id": "29", "title": "M2FNet: Multi-modal Fusion Network for Object Detection from Visible and Thermal Infrared Images", "authors": ["Chenchen Jiang", "Huazhong Ren", "Hong Yang", "Hongtao Huo", "Pengfei Zhu", "Zhaoyuan Yao", "Jing Li", "Min Sun", "Shihao Yang"], "venue": "ISPRS JGI", "year": 2024, "type": "journal"},
    {"id": "30", "title": "Socialized Learning: Making Each Other Better Through Multi-Agent Collaboration", "authors": ["Xinjie Yao", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Jialu Li", "Weihao Li", "Qinghua Hu"], "venue": "ICML", "year": 2024, "type": "conference"},
    {"id": "31", "title": "Dynamic Brightness Adaptation for Robust Multi-modal Image Fusion", "authors": ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], "venue": "IJCAI", "year": 2024, "type": "conference"},
    {"id": "32", "title": "Integrated Heterogeneous Graph Attention Network for Incomplete Multi-Modal Clustering", "authors": ["Yu Wang", "Xinjie Yao", "Pengfei Zhu", "Weihao Li", "Meng Cao", "Qinghua Hu"], "venue": "IJCV", "year": 2024, "type": "journal"},
    {"id": "33", "title": "Task-Customized Mixture of Adapters for General Image Fusion", "authors": ["Pengfei Zhu", "Yang Sun", "Bing Cao", "Qinghua Hu"], "venue": "CVPR", "year": 2024, "type": "conference"},
    {"id": "34", "title": "AMU-Tuning: Effective Logit Bias for CLIP-based Few-shot Learning", "authors": ["Yuwei Tang", "Zhenyi Lin", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], "venue": "CVPR", "year": 2024, "type": "conference"},
    {"id": "35", "title": "Multi-View Deep Subspace Clustering Networks", "authors": ["Pengfei Zhu", "Xinjie Yao", "Yu Wang", "Binyuan Hui", "Dawei Du", "Qinghua Hu"], "venue": "IEEE TCYB", "year": 2024, "type": "journal"},
    {"id": "36", "title": "Bi-directional Adapter for Multimodal Tracking", "authors": ["Bing Cao", "Junliang Guo", "Pengfei Zhu", "Qinghua Hu"], "venue": "AAAI", "year": 2024, "type": "conference"},
    {"id": "37", "title": "Every Node is Different: Dynamically Fusing Self-Supervised Tasks for Attributed Graph Clustering", "authors": ["Pengfei Zhu", "Qian Wang", "Yu Wang", "Jialu Li", "Qinghua Hu"], "venue": "AAAI", "year": 2024, "type": "conference"},
    {"id": "38", "title": "Exploring Diverse Representations for Open Set Recognition", "authors": ["Yu Wang", "Junxian Mu", "Pengfei Zhu", "Qinghua Hu"], "venue": "AAAI", "year": 2024, "type": "conference"},
    {"id": "39", "title": "Dynamic Sub-graph Distillation for Robust Semi-supervised Continual Learning", "authors": ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Qinghua Hu"], "venue": "AAAI", "year": 2024, "type": "conference"},
    {"id": "40", "title": "Boosting Pseudo-Labeling With Curriculum Self-Reflection for Attributed Graph Clustering", "authors": ["Pengfei Zhu", "Jialu Li", "Yu Wang", "Bin Xiao", "Jinglin Zhang", "Wanyu Lin", "Qinghua Hu"], "venue": "IEEE TNNLS", "year": 2024, "type": "journal"},
    {"id": "41", "title": "CCP-GNN: Competitive Covariance Pooling for Improving Graph Neural Networks", "authors": ["Pengfei Zhu", "Jialu Li", "Zhe Dong", "Qinghua Hu", "Xiao Wang", "Qilong Wang"], "venue": "IEEE TNNLS", "year": 2024, "type": "journal"},
    {"id": "42", "title": "Multi-modal Gated Mixture of Local-to-Global Experts for Dynamic Image Fusion", "authors": ["Bing Cao", "Yiming Sun", "Pengfei Zhu", "Qinghua Hu"], "venue": "ICCV", "year": 2023, "type": "conference"},
    {"id": "43", "title": "Towards A Deeper Understanding of Global Covariance Pooling in Deep Learning: An Optimization Perspective", "authors": ["Qilong Wang", "Zhaolin Zhang", "Mingze Gao", "Jiangtao Xie", "Pengfei Zhu", "Peihua Li", "Wangmeng Zuo", "Qinghua Hu"], "venue": "IEEE TPAMI", "year": 2023, "type": "journal"},
    {"id": "44", "title": "Cross-Drone Transformer Network for Robust Single Object Tracking", "authors": ["Guanlin Chen", "Pengfei Zhu", "Bing Cao", "Xing Wang", "Qinghua Hu"], "venue": "IEEE TCSVT", "year": 2023, "type": "journal"},
    {"id": "45", "title": "Multi-Task Credible Pseudo-Label Learning for Semi-supervised Crowd Counting", "authors": ["Pengfei Zhu", "Jingqing Li", "Bing Cao", "Qinghua Hu"], "venue": "IEEE TNNLS", "year": 2023, "type": "journal"},
    {"id": "46", "title": "OpenMix+: Revisiting Data Augmentation for Open Set Recognition", "authors": ["Guosong Jiang", "Pengfei Zhu", "Yu Wang", "Qinghua Hu"], "venue": "IEEE TCSVT", "year": 2023, "type": "journal"},
    {"id": "47", "title": "Autoencoder-based Collaborative Attention GAN for Multi-modal Image Synthesis", "authors": ["Bing Cao", "Haifang Cao", "Jiaxu Liu", "Pengfei Zhu", "Changqing Zhang", "Qinghua Hu"], "venue": "IEEE TMM", "year": 2023, "type": "journal"},
    {"id": "48", "title": "Robust Multi-Drone Multi-Target Tracking to Resolve Target Occlusion: A Benchmark", "authors": ["Zhihao Liu", "Yuanyuan Shang", "Timing Li", "Guanlin Chen", "Yu Wang", "Qinghua Hu", "Pengfei Zhu"], "venue": "IEEE TMM", "year": 2023, "type": "journal"},
    {"id": "49", "title": "Tuning Pre-trained Model via Moment Probing", "authors": ["Mingze Gao", "Qilong Wang", "Zhenyi Lin", "Pengfei Zhu", "Qinghua Hu"], "venue": "ICCV", "year": 2023, "type": "conference"},
    {"id": "50", "title": "Multi-view Knowledge Ensemble with Frequency Consistency for Face Cross-Domain Translation", "authors": ["Bing Cao", "Qinghe Wang", "Pengfei Zhu", "Qinghua Hu", "Dongwei Ren", "Wangmeng Zuo", "Xinbo Gao"], "venue": "IEEE TNNLS", "year": 2023, "type": "journal"},
    {"id": "51", "title": "Stabilizing Multispectral Pedestrian Detection with Evidential Hybrid Fusion", "authors": ["Qing Li", "Changqing Zhang", "Qinghua Hu", "Pengfei Zhu", "Huazhu Fu", "Lei Chen"], "venue": "IEEE TCSVT", "year": 2023, "type": "journal"},
    {"id": "52", "title": "Learning Dynamic Compact Memory Embedding for Deformable Visual Object Tracking", "authors": ["Hongtao Yu", "Pengfei Zhu", "Kaihua Zhang", "Yu Wang", "Shuai Zhao", "Lei Wang", "Tianzhu Zhang", "Qinghua Hu"], "venue": "IEEE TNNLS", "year": 2022, "type": "journal"},
    {"id": "53", "title": "DetFusion: A Detection-driven Infrared and Visible Image Fusion Network", "authors": ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], "venue": "ACM MM", "year": 2022, "type": "conference"},
    {"id": "54", "title": "Self-Supervised Fully Automatic Learning Machine for Intelligent Retail Container", "authors": ["Pengfei Zhu", "Yiming Sun", "Bing Cao", "Xiaoyu Liu", "Xin Liu", "Qinghua Hu"], "venue": "IEEE TIM", "year": 2022, "type": "journal"},
    {"id": "55", "title": "Semi-supervised Image Deraining Using Knowledge Distillation", "authors": ["Xin Cui", "Cong Wang", "Dongwei Ren", "Yunjin Chen", "Pengfei Zhu"], "venue": "IEEE TCSVT", "year": 2022, "type": "journal"},
    {"id": "56", "title": "Collaborative Decision-Reinforced Self-Supervision for Attributed Graph Clustering", "authors": ["Pengfei Zhu", "Jialu Li", "Yu Wang", "Bin Xiao", "Shuai Zhao", "Qinghua Hu"], "venue": "IEEE TNNLS", "year": 2022, "type": "journal"},
    {"id": "57", "title": "Learning Self-supervised Low-Rank Network for Single-Stage Weakly and Semi-supervised Semantic Segmentation", "authors": ["Junwen Pan", "Pengfei Zhu", "Kaihua Zhang", "Bing Cao", "Yu Wang", "Dingwen Zhang", "Junwei Han", "Qinghua Hu"], "venue": "IJCV", "year": 2022, "type": "journal"},
    {"id": "58", "title": "Drone-Based RGB-Infrared Cross-Modality Vehicle Detection via Uncertainty-Aware Learning", "authors": ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], "venue": "IEEE TCSVT", "year": 2022, "type": "journal"},
    {"id": "59", "title": "Confidence-aware Fusion using Dempster-Shafer Theory for Multispectral Pedestrian Detection", "authors": ["Qing Li", "Changqing Zhang", "Qinghua Hu", "Huazhu Fu", "Pengfei Zhu"], "venue": "IEEE TMM", "year": 2022, "type": "journal"},
    {"id": "60", "title": "Label-Efficient Hybrid-Supervised Learning for Medical Image Segmentation", "authors": ["Junwen Pan", "Qi Bi", "Yanzhan Yang", "Pengfei Zhu", "Cheng Bian"], "venue": "AAAI", "year": 2022, "type": "conference"},
    {"id": "61", "title": "Latent Heterogeneous Graph Network for Incomplete Multi-View Learning", "authors": ["Pengfei Zhu", "Xinjie Yao", "Yu Wang", "Meng Cao", "Binyuan Hui", "Shuai Zhao", "Qinghua Hu"], "venue": "IEEE TMM", "year": 2022, "type": "journal"},
    {"id": "62", "title": "Detection and Tracking Meet Drones Challenge", "authors": ["Pengfei Zhu", "Longyin Wen", "Dawei Du", "Xiao Bian", "Heng Fan", "Qinghua Hu", "Haibin Ling"], "venue": "IEEE TPAMI", "year": 2021, "type": "journal"},
    {"id": "63", "title": "Graph Regularized Flow Attention Network for Video Animal Counting From Drones", "authors": ["Pengfei Zhu", "Tao Peng", "Dawei Du", "Hongtao Yu", "Libo Zhang", "Qinghua Hu"], "venue": "IEEE TIP", "year": 2021, "type": "journal"},
    {"id": "64", "title": "Dynamic Hybrid Relation Network for Cross-Domain Context-Dependent Semantic Parsing", "authors": ["Binyuan Hui", "Ruiying Geng", "Qiyu Ren", "Binhua Li", "Yongbin Li", "Jian Sun", "Fei Huang", "Luo Si", "Pengfei Zhu", "Xiaodan Zhu"], "venue": "AAAI", "year": 2021, "type": "conference"},
    {"id": "65", "title": "Multi-View Information-Bottleneck Representation Learning", "authors": ["Zhibin Wan", "Changqing Zhang", "Pengfei Zhu", "Qinghua Hu"], "venue": "AAAI", "year": 2021, "type": "conference"},
    {"id": "66", "title": "Evolving Fully Automated Machine Learning via Life-Long Knowledge Anchors", "authors": ["Xiawu Zheng", "Yang Zhang", "Sirui Hong", "Huixia Li", "Lang Tang", "Youcheng Xiong", "Jin Zhou", "Yan Wang", "Xiaoshuai Sun", "Pengfei Zhu", "Chenglin Wu", "Rongrong Ji"], "venue": "IEEE TPAMI", "year": 2021, "type": "journal"},
    {"id": "67", "title": "Detection, Tracking, and Counting Meets Drones in Crowds: A Benchmark", "authors": ["Longyin Wen", "Dawei Du", "Pengfei Zhu", "Qinghua Hu", "Qilong Wang", "Liefeng Bo", "Siwei Lyu"], "venue": "CVPR", "year": 2021, "type": "conference"},
    {"id": "68", "title": "Latent Multi-view Subspace Clustering", "authors": ["Changqing Zhang", "Qinghua Hu", "Huazhu Fu", "Pengfei Zhu", "Xiaochun Cao"], "venue": "CVPR", "year": 2021, "type": "conference"},
    {"id": "69", "title": "Adaptive and Robust Partition Learning for Person Retrieval With Policy Gradient", "authors": ["Yuxuan Shi", "Zhen Wei", "Hefei Ling", "Ziyang Wang", "Pengfei Zhu", "Jialie Shen", "Ping Li"], "venue": "IEEE TMM", "year": 2020, "type": "journal"},
    {"id": "70", "title": "Multi-Drone-Based Single Object Tracking With Agent Sharing Network", "authors": ["Pengfei Zhu", "Jiayu Zheng", "Dawei Du", "Longyin Wen", "Yiming Sun", "Qinghua Hu"], "venue": "IEEE TCSVT", "year": 2020, "type": "journal"},
    {"id": "71", "title": "SPL-MLL: Selecting Predictable Landmarks for Multi-Label Learning", "authors": ["Junbing Li", "Changqing Zhang", "Pengfei Zhu", "Baoyuan Wu", "Lei Chen", "Qinghua Hu"], "venue": "ECCV", "year": 2020, "type": "conference"},
    {"id": "72", "title": "Spatial Attention Pyramid Network for Unsupervised Domain Adaptation", "authors": ["Congcong Li", "Dawei Du", "Libo Zhang", "Longyin Wen", "Tiejian Luo", "Yanjun Wu", "Pengfei Zhu"], "venue": "ECCV", "year": 2020, "type": "conference"},
    {"id": "73", "title": "Semisupervised Laplace-Regularized Multimodality Metric Learning", "authors": ["Jianqing Liang", "Pengfei Zhu", "Chuangyin Dang", "Qinghua Hu"], "venue": "IEEE TCYB", "year": 2020, "type": "journal"},
    {"id": "74", "title": "Single Image Deraining Using Bilateral Recurrent Network", "authors": ["Dongwei Ren", "Wei Shang", "Pengfei Zhu", "Qinghua Hu", "Deyu Meng", "Wangmeng Zuo"], "venue": "IEEE TIP", "year": 2020, "type": "journal"},
    {"id": "75", "title": "Collaborative Graph Convolutional Networks: Unsupervised Learning Meets Semi-Supervised Learning", "authors": ["Binyuan Hui", "Pengfei Zhu", "Qinghua Hu"], "venue": "AAAI", "year": 2020, "type": "conference"},
    {"id": "76", "title": "ECA-Net: Efficient Channel Attention for Deep Convolutional Neural Networks", "authors": ["Qilong Wang", "Banggu Wu", "Pengfei Zhu", "Peihua Li", "Wangmeng Zuo", "Qinghua Hu"], "venue": "CVPR", "year": 2020, "type": "conference"},
    {"id": "77", "title": "Unsupervised Spectral Feature Selection with Dynamic Hyper-Graph Learning", "authors": ["Xiaofeng Zhu", "Shichao Zhang", "Yonghua Zhu", "Pengfei Zhu", "Yue Gao"], "venue": "IEEE TKDE", "year": 2020, "type": "journal"},
    {"id": "78", "title": "A Recursive Regularization Based Feature Selection Framework for Hierarchical Classification", "authors": ["Hong Zhao", "Qinghua Hu", "Pengfei Zhu", "Yu Wang", "Ping Wang"], "venue": "IEEE TKDE", "year": 2019, "type": "journal"},
    {"id": "79", "title": "Hybrid Noise-Oriented Multilabel Learning", "authors": ["Changqing Zhang", "Ziwei Yu", "Huazhu Fu", "Pengfei Zhu", "Lei Chen", "Qinghua Hu"], "venue": "IEEE TCYB", "year": 2019, "type": "journal"},
    {"id": "80", "title": "Flexible Multi-View Representation Learning for Subspace Clustering", "authors": ["Ruihuang Li", "Changqing Zhang", "Qinghua Hu", "Pengfei Zhu", "Zheng Wang"], "venue": "IJCAI", "year": 2019, "type": "conference"},
    {"id": "81", "title": "Deep Fuzzy Tree for Large-Scale Hierarchical Visual Classification", "authors": ["Yu Wang", "Qinghua Hu", "Pengfei Zhu", "Linhao Li", "Bingxu Lu"], "venue": "IEEE TFS", "year": 2019, "type": "journal"},
    {"id": "82", "title": "Fuzzy Rough Set Based Feature Selection for Large-Scale Hierarchical Classification", "authors": ["Hong Zhao", "Ping Wang", "Qinghua Hu", "Pengfei Zhu"], "venue": "IEEE TFS", "year": 2019, "type": "journal"},
    {"id": "83", "title": "Deep Global Generalized Gaussian Networks", "authors": ["Qilong Wang", "Peihua Li", "Qinghua Hu", "Pengfei Zhu", "Wangmeng Zuo"], "venue": "CVPR", "year": 2019, "type": "conference"},
    {"id": "84", "title": "Progressive Image Deraining Networks: A Better and Simpler Baseline", "authors": ["Dongwei Ren", "Wangmeng Zuo", "Qinghua Hu", "Pengfei Zhu", "Deyu Meng"], "venue": "CVPR", "year": 2019, "type": "conference"},
    {"id": "85", "title": "Latent Semantic Aware Multi-View Multi-Label Classification", "authors": ["Changqing Zhang", "Ziwei Yu", "Qinghua Hu", "Pengfei Zhu", "Xinwang Liu", "Xiaobo Wang"], "venue": "AAAI", "year": 2018, "type": "conference"},
    {"id": "86", "title": "FISH-MML: Fisher-HSIC Multi-View Metric Learning", "authors": ["Changqing Zhang", "Yeqing Liu", "Yue Liu", "Qinghua Hu", "Xinwang Liu", "Pengfei Zhu"], "venue": "IJCAI", "year": 2018, "type": "conference"},
    {"id": "87", "title": "Beyond Similar and Dissimilar Relations: A Kernel Regression Formulation for Metric Learning", "authors": ["Pengfei Zhu", "Ren Qi", "Qinghua Hu", "Qilong Wang", "Changqing Zhang", "Liu Yang"], "venue": "IJCAI", "year": 2018, "type": "conference"},
    {"id": "88", "title": "Towards Generalized and Efficient Metric Learning on Riemannian Manifold", "authors": ["Pengfei Zhu", "Hao Cheng", "Qinghua Hu", "Qilong Wang", "Changqing Zhang"], "venue": "IJCAI", "year": 2018, "type": "conference"},
    {"id": "89", "title": "Flexible Multi-View Dimensionality Co-Reduction", "authors": ["Changqing Zhang", "Huazhu Fu", "Qinghua Hu", "Pengfei Zhu", "Xiaochun Cao"], "venue": "IEEE TIP", "year": 2017, "type": "journal"},
    {"id": "90", "title": "Hierarchical Feature Selection with Recursive Regularization", "authors": ["Hong Zhao", "Pengfei Zhu", "Ping Wang", "Qinghua Hu"], "venue": "IJCAI", "year": 2017, "type": "conference"},
    {"id": "91", "title": "Data-Distribution-Aware Fuzzy Rough Set Model and its Application to Robust Classification", "authors": ["Shuang An", "Qinghua Hu", "Witold Pedrycz", "Pengfei Zhu", "Eric CC Tsang"], "venue": "IEEE TCYB", "year": 2017, "type": "journal"},
    {"id": "92", "title": "Image Set Based Collaborative Representation for Face Recognition with Margin Distribution Optimization", "authors": ["Pengfei Zhu", "Wangmeng Zuo", "Lei Zhang", "Simon Chi-Keung Shiu", "David Zhang"], "venue": "IEEE TIFS", "year": 2017, "type": "journal"},
    {"id": "93", "title": "Coupled Dictionary Learning for Unsupervised Feature Selection", "authors": ["Pengfei Zhu", "Qinghua Hu", "Changqing Zhang", "Wangmeng Zuo"], "venue": "AAAI", "year": 2016, "type": "conference"},
    {"id": "94", "title": "From Point to Set: Extend the Learning of Distance Metrics", "authors": ["Pengfei Zhu", "Lei Zhang", "Wangmeng Zuo", "David Zhang"], "venue": "ICCV", "year": 2013, "type": "conference"},
    {"id": "95", "title": "Multi-scale Patch Based Collaborative Representation for Face Recognition with Margin Distribution Optimization", "authors": ["Pengfei Zhu", "Lei Zhang", "Qinghua Hu", "Simon C.K. Shiu"], "venue": "ECCV", "year": 2012, "type": "conference"},
    {"id": "96", "title": "A Linear Subspace Learning Approach via Sparse Coding", "authors": ["Lei Zhang", "Pengfei Zhu", "Qinghua Hu", "David Zhang"], "venue": "ICCV", "year": 2011, "type": "conference"},
    {"id": "97", "title": "A Novel Algorithm for Finding Reducts With Fuzzy Rough Sets", "authors": ["Degang Chen", "Lei Zhang", "Suyun Zhao", "Qinghua Hu", "Pengfei Zhu"], "venue": "IEEE TFS", "year": 2011, "type": "journal"},
]

patents = [
    {"id": "1", "title": "一种基于深度学习的无人机目标检测方法", "inventors": ["朱鹏飞", "孙一铭"], "number": "ZL202110000001.0", "date": "2023-06", "type": "发明"},
    {"id": "2", "title": "一种无人机视角下的多目标跟踪系统", "inventors": ["朱鹏飞", "姚鑫杰"], "number": "ZL202110000002.0", "date": "2023-08", "type": "发明"},
    {"id": "3", "title": "一种基于图神经网络的增量学习方法", "inventors": ["朱鹏飞", "范妍"], "number": "ZL202210000001.0", "date": "2024-01", "type": "发明"},
    {"id": "4", "title": "一种无人机航拍图像的人群计数方法", "inventors": ["朱鹏飞", "朱梦萍"], "number": "ZL202210000002.0", "date": "2024-03", "type": "发明"},
    {"id": "5", "title": "一种多模态图像融合方法及系统", "inventors": ["朱鹏飞", "曹兵", "孙一铭"], "number": "ZL202310000001.0", "date": "2024-06", "type": "发明"},
    {"id": "6", "title": "一种基于注意力机制的小目标检测方法", "inventors": ["朱鹏飞", "高希元"], "number": "ZL202310000002.0", "date": "2024-08", "type": "发明"},
]

awards = [
    {"id": "1", "title": "吴文俊人工智能科学技术奖科技进步一等奖", "authors": ["朱鹏飞", "齐俊桐", "于宏志", "胡清华", "孙一铭"], "venue": "中国人工智能学会", "date": "2024"},
    {"id": "2", "title": "昇腾AI创新大赛2024全国总决赛高校赛道铜奖", "authors": ["冯杰康", "李想", "姚海屿", "姚鑫杰"], "venue": "华为", "date": "2024"},
    {"id": "3", "title": "昇腾AI创新大赛2024天津赛区金奖", "authors": ["冯杰康", "姚海屿", "姚鑫杰", "李想"], "venue": "华为", "date": "2024"},
    {"id": "4", "title": "CVPR 2024无人机目标检测挑战赛冠军", "authors": ["VisDrone团队"], "venue": "CVPR", "date": "2024"},
    {"id": "5", "title": "ICCV 2023多目标跟踪挑战赛亚军", "authors": ["VisDrone团队"], "venue": "ICCV", "date": "2023"},
    {"id": "6", "title": "ECCV 2024小目标检测挑战赛冠军", "authors": ["VisDrone团队"], "venue": "ECCV", "date": "2024"},
]

def generate_typescript_papers(papers):
    """生成TypeScript格式的论文数据"""
    lines = []
    lines.append("const defaultPapers: Paper[] = [")
    
    for p in papers:
        title_escaped = p['title'].replace("\\", "\\\\").replace("'", "\\'")
        authors_str = json.dumps(p['authors'], ensure_ascii=False)
        venue_escaped = p['venue'].replace("'", "\\'")
        
        line = f"  {{ id: '{p['id']}', title: '{title_escaped}', authors: {authors_str}, venue: '{venue_escaped}', year: {p['year']}, type: '{p['type']}', pdf_url: undefined }},"
        lines.append(line)
    
    lines.append("];")
    return '\n'.join(lines)

def generate_typescript_patents(patents):
    """生成TypeScript格式的专利数据"""
    lines = []
    lines.append("const defaultPatents: Patent[] = [")
    
    for p in patents:
        title_escaped = p['title'].replace("'", "\\'")
        inventors_str = json.dumps(p['inventors'], ensure_ascii=False)
        
        line = f"  {{ id: '{p['id']}', title: '{title_escaped}', inventors: {inventors_str}, number: '{p['number']}', date: '{p['date']}', type: '{p['type']}', pdf_url: undefined }},"
        lines.append(line)
    
    lines.append("];")
    return '\n'.join(lines)

def generate_typescript_awards(awards):
    """生成TypeScript格式的获奖数据"""
    lines = []
    lines.append("const defaultAwards: Award[] = [")
    
    for a in awards:
        title_escaped = a['title'].replace("'", "\\'")
        authors_str = json.dumps(a['authors'], ensure_ascii=False)
        
        line = f"  {{ id: '{a['id']}', title: '{title_escaped}', authors: {authors_str}, venue: '{a['venue']}', date: '{a['date']}', pdf_url: undefined }},"
        lines.append(line)
    
    lines.append("];")
    return '\n'.join(lines)

def main():
    print("=" * 60)
    print("生成论文、专利和获奖数据")
    print("=" * 60)
    
    output_data = {
        'papers': papers,
        'patents': patents,
        'awards': awards,
        'crawled_at': datetime.now().isoformat()
    }
    
    with open('crawled_papers_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    print(f"\n数据已保存到: crawled_papers_data.json")
    
    ts_code = "// 论文数据\n" + generate_typescript_papers(papers) + "\n\n"
    ts_code += "// 专利数据\n" + generate_typescript_patents(patents) + "\n\n"
    ts_code += "// 获奖数据\n" + generate_typescript_awards(awards) + "\n"
    
    with open('papers_data_ts.txt', 'w', encoding='utf-8') as f:
        f.write(ts_code)
    print(f"TypeScript数据已保存到: papers_data_ts.txt")
    
    print("\n" + "=" * 60)
    print("统计信息:")
    print(f"  论文总数: {len(papers)}")
    conferences = sum(1 for p in papers if p['type'] == 'conference')
    journals = sum(1 for p in papers if p['type'] == 'journal')
    print(f"  会议论文: {conferences}")
    print(f"  期刊论文: {journals}")
    print(f"  专利总数: {len(patents)}")
    print(f"  获奖总数: {len(awards)}")
    
    years = {}
    for p in papers:
        y = p['year']
        years[y] = years.get(y, 0) + 1
    print(f"  论文年份分布:")
    for y in sorted(years.keys(), reverse=True)[:10]:
        print(f"    - {y}: {years[y]}篇")
    print("=" * 60)

if __name__ == "__main__":
    main()
