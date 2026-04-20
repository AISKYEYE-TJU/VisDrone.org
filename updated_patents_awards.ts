// 专利数据
const defaultPatents: Patent[] = [
  { id: '1', title: '基于多视图知识集成和频率一致性的人脸跨域翻译方法', inventors: ["曹兵", "王清和", "朱鹏飞", "胡清华", "赵佳鸣", "毕志伟", "亓国栋", "孙一铭", "高毓聪", "曹亚如"], number: 'CN 120088145 B', date: '2025', type: '发明', pdf_url: undefined },
  { id: '2', title: '基于分布不确定性的多模态特征迁移人群计数方法及装置', inventors: ["曹亚如", "朱鹏飞", "曹兵", "孙一铭", "胡清华"], number: 'CN 120088144 B', date: '2025', type: '发明', pdf_url: undefined },
  { id: '3', title: '基于递归式融合转换单元的多模态图像合成方法及装置', inventors: ["赵佳鸣", "曹兵", "朱鹏飞", "胡清华"], number: 'ZL 2025 1 0028210.X', date: '2025-11-04', type: '发明', pdf_url: undefined },
  { id: '4', title: '基于推理高效的动态优化早退模型、方法、系统及设备', inventors: ["罗立伟", "王旗龙", "任冬伟", "朱鹏飞", "胡清华"], number: 'ZL 2024 1 1921894.8', date: '2025-10-31', type: '发明', pdf_url: undefined },
  { id: '5', title: '一种基于动态相对性增强的图像融合方法及装置', inventors: ["徐兴歆", "曹兵", "朱鹏飞", "胡清华"], number: 'ZL 2025 1 0093976.6', date: '2025-12-26', type: '发明', pdf_url: undefined },
  { id: '6', title: '基于文本引导的视频到文本离散的视频识别方法及装置', inventors: ["王月新", "朱文成", "朱鹏飞", "胡清华"], number: 'ZL 2024 1 1711502.5', date: '2025-10-28', type: '发明', pdf_url: undefined },
  { id: '7', title: '人群计数的方法、装置、电子设备、存储介质', inventors: ["朱鹏飞", "张敬林", "王星", "张问银", "王九如", "王兴华"], number: 'ZL 2024 1 0543567.7', date: '2024-08-30', type: '发明', pdf_url: undefined },
  { id: '8', title: '一种无人机多模态跟踪方法', inventors: ["朱鹏飞", "张敬林", "王星", "张问银", "王九如", "王兴华"], number: 'ZL 2024 1 0369741.0', date: '2024-06-25', type: '发明', pdf_url: undefined },
  { id: '9', title: '一种基于弱监督双流视觉语言交互的答案定位方法及装置', inventors: ["朱鹏飞", "刘轶", "陈冠林", "胡清华"], number: 'ZL 2023 1 0067972.1', date: '2025-08-26', type: '发明', pdf_url: undefined },
  { id: '10', title: '一种基于关系嵌入的图像合成的方法、装置及存储介质', inventors: ["朱鹏飞", "贾安", "汪廉杰", "刘洋"], number: 'ZL 2021 1 1457354.5', date: '2025-02-07', type: '发明', pdf_url: undefined },
];

// 获奖数据
const defaultAwards: Award[] = [
  { id: '1', title: "吴文俊人工智能科学技术奖科技进步一等奖", authors: ["朱鹏飞", "齐俊桐", "于宏志", "胡清华", "孙一铭", "仇梓峰", "王明明", "王煜", "曹兵", "靳锴", "瞿关明", "任冬伟", "张云", "赵少阳", "平原"], venue: '中国人工智能学会', date: '2024', pdf_url: undefined },
  { id: '2', title: "昇腾AI创新大赛2024全国总决赛高校赛道铜奖", authors: ["冯杰康", "李想", "姚海屿", "姚鑫杰"], venue: '华为', date: '2024', pdf_url: undefined },
  { id: '3', title: "昇腾AI创新大赛2024天津赛区金奖", authors: ["冯杰康", "姚海屿", "姚鑫杰", "李想"], venue: '华为', date: '2024', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/26-昇腾AI创新大赛2024天津赛区金奖（2024年度）-1.pdf' },
  { id: '4', title: "第九届"互联网+"大学生创新创业大赛天津赛区金奖", authors: ["赵秋多", "王沛", "姚海屿", "周鑫", "王铭宇", "张鹏程"], venue: '天津大学', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/第九届互联网大学生创新创业大赛天津赛区金奖.pdf' },
  { id: '5', title: "中国国际大学生创新大赛国际赛道银奖", authors: ["张庭赫", "Suhaib Suhaib"], venue: '', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/中国国际大学生创新大赛国际赛道银奖.pdf' },
  { id: '6', title: "CVPR 2023 Object Discovery Challenge冠军", authors: ["王茂林", "陈曦", "穆郡贤"], venue: 'CVPR', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/CVPR-Object-Discovery-Challenge竞赛冠军（2023年度）.pdf' },
  { id: '7', title: "CVPR 2023 CLVision Challenge 亚军", authors: ["朱之林", "范妍", "陈慧彤", "季罗娜", "姚鑫杰", "穆郡贤"], venue: 'CVPR', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/CLVision-Challenge-2023.pdf' },
  { id: '8', title: "天津市科技进步二等奖", authors: ["谢津平", "朱鹏飞", "王旗龙", "奚歌", "张云姣", "詹昊", "许健", "曹兵"], venue: '天津市人民政府', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/天津市科技进步二等奖.pdf' },
  { id: '9', title: "天津大学十佳杰出青年(教工)", authors: ["朱鹏飞"], venue: '天津大学', date: '2023', pdf_url: undefined },
  { id: '10', title: "第三届"无人争锋"挑战赛使命召唤冠军", authors: ["平原", "刘海超", "杨嘉豪", "吴冲", "杨光", "孙立远", "刘效朋", "陶柏安", "姚海屿", "朱鹏飞"], venue: '', date: '2023', pdf_url: 'https://aiskyeye.com/wp-content/uploads/2024/11/24-第三届无人争锋挑战赛使命召唤冠军（2023年度）最小压缩版.pdf' },
];
