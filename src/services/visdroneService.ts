import { supabase } from '@/config/supabase';
import localDatabase from '@/lib/localDatabase';
import type {
  NewsItem,
  Dataset,
  Model,
  Paper,
  TeamMember,
  Patent,
  Award,
  SeminarEvent,
} from '@/types/visdrone';
import { datasets as realDatasets } from '@/data/visdrone/datasets';
import { models as realModels } from '@/data/visdrone/models';
import { papers as realPapers } from '@/data/visdrone/papers';
import { patents as realPatents } from '@/data/visdrone/patents';
import { awards as realAwards } from '@/data/visdrone/awards';
import { teamMembers as realTeam } from '@/data/visdrone/team';
import { news as realNews } from '@/data/visdrone/news';
import { seminars as realSeminars, talks as realTalks } from '@/data/visdrone/seminars';
import {
  mapDbToPatent,
  mapDbToAward,
  mapDbToNews,
  mapDbToDataset,
  mapDbToModel,
  mapDbToPaper,
  mapDbToTeamMember,
  mapDbToSeminarEvent,
} from '@/types/visdrone/fieldMapper';

interface DatasetStats {
  images?: string;
  videos?: string;
  annotations?: string;
}

interface GithubInfo {
  description?: string;
  stars?: number;
  forks?: number;
  license?: string;
}

// Default data for fallback
const defaultPatents: Patent[] = [
  { id: '1', title: '基于多视图知识集成和频率一致性的人脸跨域翻译方法', inventors: ['曹兵', '王清和', '朱鹏飞', '胡清华', '赵佳鸣', '毕志伟', '亓国梁', '孙一铭', '高毓聪', '曹亚如'], number: 'CN 120088145 B', date: '2025', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/21-一种基于多视图知识集成和频率一致性的人脸跨域翻译方法.pdf' },
  { id: '2', title: '基于分布不确定性的多模态特征迁移人群计数方法及装置', inventors: ['曹亚如', '朱鹏飞', '曹兵', '孙一铭', '胡清华'], number: 'CN 120088144 B', date: '2025', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/22-一种基于分布不确定性的多模态特征迁移人群计数方法及装置.pdf' },
  { id: '3', title: '基于递归式融合转换单元的多模态图像合成方法及装置', inventors: ['赵佳鸣', '曹兵', '朱鹏飞', '胡清华'], number: 'ZL 2025 1 0028210.X', date: '2025-11-04', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2025/04/一种基于递归式融合转换单元的多模态图像合成方法及装置.pdf' },
  { id: '4', title: '基于推理高效的动态优化早退模型、方法、系统及设备', inventors: ['罗立伟', '王旗龙', '任冬伟', '朱鹏飞', '胡清华'], number: 'ZL 2024 1 1921894.8', date: '2025-10-31', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/23-基于推理高效的动态优化早退模型方法系统及设备.pdf' },
  { id: '5', title: '一种基于动态相对性增强的图像融合方法及装置', inventors: ['徐兴歆', '曹兵', '朱鹏飞', '胡清华'], number: 'ZL 2025 1 0093976.6', date: '2025-12-26', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2025/04/一种基于动态相对性增强的图像融合方法及装置.pdf' },
  { id: '6', title: '基于文本引导的视频到文本离散的视频识别方法及装置', inventors: ['王月新', '朱文成', '朱鹏飞', '胡清华'], number: 'ZL 2024 1 1711502.5', date: '2025-10-28', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/25-基于文本引导的视频到文本离散的视频识别方法及装置.pdf' },
  { id: '7', title: '人群计数的方法、装置、电子设备、存储介质', inventors: ['朱鹏飞', '张敬林', '王星', '张问银', '王九如', '王兴华'], number: 'ZL 2024 1 0543567.7', date: '2024-08-30', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/10-人群计数的方法装置电子设备存储介质.pdf' },
  { id: '8', title: '一种无人机多模态跟踪方法', inventors: ['朱鹏飞', '张敬林', '王星', '张问银', '王九如', '王兴华'], number: 'ZL 2024 1 0369741.0', date: '2024-06-25', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/11-一种无人机多模态跟踪方法.pdf' },
  { id: '9', title: '一种基于弱监督双流视觉语言交互的答案定位方法及装置', inventors: ['朱鹏飞', '刘轶', '陈冠林', '胡清华'], number: 'ZL 2023 1 0067972.1', date: '2025-08-26', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/14-一种基于弱监督双流视觉语言交互的答案定位方法及装置.pdf' },
  { id: '10', title: '一种基于关系嵌入的图像合成的方法、装置及存储介质', inventors: ['朱鹏飞', '贾安', '汪廉杰', '刘洋'], number: 'ZL 2021 1 1457354.5', date: '2025-02-07', type: '发明', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/8-一种基于关系嵌入的图像合成的方法装置及存储介质.pdf' },
];

const defaultAwards: Award[] = [
  { id: '1', title: '吴文俊人工智能科学技术奖科技进步一等奖', authors: ['朱鹏飞', '齐俊桐', '于宏志', '胡清华', '孙一铭', '仇梓峰', '王明明', '王煜', '曹兵', '靳锴', '瞿关明', '任冬伟', '张云', '赵少阳', '平原'], venue: '中国人工智能学会', date: '2024', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/吴文俊人工智能科学技术奖科技进步一等奖.pdf' },
  { id: '2', title: '昇腾AI创新大赛2024全国总决赛高校赛道铜奖', authors: ['冯杰康', '李想', '姚海屿', '姚鑫杰'], venue: '华为', date: '2024', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/27-昇腾AI创新大赛2024全国总决赛高校赛道铜奖（2024年度）.pdf' },
  { id: '3', title: '昇腾AI创新大赛2024天津赛区金奖', authors: ['冯杰康', '姚海屿', '姚鑫杰', '李想'], venue: '华为', date: '2024', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/26-昇腾AI创新大赛2024天津赛区金奖（2024年度）-1.pdf' },
  { id: '4', title: '第九届"互联网+"大学生创新创业大赛天津赛区金奖', authors: ['赵秋多', '王沛', '姚海屿', '周鑫', '王铭宇', '张鹏程'], venue: '天津大学', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/第九届互联网大学生创新创业大赛天津赛区金奖.pdf' },
  { id: '5', title: '中国国际大学生创新大赛国际赛道银奖', authors: ['张庭赫', 'Suhaib Suhaib'], venue: '', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/中国国际大学生创新大赛国际赛道银奖.pdf' },
  { id: '6', title: 'CVPR 2023 Object Discovery Challenge冠军', authors: ['王茂林', '陈曦', '穆郡贤'], venue: 'CVPR', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/CVPR-Object-Discovery-Challenge竞赛冠军（2023年度）.pdf' },
  { id: '7', title: 'CVPR 2023 CLVision Challenge 亚军', authors: ['朱之林', '范妍', '陈慧彤', '季罗娜', '姚鑫杰', '穆郡贤'], venue: 'CVPR', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/CLVision-Challenge-2023.pdf' },
  { id: '8', title: '天津市科技进步二等奖', authors: ['谢津平', '朱鹏飞', '王旗龙', '奚歌', '张云姣', '詹昊', '许健', '曹兵'], venue: '天津市人民政府', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/天津市科技进步二等奖.pdf' },
];

const defaultPapers: Paper[] = [
  { id: '1', title: 'Reconcile Gradient Modulation for Harmony Multimodal Learning', authors: ["Xiyuan Gao", "Bing Cao", "Baoquan Gong", "Pengfei Zhu"], venue: 'AAAI', year: 2026, type: 'conference' },
  { id: '2', title: 'Dream-IF: Dynamic Relative EnhAnceMent for Image Fusion', authors: ["Xingxin Xu", "Bing Cao", "Dongdong Li", "Qinghua Hu", "Pengfei Zhu"], venue: 'AAAI', year: 2026, type: 'conference' },
  { id: '3', title: 'VTD-CLIP: Video-to-Text Discretization via Prompting CLIP', authors: ["Wencheng Zhu", "Yuexin Wang", "Hongxuan Li", "Pengfei Zhu"], venue: 'AAAI', year: 2026, type: 'conference' },
  { id: '4', title: 'Point Cloud Quantization through Multimodal Prompting for 3D Understanding', authors: ["Hongxuan Li", "Wencheng Zhu", "Huiying Xu", "Xinzhong Zhu", "Pengfei Zhu"], venue: 'AAAI', year: 2026, type: 'conference' },
  { id: '5', title: 'CtrlFuse: Mask-Prompt Guided Controllable Infrared and Visible Image Fusion', authors: ["Yiming Sun", "Yuan Ruan", "Qinghua Hu", "Pengfei Zhu"], venue: 'AAAI', year: 2026, type: 'conference' },
  { id: '6', title: 'Multimodal Negative Learning', authors: ["Baoquan Gong", "Xiyuan Gao", "Pengfei Zhu", "Qinghua Hu", "Bing Cao"], venue: 'NeurIPS', year: 2025, type: 'conference' },
  { id: '7', title: 'Decoupled Multi-Predictor Optimization for Inference-Efficient Model Tuning', authors: ["Liwei Luo", "Shuaitengyuan Li", "Dongwei Ren", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], venue: 'ICCV', year: 2025, type: 'conference' },
  { id: '8', title: 'Multi-granularity Superpoint Graph Learning for Weakly Supervised 3D Semantic Segmentation', authors: ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Le Hui", "Jin Xie", "Bin Xiao", "Qinghua Hu"], venue: 'IEEE TMM', year: 2025, type: 'journal' },
  { id: '9', title: 'TEDFuse: Task-Driven Equivariant Consistency Decomposition Network for Multi-Modal Image Fusion', authors: ["Yiming Sun", "Xinyu Cui", "Zhen Wang", "Hao Cheng", "Yongfeng Dong", "Pengfei Zhu", "Kai Li"], venue: 'IEEE TMM', year: 2025, type: 'journal' },
  { id: '10', title: 'Motion-Aware Adaptive Pixel Pruning for Efficient Local Motion Deblurring', authors: ["Wei Shang", "Dongwei Ren", "Wanying Zhang", "Pengfei Zhu", "Qinghua Hu", "Wangmeng Zuo"], venue: 'ACM MM', year: 2025, type: 'conference' },
  { id: '11', title: 'CKD: Contrastive Knowledge Distillation from A Sample-Wise Perspective', authors: ["Wencheng Zhu", "Xin Zhou", "Pengfei Zhu", "Yu Wang", "Qinghua Hu"], venue: 'IEEE TIP', year: 2025, type: 'journal' },
  { id: '12', title: 'Socialized Coevolution: Advancing a Better World Through Cross-Task Collaboration', authors: ["Xinjie Yao", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Ruipu Zhao", "Zhoupeng Guo", "Weihao Li", "Qinghua Hu"], venue: 'ICML', year: 2025, type: 'conference' },
  { id: '13', title: 'Graphs Help Graphs: Multi-Agent Graph Socialized Learning', authors: ["Jialu Li", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Xinjie Yao", "Qinghua Hu"], venue: 'NeurIPS', year: 2025, type: 'conference' },
  { id: '14', title: 'Task-Gated Multi-Expert Collaboration Network for Degraded Multi-Modal Image Fusion', authors: ["Yiming Sun", "Xin Li", "Pengfei Zhu", "Qinghua Hu", "Dongwei Ren", "Huiying Xu", "Xinzhong Zhu"], venue: 'ICML', year: 2025, type: 'conference' },
  { id: '15', title: 'RTF: Recursive TransFusion for Multi-Modal Image Synthesis', authors: ["Bing Cao", "Guoliang Qi", "Jiaming Zhao", "Pengfei Zhu", "Qinghua Hu", "Xinbo Gao"], venue: 'IEEE TIP', year: 2025, type: 'journal' },
  { id: '16', title: 'BackMix: Regularizing Open Set Recognition by Removing Underlying Fore-Background Priors', authors: ["Yu Wang", "Junxian Mu", "Hongzhi Huang", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], venue: 'IEEE TPAMI', year: 2025, type: 'journal' },
  { id: '17', title: 'Uncertainty-aware Superpoint Graph Transformer for Weakly Supervised 3D Semantic Segmentation', authors: ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Le Hui", "Jin Xie", "Qinghua Hu"], venue: 'IEEE TFS', year: 2025, type: 'journal' },
  { id: '18', title: 'Unknown Support Prototype Set for Open Set Recognition', authors: ["Guosong Jiang", "Pengfei Zhu", "Bing Cao", "Dongyue Chen", "Qinghua Hu"], venue: 'IJCV', year: 2025, type: 'journal' },
  { id: '19', title: 'Hyperbolic-Euclidean Deep Mutual Learning', authors: ["Haifang Cao", "Yu Wang", "Jialu Li", "Pengfei Zhu", "Qinghua Hu"], venue: 'WWW', year: 2025, type: 'conference' },
  { id: '20', title: 'Efficient Masked AutoEncoder for Video Object Counting and A LargeScale Benchmark', authors: ["Bing Cao", "Quanhao Lu", "Jiekang Feng", "Qilong Wan", "Pengfei Zhu", "Qinghua Hu"], venue: 'ICLR', year: 2025, type: 'conference' },
  { id: '21', title: 'Asymmetric Factorized Bilinear Operation for Vision Transformer', authors: ["Junjie Wu", "Qilong Wang", "Jiangtao Xie", "Pengfei Zhu", "Qinghua Hu"], venue: 'ICLR', year: 2025, type: 'conference' },
  { id: '22', title: 'Asymmetric Reinforcing Against Multi-Modal Representation Bias', authors: ["Xiyuan Gao", "Bing Cao", "Pengfei Zhu", "Nannan Wang", "Qinghua Hu"], venue: 'AAAI', year: 2025, type: 'conference' },
  { id: '23', title: 'One-Step Multi-View Spectral Clustering', authors: ["Xiaofeng Zhu", "Shichao Zhang", "Wei He", "Rongyao Hu", "Cong Lei", "Pengfei Zhu"], venue: 'IEEE TKDE', year: 2024, type: 'journal' },
  { id: '24', title: 'Conditional Controllable Image Fusion', authors: ["Bing Cao", "Xingxin Xu", "Pengfei Zhu", "Qilong Wang", "Qinghua Hu"], venue: 'NeurIPS', year: 2024, type: 'conference' },
  { id: '25', title: 'What Matters in Graph Class Incremental Learning? An Information Preservation Perspective', authors: ["Jialu Li", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Qinghua Hu"], venue: 'NeurIPS', year: 2024, type: 'conference' },
  { id: '26', title: 'Persistence Homology Distillation for Semi-supervised Continual Learning', authors: ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Dongyue Chen", "Qinghua Hu"], venue: 'NeurIPS', year: 2024, type: 'conference' },
  { id: '27', title: 'Visible and Clear: Finding Tiny Objects in Difference Map', authors: ["Bing Cao", "Haiyu Yao", "Pengfei Zhu", "Qinghua Hu"], venue: 'ECCV', year: 2024, type: 'conference' },
  { id: '28', title: 'M-RRFS: A Memory-Based Robust Region Feature Synthesizer for Zero-Shot Object Detection', authors: ["Peiliang Huang", "Dingwen Zhang", "De Cheng", "Longfei Han", "Pengfei Zhu", "Junwei Han"], venue: 'IJCV', year: 2024, type: 'journal' },
  { id: '29', title: 'M2FNet: Multi-modal Fusion Network for Object Detection from Visible and Thermal Infrared Images', authors: ["Chenchen Jiang", "Huazhong Ren", "Hong Yang", "Hongtao Huo", "Pengfei Zhu", "Zhaoyuan Yao", "Jing Li", "Min Sun", "Shihao Yang"], venue: 'ISPRS JGI', year: 2024, type: 'journal' },
  { id: '30', title: 'Socialized Learning: Making Each Other Better Through Multi-Agent Collaboration', authors: ["Xinjie Yao", "Yu Wang", "Pengfei Zhu", "Wanyu Lin", "Jialu Li", "Weihao Li", "Qinghua Hu"], venue: 'ICML', year: 2024, type: 'conference' },
  { id: '31', title: 'Dynamic Brightness Adaptation for Robust Multi-modal Image Fusion', authors: ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], venue: 'IJCAI', year: 2024, type: 'conference' },
  { id: '32', title: 'Integrated Heterogeneous Graph Attention Network for Incomplete Multi-Modal Clustering', authors: ["Yu Wang", "Xinjie Yao", "Pengfei Zhu", "Weihao Li", "Meng Cao", "Qinghua Hu"], venue: 'IJCV', year: 2024, type: 'journal' },
  { id: '33', title: 'Task-Customized Mixture of Adapters for General Image Fusion', authors: ["Pengfei Zhu", "Yang Sun", "Bing Cao", "Qinghua Hu"], venue: 'CVPR', year: 2024, type: 'conference' },
  { id: '34', title: 'AMU-Tuning: Effective Logit Bias for CLIP-based Few-shot Learning', authors: ["Yuwei Tang", "Zhenyi Lin", "Qilong Wang", "Pengfei Zhu", "Qinghua Hu"], venue: 'CVPR', year: 2024, type: 'conference' },
  { id: '35', title: 'Multi-View Deep Subspace Clustering Networks', authors: ["Pengfei Zhu", "Xinjie Yao", "Yu Wang", "Binyuan Hui", "Dawei Du", "Qinghua Hu"], venue: 'IEEE TCYB', year: 2024, type: 'journal' },
  { id: '36', title: 'Bi-directional Adapter for Multimodal Tracking', authors: ["Bing Cao", "Junliang Guo", "Pengfei Zhu", "Qinghua Hu"], venue: 'AAAI', year: 2024, type: 'conference' },
  { id: '37', title: 'Every Node is Different: Dynamically Fusing Self-Supervised Tasks for Attributed Graph Clustering', authors: ["Pengfei Zhu", "Qian Wang", "Yu Wang", "Jialu Li", "Qinghua Hu"], venue: 'AAAI', year: 2024, type: 'conference' },
  { id: '38', title: 'Exploring Diverse Representations for Open Set Recognition', authors: ["Yu Wang", "Junxian Mu", "Pengfei Zhu", "Qinghua Hu"], venue: 'AAAI', year: 2024, type: 'conference' },
  { id: '39', title: 'Dynamic Sub-graph Distillation for Robust Semi-supervised Continual Learning', authors: ["Yan Fan", "Yu Wang", "Pengfei Zhu", "Qinghua Hu"], venue: 'AAAI', year: 2024, type: 'conference' },
  { id: '40', title: 'Boosting Pseudo-Labeling With Curriculum Self-Reflection for Attributed Graph Clustering', authors: ["Pengfei Zhu", "Jialu Li", "Yu Wang", "Bin Xiao", "Jinglin Zhang", "Wanyu Lin", "Qinghua Hu"], venue: 'IEEE TNNLS', year: 2024, type: 'journal' },
  { id: '41', title: 'CCP-GNN: Competitive Covariance Pooling for Improving Graph Neural Networks', authors: ["Pengfei Zhu", "Jialu Li", "Zhe Dong", "Qinghua Hu", "Xiao Wang", "Qilong Wang"], venue: 'IEEE TNNLS', year: 2024, type: 'journal' },
  { id: '42', title: 'Multi-modal Gated Mixture of Local-to-Global Experts for Dynamic Image Fusion', authors: ["Bing Cao", "Yiming Sun", "Pengfei Zhu", "Qinghua Hu"], venue: 'ICCV', year: 2023, type: 'conference' },
  { id: '43', title: 'Towards A Deeper Understanding of Global Covariance Pooling in Deep Learning: An Optimization Perspective', authors: ["Qilong Wang", "Zhaolin Zhang", "Mingze Gao", "Jiangtao Xie", "Pengfei Zhu", "Peihua Li", "Wangmeng Zuo", "Qinghua Hu"], venue: 'IEEE TPAMI', year: 2023, type: 'journal' },
  { id: '44', title: 'Cross-Drone Transformer Network for Robust Single Object Tracking', authors: ["Guanlin Chen", "Pengfei Zhu", "Bing Cao", "Xing Wang", "Qinghua Hu"], venue: 'IEEE TCSVT', year: 2023, type: 'journal' },
  { id: '45', title: 'Multi-Task Credible Pseudo-Label Learning for Semi-supervised Crowd Counting', authors: ["Pengfei Zhu", "Jingqing Li", "Bing Cao", "Qinghua Hu"], venue: 'IEEE TNNLS', year: 2023, type: 'journal' },
  { id: '46', title: 'OpenMix+: Revisiting Data Augmentation for Open Set Recognition', authors: ["Guosong Jiang", "Pengfei Zhu", "Yu Wang", "Qinghua Hu"], venue: 'IEEE TCSVT', year: 2023, type: 'journal' },
  { id: '47', title: 'Autoencoder-based Collaborative Attention GAN for Multi-modal Image Synthesis', authors: ["Bing Cao", "Haifang Cao", "Jiaxu Liu", "Pengfei Zhu", "Changqing Zhang", "Qinghua Hu"], venue: 'IEEE TMM', year: 2023, type: 'journal' },
  { id: '48', title: 'Robust Multi-Drone Multi-Target Tracking to Resolve Target Occlusion: A Benchmark', authors: ["Zhihao Liu", "Yuanyuan Shang", "Timing Li", "Guanlin Chen", "Yu Wang", "Qinghua Hu", "Pengfei Zhu"], venue: 'IEEE TMM', year: 2023, type: 'journal' },
  { id: '49', title: 'Tuning Pre-trained Model via Moment Probing', authors: ["Mingze Gao", "Qilong Wang", "Zhenyi Lin", "Pengfei Zhu", "Qinghua Hu"], venue: 'ICCV', year: 2023, type: 'conference' },
  { id: '50', title: 'Multi-view Knowledge Ensemble with Frequency Consistency for Face Cross-Domain Translation', authors: ["Bing Cao", "Qinghe Wang", "Pengfei Zhu", "Qinghua Hu", "Dongwei Ren", "Wangmeng Zuo", "Xinbo Gao"], venue: 'IEEE TNNLS', year: 2023, type: 'journal' },
  { id: '51', title: 'Stabilizing Multispectral Pedestrian Detection with Evidential Hybrid Fusion', authors: ["Qing Li", "Changqing Zhang", "Qinghua Hu", "Pengfei Zhu", "Huazhu Fu", "Lei Chen"], venue: 'IEEE TCSVT', year: 2023, type: 'journal' },
  { id: '52', title: 'Learning Dynamic Compact Memory Embedding for Deformable Visual Object Tracking', authors: ["Hongtao Yu", "Pengfei Zhu", "Kaihua Zhang", "Yu Wang", "Shuai Zhao", "Lei Wang", "Tianzhu Zhang", "Qinghua Hu"], venue: 'IEEE TNNLS', year: 2022, type: 'journal' },
  { id: '53', title: 'DetFusion: A Detection-driven Infrared and Visible Image Fusion Network', authors: ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], venue: 'ACM MM', year: 2022, type: 'conference' },
  { id: '54', title: 'Self-Supervised Fully Automatic Learning Machine for Intelligent Retail Container', authors: ["Pengfei Zhu", "Yiming Sun", "Bing Cao", "Xiaoyu Liu", "Xin Liu", "Qinghua Hu"], venue: 'IEEE TIM', year: 2022, type: 'journal' },
  { id: '55', title: 'Semi-supervised Image Deraining Using Knowledge Distillation', authors: ["Xin Cui", "Cong Wang", "Dongwei Ren", "Yunjin Chen", "Pengfei Zhu"], venue: 'IEEE TCSVT', year: 2022, type: 'journal' },
  { id: '56', title: 'Collaborative Decision-Reinforced Self-Supervision for Attributed Graph Clustering', authors: ["Pengfei Zhu", "Jialu Li", "Yu Wang", "Bin Xiao", "Shuai Zhao", "Qinghua Hu"], venue: 'IEEE TNNLS', year: 2022, type: 'journal' },
  { id: '57', title: 'Learning Self-supervised Low-Rank Network for Single-Stage Weakly and Semi-supervised Semantic Segmentation', authors: ["Junwen Pan", "Pengfei Zhu", "Kaihua Zhang", "Bing Cao", "Yu Wang", "Dingwen Zhang", "Junwei Han", "Qinghua Hu"], venue: 'IJCV', year: 2022, type: 'journal' },
  { id: '58', title: 'Drone-Based RGB-Infrared Cross-Modality Vehicle Detection via Uncertainty-Aware Learning', authors: ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"], venue: 'IEEE TCSVT', year: 2022, type: 'journal' },
  { id: '59', title: 'Confidence-aware Fusion using Dempster-Shafer Theory for Multispectral Pedestrian Detection', authors: ["Qing Li", "Changqing Zhang", "Qinghua Hu", "Huazhu Fu", "Pengfei Zhu"], venue: 'IEEE TMM', year: 2022, type: 'journal' },
  { id: '60', title: 'Label-Efficient Hybrid-Supervised Learning for Medical Image Segmentation', authors: ["Junwen Pan", "Qi Bi", "Yanzhan Yang", "Pengfei Zhu", "Cheng Bian"], venue: 'AAAI', year: 2022, type: 'conference' },
  { id: '61', title: 'Latent Heterogeneous Graph Network for Incomplete Multi-View Learning', authors: ["Pengfei Zhu", "Xinjie Yao", "Yu Wang", "Meng Cao", "Binyuan Hui", "Shuai Zhao", "Qinghua Hu"], venue: 'IEEE TMM', year: 2022, type: 'journal' },
  { id: '62', title: 'Detection and Tracking Meet Drones Challenge', authors: ["Pengfei Zhu", "Longyin Wen", "Dawei Du", "Xiao Bian", "Heng Fan", "Qinghua Hu", "Haibin Ling"], venue: 'IEEE TPAMI', year: 2021, type: 'journal' },
  { id: '63', title: 'Graph Regularized Flow Attention Network for Video Animal Counting From Drones', authors: ["Pengfei Zhu", "Tao Peng", "Dawei Du", "Hongtao Yu", "Libo Zhang", "Qinghua Hu"], venue: 'IEEE TIP', year: 2021, type: 'journal' },
  { id: '64', title: 'Dynamic Hybrid Relation Network for Cross-Domain Context-Dependent Semantic Parsing', authors: ["Binyuan Hui", "Ruiying Geng", "Qiyu Ren", "Binhua Li", "Yongbin Li", "Jian Sun", "Fei Huang", "Luo Si", "Pengfei Zhu", "Xiaodan Zhu"], venue: 'AAAI', year: 2021, type: 'conference' },
  { id: '65', title: 'Multi-View Information-Bottleneck Representation Learning', authors: ["Zhibin Wan", "Changqing Zhang", "Pengfei Zhu", "Qinghua Hu"], venue: 'AAAI', year: 2021, type: 'conference' },
  { id: '66', title: 'Evolving Fully Automated Machine Learning via Life-Long Knowledge Anchors', authors: ["Xiawu Zheng", "Yang Zhang", "Sirui Hong", "Huixia Li", "Lang Tang", "Youcheng Xiong", "Jin Zhou", "Yan Wang", "Xiaoshuai Sun", "Pengfei Zhu", "Chenglin Wu", "Rongrong Ji"], venue: 'IEEE TPAMI', year: 2021, type: 'journal' },
  { id: '67', title: 'Detection, Tracking, and Counting Meets Drones in Crowds: A Benchmark', authors: ["Longyin Wen", "Dawei Du", "Pengfei Zhu", "Qinghua Hu", "Qilong Wang", "Liefeng Bo", "Siwei Lyu"], venue: 'CVPR', year: 2021, type: 'conference' },
  { id: '68', title: 'Latent Multi-view Subspace Clustering', authors: ["Changqing Zhang", "Qinghua Hu", "Huazhu Fu", "Pengfei Zhu", "Xiaochun Cao"], venue: 'CVPR', year: 2021, type: 'conference' },
  { id: '69', title: 'Adaptive and Robust Partition Learning for Person Retrieval With Policy Gradient', authors: ["Yuxuan Shi", "Zhen Wei", "Hefei Ling", "Ziyang Wang", "Pengfei Zhu", "Jialie Shen", "Ping Li"], venue: 'IEEE TMM', year: 2020, type: 'journal' },
  { id: '70', title: 'Multi-Drone-Based Single Object Tracking With Agent Sharing Network', authors: ["Pengfei Zhu", "Jiayu Zheng", "Dawei Du", "Longyin Wen", "Yiming Sun", "Qinghua Hu"], venue: 'IEEE TCSVT', year: 2020, type: 'journal' },
  { id: '71', title: 'SPL-MLL: Selecting Predictable Landmarks for Multi-Label Learning', authors: ["Junbing Li", "Changqing Zhang", "Pengfei Zhu", "Baoyuan Wu", "Lei Chen", "Qinghua Hu"], venue: 'ECCV', year: 2020, type: 'conference' },
  { id: '72', title: 'Spatial Attention Pyramid Network for Unsupervised Domain Adaptation', authors: ["Congcong Li", "Dawei Du", "Libo Zhang", "Longyin Wen", "Tiejian Luo", "Yanjun Wu", "Pengfei Zhu"], venue: 'ECCV', year: 2020, type: 'conference' },
  { id: '73', title: 'Semisupervised Laplace-Regularized Multimodality Metric Learning', authors: ["Jianqing Liang", "Pengfei Zhu", "Chuangyin Dang", "Qinghua Hu"], venue: 'IEEE TCYB', year: 2020, type: 'journal' },
  { id: '74', title: 'Single Image Deraining Using Bilateral Recurrent Network', authors: ["Dongwei Ren", "Wei Shang", "Pengfei Zhu", "Qinghua Hu", "Deyu Meng", "Wangmeng Zuo"], venue: 'IEEE TIP', year: 2020, type: 'journal' },
  { id: '75', title: 'Collaborative Graph Convolutional Networks: Unsupervised Learning Meets Semi-Supervised Learning', authors: ["Binyuan Hui", "Pengfei Zhu", "Qinghua Hu"], venue: 'AAAI', year: 2020, type: 'conference' },
  { id: '76', title: 'ECA-Net: Efficient Channel Attention for Deep Convolutional Neural Networks', authors: ["Qilong Wang", "Banggu Wu", "Pengfei Zhu", "Peihua Li", "Wangmeng Zuo", "Qinghua Hu"], venue: 'CVPR', year: 2020, type: 'conference' },
  { id: '77', title: 'Unsupervised Spectral Feature Selection with Dynamic Hyper-Graph Learning', authors: ["Xiaofeng Zhu", "Shichao Zhang", "Yonghua Zhu", "Pengfei Zhu", "Yue Gao"], venue: 'IEEE TKDE', year: 2020, type: 'journal' },
  { id: '78', title: 'A Recursive Regularization Based Feature Selection Framework for Hierarchical Classification', authors: ["Hong Zhao", "Qinghua Hu", "Pengfei Zhu", "Yu Wang", "Ping Wang"], venue: 'IEEE TKDE', year: 2019, type: 'journal' },
  { id: '79', title: 'Hybrid Noise-Oriented Multilabel Learning', authors: ["Changqing Zhang", "Ziwei Yu", "Huazhu Fu", "Pengfei Zhu", "Lei Chen", "Qinghua Hu"], venue: 'IEEE TCYB', year: 2019, type: 'journal' },
  { id: '80', title: 'Flexible Multi-View Representation Learning for Subspace Clustering', authors: ["Ruihuang Li", "Changqing Zhang", "Qinghua Hu", "Pengfei Zhu", "Zheng Wang"], venue: 'IJCAI', year: 2019, type: 'conference' },
  { id: '81', title: 'Deep Fuzzy Tree for Large-Scale Hierarchical Visual Classification', authors: ["Yu Wang", "Qinghua Hu", "Pengfei Zhu", "Linhao Li", "Bingxu Lu"], venue: 'IEEE TFS', year: 2019, type: 'journal' },
  { id: '82', title: 'Fuzzy Rough Set Based Feature Selection for Large-Scale Hierarchical Classification', authors: ["Hong Zhao", "Ping Wang", "Qinghua Hu", "Pengfei Zhu"], venue: 'IEEE TFS', year: 2019, type: 'journal' },
  { id: '83', title: 'Deep Global Generalized Gaussian Networks', authors: ["Qilong Wang", "Peihua Li", "Qinghua Hu", "Pengfei Zhu", "Wangmeng Zuo"], venue: 'CVPR', year: 2019, type: 'conference' },
  { id: '84', title: 'Progressive Image Deraining Networks: A Better and Simpler Baseline', authors: ["Dongwei Ren", "Wangmeng Zuo", "Qinghua Hu", "Pengfei Zhu", "Deyu Meng"], venue: 'CVPR', year: 2019, type: 'conference' },
  { id: '85', title: 'Latent Semantic Aware Multi-View Multi-Label Classification', authors: ["Changqing Zhang", "Ziwei Yu", "Qinghua Hu", "Pengfei Zhu", "Xinwang Liu", "Xiaobo Wang"], venue: 'AAAI', year: 2018, type: 'conference' },
  { id: '86', title: 'FISH-MML: Fisher-HSIC Multi-View Metric Learning', authors: ["Changqing Zhang", "Yeqing Liu", "Yue Liu", "Qinghua Hu", "Xinwang Liu", "Pengfei Zhu"], venue: 'IJCAI', year: 2018, type: 'conference' },
  { id: '87', title: 'Beyond Similar and Dissimilar Relations: A Kernel Regression Formulation for Metric Learning', authors: ["Pengfei Zhu", "Ren Qi", "Qinghua Hu", "Qilong Wang", "Changqing Zhang", "Liu Yang"], venue: 'IJCAI', year: 2018, type: 'conference' },
  { id: '88', title: 'Towards Generalized and Efficient Metric Learning on Riemannian Manifold', authors: ["Pengfei Zhu", "Hao Cheng", "Qinghua Hu", "Qilong Wang", "Changqing Zhang"], venue: 'IJCAI', year: 2018, type: 'conference' },
  { id: '89', title: 'Flexible Multi-View Dimensionality Co-Reduction', authors: ["Changqing Zhang", "Huazhu Fu", "Qinghua Hu", "Pengfei Zhu", "Xiaochun Cao"], venue: 'IEEE TIP', year: 2017, type: 'journal' },
  { id: '90', title: 'Hierarchical Feature Selection with Recursive Regularization', authors: ["Hong Zhao", "Pengfei Zhu", "Ping Wang", "Qinghua Hu"], venue: 'IJCAI', year: 2017, type: 'conference' },
  { id: '91', title: 'Data-Distribution-Aware Fuzzy Rough Set Model and its Application to Robust Classification', authors: ["Shuang An", "Qinghua Hu", "Witold Pedrycz", "Pengfei Zhu", "Eric CC Tsang"], venue: 'IEEE TCYB', year: 2017, type: 'journal' },
  { id: '92', title: 'Image Set Based Collaborative Representation for Face Recognition with Margin Distribution Optimization', authors: ["Pengfei Zhu", "Wangmeng Zuo", "Lei Zhang", "Simon Chi-Keung Shiu", "David Zhang"], venue: 'IEEE TIFS', year: 2017, type: 'journal' },
  { id: '93', title: 'Coupled Dictionary Learning for Unsupervised Feature Selection', authors: ["Pengfei Zhu", "Qinghua Hu", "Changqing Zhang", "Wangmeng Zuo"], venue: 'AAAI', year: 2016, type: 'conference' },
  { id: '94', title: 'From Point to Set: Extend the Learning of Distance Metrics', authors: ["Pengfei Zhu", "Lei Zhang", "Wangmeng Zuo", "David Zhang"], venue: 'ICCV', year: 2013, type: 'conference' },
  { id: '95', title: 'Multi-scale Patch Based Collaborative Representation for Face Recognition with Margin Distribution Optimization', authors: ["Pengfei Zhu", "Lei Zhang", "Qinghua Hu", "Simon C.K. Shiu"], venue: 'ECCV', year: 2012, type: 'conference' },
  { id: '96', title: 'A Linear Subspace Learning Approach via Sparse Coding', authors: ["Lei Zhang", "Pengfei Zhu", "Qinghua Hu", "David Zhang"], venue: 'ICCV', year: 2011, type: 'conference' },
  { id: '97', title: 'A Novel Algorithm for Finding Reducts With Fuzzy Rough Sets', authors: ["Degang Chen", "Lei Zhang", "Suyun Zhao", "Qinghua Hu", "Pengfei Zhu"], venue: 'IEEE TFS', year: 2011, type: 'journal' },
];

const defaultDatasets: Dataset[] = [
  {
    id: '1',
    name: 'VisDrone',
    full_name: 'VisDrone Dataset',
    description: 'VisDrone是一个大规模无人机图像和视频目标检测、跟踪基准数据集，包含各种天气，光照和高度条件下采集的数据。',
    category: 'detection',
    paper_title: 'The VisDrone Dataset: A Large-scale Benchmark for Object Detection in Drone Imagery',
    paper_venue: 'IEEE TPAMI',
    paper_year: 2021,
    features: ['目标检测', '目标跟踪', '视频分析'],
    stats: { images: '10,000+', videos: '200+', annotations: '200万+' },
    github: 'https://github.com/VisDrone/VisDrone-Dataset',
    stars: 2160,
  },
  {
    id: '2',
    name: 'DroneVehicle',
    full_name: 'DroneVehicle Dataset',
    description: 'DroneVehicle是一个基于无人机的RGB-红外跨模态车辆检测数据集，支持可见光和热红外双模态目标检测研究。',
    category: 'multimodal',
    paper_title: 'DroneVehicle: A Large-scale Benchmark for RGB-Infrared Vehicle Detection',
    paper_venue: 'ICCV',
    paper_year: 2021,
    features: ['RGB-红外', '车辆检测', '跨模态'],
    stats: { images: '28,000+', annotations: '400万+' },
    github: 'https://github.com/VisDrone/DroneVehicle',
    stars: 674,
  },
  {
    id: '3',
    name: 'DroneCrowd',
    full_name: 'DroneCrowd Dataset',
    description: 'DroneCrowd是一个基于无人机的人群密度图估计、计数和跟踪的人群分析数据集，支持人群检测、计数和跟踪多任务学习。',
    category: 'crowd',
    paper_title: 'DroneCrowd: A Large-scale Benchmark for Crowd Detection, Counting and Tracking',
    paper_venue: 'ECCV',
    paper_year: 2020,
    features: ['人群计数', '密度估计', '人群跟踪'],
    stats: { images: '12,000+', annotations: '300万+' },
    github: 'https://github.com/VisDrone/DroneCrowd',
    stars: 213,
  },
  {
    id: '4',
    name: 'MDMT',
    full_name: 'Multi-Drone Multi-Target Tracking Dataset',
    description: 'MDMT是一个多无人机多目标跟踪数据集，包含88个视频序列、39,678帧图像，涵盖11,454个不同ID的人、自行车和汽车。',
    category: 'tracking',
    paper_title: 'MDMT: A Multi-Drone Multi-Target Tracking Dataset',
    paper_venue: 'CVPR',
    paper_year: 2022,
    features: ['多机协同', '多目标跟踪', '跨视角'],
    stats: { videos: '88', frames: '39,678', annotations: '54万+' },
    github: 'https://github.com/VisDrone',
    stars: 0,
  },
];

const defaultModels: Model[] = [
  {
    id: '1',
    name: '图类增量学习',
    full_name: 'Graph-based Class-Incremental Learning',
    description: '基于图的类增量学习方法，支持持续学习场景下的新类别识别',
    task: '目标检测',
    paper_title: 'Graph-based Class-Incremental Learning',
    paper_venue: 'NeurIPS',
    paper_year: 2024,
    features: ['增量学习', '图神经网络', '持续学习'],
    github: 'https://github.com/VisDrone',
    stars: 128,
    forks: 32,
  },
  {
    id: '2',
    name: '半监督持续学习',
    full_name: 'Semi-Supervised Continual Learning',
    description: '半监督场景下的持续学习框架，利用未标注数据提升模型性能',
    task: '目标检测',
    paper_title: 'Semi-Supervised Continual Learning',
    paper_venue: 'NeurIPS',
    paper_year: 2024,
    features: ['半监督', '持续学习', '自训练'],
    github: 'https://github.com/VisDrone',
    stars: 96,
    forks: 24,
  },
];

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: 'VisDrone团队获得吴文俊人工智能科学技术奖科技进步一等奖',
    url: '#',
    date: '2024-12',
    excerpt: 'VisDrone团队凭借在低空智能领域的突出贡献，荣获2024年度吴文俊人工智能科学技术奖科技进步一等奖。',
    category: '获奖荣誉',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
  },
  {
    id: '2',
    title: '昇腾AI创新大赛2024全国总决赛获奖',
    url: '#',
    date: '2024-11',
    excerpt: 'VisDrone团队在昇腾AI创新大赛2024全国总决赛中获得高校赛道铜奖，天津赛区金奖。',
    category: '竞赛获奖',
    image: 'https://images.unsplash.com/photo-1531297461136-82lw9z1q19v?w=800&q=80',
  },
];

const defaultTeam: TeamMember[] = [
  {
    id: '1',
    name: '朱鹏飞',
    name_en: 'Pengfei Zhu',
    role: '教授 博士生导师',
    title: '团队负责人',
    bio: '天津大学智能与计算学部教授，博士生导师。研究方向：机器学习、计算机视觉、低空智能。',
    research_interests: ['机器学习', '计算机视觉', '低空智能'],
    email: 'zhupengfei@tju.edu.cn',
    homepage: 'https://pengfeizhu.com',
  },
  {
    id: '2',
    name: '孙一铭',
    name_en: 'Yimeng Sun',
    role: '助理研究员',
    title: '至善博士后',
    bio: '研究方向：无人机具身智能、多模态协同学习',
    research_interests: ['无人机具身智能', '多模态协同学习'],
    homepage: 'https://sunym2020.github.io/yimingsun.github.io/',
  },
];

class VisDroneService {
  async getNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_news')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToNews);
        await localDatabase.put('news', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch news from Supabase:', e);
    }
    const sortedNews = [...realNews].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sortedNews;
  }

  async getNewsById(id: string): Promise<NewsItem | null> {
    return realNews.find(n => n.id === id) || null;
  }

  async getDatasets(): Promise<Dataset[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_datasets')
        .select('*');

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToDataset).sort((a, b) => (b.stars || 0) - (a.stars || 0));
        await localDatabase.put('datasets', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch datasets from Supabase:', e);
    }
    const sortedDatasets = [...realDatasets].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    return sortedDatasets;
  }

  async getModels(): Promise<Model[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_models')
        .select('*')
        .order('stars', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToModel);
        await localDatabase.put('models', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch models from Supabase:', e);
    }
    const sortedModels = [...realModels].sort((a, b) => (b.stars || 0) - (a.stars || 0));
    return sortedModels;
  }

  async getPapers(): Promise<Paper[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_papers')
        .select('*')
        .order('year', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToPaper);
        await localDatabase.put('papers', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch papers from Supabase:', e);
    }
    const sortedPapers = [...realPapers].sort((a, b) => b.year - a.year);
    return sortedPapers;
  }

  async getPatents(): Promise<Patent[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_patents')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToPatent);
        await localDatabase.put('patents', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch patents from Supabase:', e);
    }
    const sortedPatents = [...realPatents].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sortedPatents;
  }

  async getAwards(): Promise<Award[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_awards')
        .select('*')
        .order('year', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToAward);
        await localDatabase.put('awards', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch awards from Supabase:', e);
    }
    const sortedAwards = [...realAwards].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sortedAwards;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_team')
        .select('*')
        .order('name');

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToTeamMember);
        await localDatabase.put('team', formattedData);
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch team from Supabase:', e);
    }
    return realTeam;
  }

  async getSeminars(): Promise<SeminarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_seminars')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToSeminarEvent).filter(s => s.type === 'group_meeting');
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch seminars from Supabase:', e);
    }
    const sortedSeminars = [...realSeminars].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sortedSeminars;
  }

  async getTalks(): Promise<SeminarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('visdrone_seminars')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        const formattedData = data.map(mapDbToSeminarEvent).filter(s => s.type === 'invited_talk');
        return formattedData;
      }
    } catch (e) {
      console.warn('Failed to fetch talks from Supabase:', e);
    }
    const sortedTalks = [...realTalks].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return sortedTalks;
  }
}

export const visdroneService = new VisDroneService();
export default visdroneService;
