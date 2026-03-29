import type { Dataset } from '@/types/visdrone';

export const datasets: Dataset[] = [
  {
    "id": "demmirf",
    "name": "DeMMI-RF",
    "full_name": "DeMMI-RF: 退化多模态图像融合数据集",
    "description": "DeMMI-RF是一个退化多模态图像恢复与融合数据集，包含高斯噪声、雾霾、散焦模糊、条纹噪声等多种退化类型，支持可见光-红外图像融合与恢复任务。",
    "category": "低空环境感知",
    "paper_title": "Task-gated Multi-expert Collaboration Network for Degraded Multi-modal Image Fusion",
    "paper_venue": "International Conference on Machine Learning",
    "paper_year": 2025,
    "features": [
      "多退化类型",
      "多模态融合",
      "图像恢复",
      "可见光-红外"
    ],
    "stats": {
      "images": "35,418+",
      "annotations": "多退化标注"
    },
    "github": "https://github.com/LeeX54946/TG-ECNet",
    "github_info": {
      "forks": 1,
      "stars": 25,
      "license": "MIT",
      "description": "Task-gated Multi-expert Collaboration Network for Degraded Multi-modal Image Fusion"
    },
    "created_at": "2026-03-19T13:18:39.488967+00:00",
    "updated_at": "2026-03-19T15:30:55.2156+00:00"
  },
  {
    "id": "droneswarms",
    "name": "DroneSwarms",
    "full_name": "DroneSwarms: 反无人机集群微小目标检测数据集",
    "description": "DroneSwarms是一个反无人机集群微小目标检测数据集，包含9,109张图像和242,218个标注的无人机实例，平均每张图像包含26.59个无人机实例，是目前平均目标尺寸最小的无人机检测数据集。",
    "category": "低空环境感知",
    "paper_title": "Visible and Clear: Finding Tiny Objects in Difference Map",
    "paper_venue": "European Conference on Computer Vision",
    "paper_year": 2024,
    "features": [
      "微小目标检测",
      "集群检测",
      "差分图分析"
    ],
    "stats": {
      "images": "9,109",
      "categories": 1,
      "annotations": "242,218"
    },
    "github": "https://hiyuur.github.io/",
    "github_info": {
      "forks": 0,
      "stars": 0,
      "license": "GPL-3.0",
      "description": "Visible and Clear: Finding Tiny Objects in Difference Map"
    },
    "created_at": "2026-03-19T13:18:39.357188+00:00",
    "updated_at": "2026-03-19T15:30:54.726478+00:00"
  },
  {
    "id": "dronebird",
    "name": "DroneBird",
    "full_name": "DroneBird: 基于无人机的鸟类分析数据集",
    "description": "DroneBird是一个基于无人机的鸟群密度图估计、计数和跟踪的鸟类分析数据集。",
    "category": "低空环境感知",
    "paper_title": "Efficient Masked AutoEncoder for Video Object Counting and A Large-Scale Benchmark",
    "paper_venue": "International Conference on Learning Representations",
    "paper_year": 2025,
    "authors": ["Bing Cao", "Quanhao Lu", "Jiekang Feng", "Qilong Wan", "Pengfei Zhu", "Qinghua Hu"],
    "features": [
      "鸟类检测",
      "鸟群计数",
      "密度估计",
      "行为追踪"
    ],
    "stats": {},
    "github": "https://github.com/mast1ren/E-MAC",
    "github_info": {
      "forks": 0,
      "stars": 13,
      "license": "CC BY-NC-SA 4.0",
      "description": "Efficient Masked AutoEncoder for Video Object Counting and A Large-Scale Benchmark"
    },
    "created_at": "2026-03-19T13:18:39.205602+00:00",
    "updated_at": "2026-03-19T15:30:53.26521+00:00"
  },
  {
    "id": "animaldrone",
    "name": "AnimalDrone",
    "full_name": "AnimalDrone: 基于无人机的视频动物计数数据集",
    "description": "AnimalDrone是一个基于无人机的视频动物计数数据集，用于研究无人机视角下的动物检测与计数问题。",
    "category": "低空环境感知",
    "paper_title": "Graph Regularized Flow Attention Network for Video Animal Counting From Drones",
    "paper_venue": "IEEE Transactions on Image Processing",
    "paper_year": 2021,
    "authors": ["Pengfei Zhu", "Tao Peng", "Dawei Du", "Hongtao Yu", "Libo Zhang", "Qinghua Hu"],
    "features": [
      "动物检测",
      "视频计数",
      "群体行为分析"
    ],
    "stats": {},
    "github": "https://github.com/VisDrone/AnimalDrone",
    "github_info": {
      "forks": 3,
      "stars": 25,
      "license": "GPL-3.0",
      "description": "Graph Regularized Flow Attention Network for Video Animal Counting From Drones"
    },
    "created_at": "2026-03-19T13:18:38.588627+00:00",
    "updated_at": "2026-03-19T15:30:52.193883+00:00"
  },
  {
    "id": "lyu-droneinfrared",
    "name": "LYU-DroneInfrared",
    "full_name": "LYU-DroneInfrared: 基于无人机的热红外人群计数数据集",
    "description": "LYU-DroneInfrared是一个基于无人机的热红外人群计数数据集，包含64,210张图像和2,997,352个头部标注点，涵盖学校、街道、广场、运动场等不同场景。该数据集使用红外相机采集，有效克服了可见光图像在低光照条件下计数性能受限的问题。",
    "category": "低空环境感知",
    "paper_title": "A Large-Scale Drone Based Thermal Infrared Benchmark and Inception Transformer Network for Crowd Counting",
    "paper_venue": "Pattern Recognition",
    "paper_year": 2025,
    "authors": ["Wang, Xing", "Li, Timing", "Liu, Ya", "Yao, Shuanglong", "Liu, Ye", "Yang, Nan", "Zhu, Pengfei"],
    "features": [
      "热红外图像",
      "人群计数",
      "密度估计",
      "低光照场景"
    ],
    "stats": {
      "images": "64,210",
      "videos": "237",
      "annotations": "2,997,352",
      "categories": 1
    },
    "github": "https://github.com/TIMOLEEGO/IncepTNet",
    "github_info": {
      "forks": 0,
      "stars": 0,
      "license": "MIT",
      "description": "A Large-Scale Drone based Thermal Infrared Benchmark and Inception Transformer Network for Crowd Counting"
    },
    "created_at": "2026-03-25T00:00:00.000000+00:00",
    "updated_at": "2026-03-25T00:00:00.000000+00:00"
  },
  {
    "id": "dronergbt",
    "name": "DroneRGBT",
    "full_name": "DroneRGBT: 基于无人机的RGB-T人群计数数据集",
    "description": "DroneRGBT是一个基于无人机的RGB-T人群计数数据集，支持可见光和热红外双模态人群计数研究。",
    "category": "低空环境感知",
    "paper_title": "RGB-T Crowd Counting from Drone: A Benchmark and MMCCN Network",
    "paper_venue": "Proceedings of the Asian Conference on Computer Vision",
    "paper_year": 2020,
    "authors": ["Peng Tang", "Qian Liu", "Pengfei Zhu", "Qinghua Hu"],
    "features": [
      "RGB-T双模态",
      "人群计数",
      "跨模态学习"
    ],
    "stats": {},
    "github": "https://github.com/VisDrone/DroneRGBT",
    "github_info": {
      "forks": 6,
      "stars": 48,
      "license": "GPL-3.0",
      "description": "RGB-T Crowd Counting from Drone: A Benchmark and MMCCN Network"
    },
    "created_at": "2026-03-19T13:18:38.223445+00:00",
    "updated_at": "2026-03-19T15:30:52.052259+00:00"
  },
  {
    "id": "multidrone",
    "name": "MultiDrone",
    "full_name": "MultiDrone: 多无人机单目标跟踪数据集",
    "description": "MultiDrone是一个多无人机单目标跟踪数据集，用于研究多机协同目标跟踪问题。",
    "category": "低空群体智能",
    "paper_title": "Multi-Drone-Based Single Object Tracking With Agent Sharing Network",
    "paper_venue": "IEEE Transactions on Circuits and Systems for Video Technology",
    "paper_year": 2020,
    "authors": ["Pengfei Zhu", "Jiayu Zheng", "Dawei Du", "Longyin Wen", "Yiming Sun", "Qinghua Hu"],
    "features": [
      "多机协同",
      "单目标跟踪",
      "视角互补"
    ],
    "stats": {},
    "github": "https://github.com/VisDrone/MultiDrone",
    "github_info": {
      "forks": 7,
      "stars": 75,
      "license": "GPL-3.0",
      "description": "Multi-Drone based Single Object Tracking with Agent Sharing Network"
    },
    "created_at": "2026-03-19T13:18:38.077457+00:00",
    "updated_at": "2026-03-19T15:30:49.681936+00:00"
  },
  {
    "id": "mdmt",
    "name": "MDMT",
    "full_name": "MDMT: 多无人机多目标跟踪数据集",
    "description": "MDMT是一个多无人机多目标跟踪数据集，包含88个视频序列、39,678帧图像，涵盖11,454个不同ID的人、自行车和汽车，其中543,444个边界框包含目标遮挡。",
    "category": "低空群体智能",
    "paper_title": "Robust Multi-Drone Multi-Target Tracking to Resolve Target Occlusion: A Benchmark",
    "paper_venue": "IEEE Transactions on Multimedia",
    "paper_year": 2023,
    "authors": ["Zhihao Liu", "Yuanyuan Shang", "Timing Li", "Guanlin Chen", "Yu Wang", "Qinghua Hu", "Pengfei Zhu"],
    "features": [
      "多机协同",
      "多目标跟踪",
      "遮挡处理"
    ],
    "stats": {
      "videos": "88",
      "categories": 3,
      "annotations": "220万+"
    },
    "github": "https://github.com/VisDrone/Multi-Drone-Multi-Object-Detection-and-Tracking",
    "github_info": {
      "forks": 19,
      "stars": 159,
      "license": "GPL-3.0",
      "description": "Robust Multi-Drone Multi-Target Tracking to Resolve Target Occlusion: A Benchmark"
    },
    "created_at": "2026-03-19T13:18:37.940407+00:00",
    "updated_at": "2026-03-19T15:30:49.517676+00:00"
  },
  {
    "id": "dronecrowd",
    "name": "DroneCrowd",
    "full_name": "DroneCrowd: 基于无人机的人群分析数据集",
    "description": "DroneCrowd是一个基于无人机的人群密度图估计、计数和跟踪的人群分析数据集，支持人群检测、计数和跟踪多任务学习。",
    "category": "低空环境感知",
    "paper_title": "Detection, Tracking, and Counting Meets Drones in Crowds: A Benchmark",
    "paper_venue": "Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition",
    "paper_year": 2021,
    "authors": ["Longyin Wen", "Dawei Du", "Pengfei Zhu", "Qinghua Hu", "Qilong Wang", "Lifeng Bo", "Siwei Lyu"],
    "features": [
      "人群检测",
      "人群计数",
      "人群追踪",
      "密度估计"
    ],
    "stats": {
      "videos": "33",
      "annotations": "480万+"
    },
    "github": "https://github.com/VisDrone/DroneCrowd",
    "github_info": {
      "forks": 39,
      "stars": 212,
      "license": "GPL-3.0",
      "description": "Drone-based Joint Density Map Estimation, Localization and Tracking"
    },
    "created_at": "2026-03-19T13:18:37.80914+00:00",
    "updated_at": "2026-03-19T15:30:49.383574+00:00"
  },
  {
    "id": "dronevehicle",
    "name": "DroneVehicle",
    "full_name": "DroneVehicle: 基于无人机的RGB-T车辆检测数据集",
    "description": "DroneVehicle是一个基于无人机的RGB-红外跨模态车辆检测数据集，支持可见光和热红外双模态目标检测研究。",
    "category": "低空环境感知",
    "paper_title": "Drone-Based RGB-Infrared Cross-Modality Vehicle Detection via Uncertainty-Aware Learning",
    "paper_venue": "IEEE Transactions on Circuits and Systems for Video Technology",
    "paper_year": 2022,
    "authors": ["Yiming Sun", "Bing Cao", "Pengfei Zhu", "Qinghua Hu"],
    "features": [
      "RGB-T双模态",
      "车辆检测",
      "全天候场景",
      "跨模态融合"
    ],
    "stats": {
      "images": "56,878",
      "categories": 5,
      "annotations": "200万+"
    },
    "github": "https://github.com/VisDrone/DroneVehicle",
    "github_info": {
      "forks": 60,
      "stars": 675,
      "license": "GPL-3.0",
      "description": "Drone-based RGB-Infrared Cross-Modality Vehicle Detection"
    },
    "created_at": "2026-03-19T13:18:37.502271+00:00",
    "updated_at": "2026-03-19T15:30:48.275654+00:00"
  },
  {
    "id": "visdrone",
    "name": "VisDrone",
    "full_name": "VisDrone: 无人机目标检测和追踪基准数据集",
    "description": "VisDrone是一个大规模无人机图像和视频目标检测、跟踪基准数据集，包含各种天气，光照和高度条件下采集的数据。",
    "category": "低空环境感知",
    "paper_title": "Detection and Tracking Meet Drones Challenge",
    "paper_venue": "IEEE Transactions on Pattern Analysis and Machine Intelligence",
    "paper_year": 2021,
    "authors": ["Pengfei Zhu", "Longyin Wen", "Dawei Du", "Xiao Bian", "Heng Fan", "Qinghua Hu", "Haibin Ling"],
    "features": [
      "目标检测",
      "目标追踪",
      "多场景覆盖",
      "大规模标注"
    ],
    "stats": {
      "images": "10,209",
      "videos": "400",
      "categories": 10,
      "annotations": "250万+"
    },
    "github": "https://github.com/VisDrone/VisDrone-Dataset",
    "github_info": {
      "forks": 223,
      "stars": 2147,
      "license": "GPL-3.0",
      "description": "The dataset for drone based detection and tracking"
    },
    "created_at": "2026-03-19T13:18:37.353656+00:00",
    "updated_at": "2026-03-19T15:30:48.150901+00:00"
  },
];

export function getDatasetById(id: string): Dataset | undefined {
  return datasets.find(item => item.id === id);
}
