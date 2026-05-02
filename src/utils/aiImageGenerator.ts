// AI 图片生成服务 - 使用 Trae AI 生图功能
// 科技风、学术风、AI风，低空智能主题配图

export interface ImagePrompt {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
}

// Trae AI 图片生成 API
export const generateAIImage = ({
  prompt,
  width = 800,
  height = 450,
}: ImagePrompt): string => {
  const size = width > height ? 'landscape_16_9' : height > width ? 'portrait' : 'square';
  const styleSuffix = '科技感，学术风格，AI智能，蓝色调，高清，专业摄影，电影级光影';
  const enhancedPrompt = `${prompt}，${styleSuffix}`;
  const encodedPrompt = encodeURIComponent(enhancedPrompt);
  
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${size}`;
};

// 数据集配图提示词 - 低空智能数据集
export const datasetPrompts: Record<string, string> = {
  'VisDrone': '无人机低空航拍智慧城市场景，AI目标检测可视化，蓝色科技边框标注，计算机视觉算法界面，学术研究数据集展示',
  'DroneVehicle': '无人机夜间低空车辆检测，红外热成像与可见光融合，AI多模态感知，蓝色科技风格数据可视化',
  'DroneCrowd': '无人机低空人群密度分析，AI人群计数热力图，蓝色渐变数据层，智慧城市监控，学术研究场景',
  'MDMT': '多无人机协同低空目标跟踪，AI多目标轨迹预测，蓝色科技连线，空中智能感知网络',
  'DroneBird': '无人机低空野生动物监测，AI鸟类识别与跟踪，自然与科技融合，蓝色数据标注层',
  'AnimalDrone': '无人机低空航拍野生动物，AI动物检测计数系统，蓝色科技界面，生态保护智能监测',
  'DroneRGBT': '无人机低空RGB-热成像融合，AI多模态人群感知，蓝色分屏对比，学术研究可视化',
  'MultiDrone': '多无人机低空协同编队，AI群体智能调度，蓝色科技轨迹线，空中机器人协作',
  'DroneSwarms': '无人机集群低空飞行，AI集群感知与避障，蓝色科技网格，低空智能系统',
  'DeMMI-RF': '低空多模态图像融合复原，AI图像增强算法，蓝色科技处理界面，学术研究展示'
};

// 模型配图提示词 - AI深度学习模型
export const modelPrompts: Record<string, string> = {
  'default': '深度学习神经网络架构3D可视化，AI模型结构图，蓝色发光节点连接，科技感学术风格',
  'detection': 'AI目标检测神经网络架构，CNN卷积层可视化，蓝色科技边框预测，低空智能感知模型',
  'tracking': 'AI目标跟踪算法可视化，时序轨迹预测网络，蓝色数据流线，低空视频分析模型',
  'counting': 'AI人群计数密度估计网络，注意力机制可视化，蓝色热力图层，无人机视角计数模型',
  'segmentation': 'AI语义分割网络架构，像素级分类可视化，蓝色彩色分割层，低空场景理解模型',
  'fusion': 'AI多模态融合网络架构，RGB-红外特征融合，蓝色双向箭头连接，低空感知融合模型',
  'attention': 'AI注意力机制可视化，Transformer自注意力矩阵，蓝色发光连接，深度学习模型架构',
  'graph': 'AI图神经网络架构，节点消息传递可视化，蓝色知识图谱，类增量学习模型'
};

// 页面 Hero 配图提示词 - 低空智能主题
export const heroPrompts: Record<string, string> = {
  'home': '无人机低空飞越智慧城市，AI智能感知未来城市场景，蓝色科技天空，低空经济愿景，学术研究氛围，无任何文字、无水印、无英文、无标志、纯视觉场景',
  'research': '低空智能研究实验室，AI无人机研发场景，蓝色全息投影，科技感学术环境，未来科技，无任何文字',
  'database': '低空大数据中心，AI数据存储与处理，蓝色服务器机架灯光，科技感数据库，学术研究平台，无任何文字',
  'model': 'AI深度学习模型可视化，神经网络架构展示，蓝色发光节点，科技感模型库，学术研究工具，无任何文字',
  'knowledge': 'AI知识图谱可视化，低空智能知识网络，蓝色互联节点，科技感知识库，学术研究平台，无任何文字',
  'team': '低空智能研究团队，AI科研协作场景，蓝色科技环境，学术研究氛围，未来实验室，无任何文字',
  'news': '低空智能新闻资讯平台，AI实时信息流，蓝色科技界面，学术动态展示，科技新闻，无任何文字',
  'publications': '低空智能学术成果展示，AI研究论文与专利，蓝色图书馆灯光，科技感学术出版，无任何文字',
  'tools': '低空智能开发平台，AI编程与仿真工具，蓝色代码界面，科技感开发环境，学术研究工具，无任何文字',
  'contact': '低空智能合作交流，AI全球网络连接，蓝色数字地球，科技感通讯，学术合作，无任何文字'
};

// 获取数据集配图
export const getDatasetImage = (name: string): string => {
  let prompt = datasetPrompts['VisDrone'];
  
  for (const [key, value] of Object.entries(datasetPrompts)) {
    if (name.includes(key) || key.includes(name)) {
      prompt = value;
      break;
    }
  }
  
  return generateAIImage({ prompt, width: 800, height: 450 });
};

// 获取模型配图
export const getModelImage = (name: string, task?: string): string => {
  let prompt = modelPrompts['default'];
  
  if (task) {
    if (task.includes('检测')) prompt = modelPrompts['detection'];
    else if (task.includes('跟踪')) prompt = modelPrompts['tracking'];
    else if (task.includes('计数')) prompt = modelPrompts['counting'];
    else if (task.includes('分割')) prompt = modelPrompts['segmentation'];
    else if (task.includes('融合')) prompt = modelPrompts['fusion'];
  }
  
  if (name.includes('Det') || name.includes('检测')) prompt = modelPrompts['detection'];
  else if (name.includes('Track') || name.includes('跟踪')) prompt = modelPrompts['tracking'];
  else if (name.includes('Fusion') || name.includes('融合')) prompt = modelPrompts['fusion'];
  else if (name.includes('Count') || name.includes('计数')) prompt = modelPrompts['counting'];
  else if (name.includes('Seg') || name.includes('分割')) prompt = modelPrompts['segmentation'];
  else if (name.includes('Net')) prompt = modelPrompts['attention'];
  else if (name.includes('Graph') || name.includes('图')) prompt = modelPrompts['graph'];
  
  return generateAIImage({ prompt, width: 800, height: 450 });
};

// 获取页面 Hero 配图
export const getHeroImage = (page: string): string => {
  const prompt = heroPrompts[page] || heroPrompts['home'];
  return generateAIImage({ prompt, width: 1920, height: 1080 });
};

// 获取工具配图
export const getToolImage = (id: string): string => {
  const prompts: Record<string, string> = {
    'ai4r': 'AI科研自动化平台，低空智能研究助手，蓝色科技界面，学术研究工具，智能发现系统',
    'world-simulator': '低空世界数字孪生模拟器，AI虚拟仿真环境，蓝色全息3D场景，科技感仿真平台',
    'social-simulator': '低空社会仿真系统，AI城市动态模拟，蓝色数据可视化，智慧城市仿真',
    'visdrone-platform': '低空智能开放平台，无人机数据模型服务，蓝色科技仪表盘，AI评测系统'
  };
  
  const prompt = prompts[id] || prompts['visdrone-platform'];
  return generateAIImage({ prompt, width: 800, height: 450 });
};

// 获取新闻配图
export const getNewsImage = (category: string, title: string): string => {
  const categoryPrompts: Record<string, string> = {
    '获奖荣誉': '低空智能研究获奖典礼，AI科技成果展示，蓝色奖杯荣誉，学术成就庆祝',
    '竞赛获奖': 'AI无人机竞赛获奖现场，低空智能挑战赛，蓝色科技舞台，学术竞技氛围',
    '学术成果': '低空智能学术研究突破，AI论文发表成果，蓝色学术背景，科研创新展示',
    '学术交流': '低空智能学术会议交流，AI研究合作研讨，蓝色专业场景，学术分享氛围',
    '平台建设': '低空智能平台建设，AI系统架构开发，蓝色科技建设，学术基础设施',
    '科研项目': '低空智能科研项目启动，AI科研探索计划，蓝色项目蓝图，学术研究愿景'
  };
  
  const prompt = categoryPrompts[category] || categoryPrompts['学术成果'];
  return generateAIImage({ prompt, width: 1200, height: 675 });
};

// 获取研究方向配图
export const getResearchImage = (id: string): string => {
  const prompts: Record<string, string> = {
    'perception': '低空智能感知系统，AI无人机视觉感知，蓝色目标检测框，多模态传感器融合',
    'embodied': '低空具身智能机器人，AI空中机器人导航，蓝色智能轨迹，自主决策系统',
    'swarm': '低空群体智能系统，AI无人机集群协作，蓝色协同网络，分布式智能调度'
  };
  
  const prompt = prompts[id] || prompts['perception'];
  return generateAIImage({ prompt, width: 800, height: 450 });
};

// 获取团队成员配图
export const getTeamMemberImage = (role: string, name: string): string => {
  const rolePrompts: Record<string, string> = {
    'professor': 'AI低空智能教授学者，学术研究场景，蓝色科技背景，专业学术形象',
    'phd': 'AI低空智能博士生研究，学术实验室场景，蓝色科技环境，年轻科研人员',
    'master': 'AI低空智能硕士生学习，学术研究场景，蓝色科技氛围，科研新人',
    'undergraduate': 'AI低空智能本科生实习，学术学习场景，蓝色科技环境，科研启蒙'
  };
  
  let prompt = rolePrompts['phd'];
  if (role.includes('教授') || role.includes('导师')) prompt = rolePrompts['professor'];
  else if (role.includes('博士')) prompt = rolePrompts['phd'];
  else if (role.includes('硕士')) prompt = rolePrompts['master'];
  else if (role.includes('本科')) prompt = rolePrompts['undergraduate'];
  
  return generateAIImage({ prompt, width: 400, height: 400 });
};

// 获取论文配图
export const getPaperImage = (venue: string, title: string): string => {
  const venuePrompts: Record<string, string> = {
    'CVPR': 'CVPR计算机视觉会议，AI低空视觉研究，蓝色学术海报，顶级会议展示',
    'ICCV': 'ICCV国际计算机视觉会议，AI无人机视觉，蓝色科技论文，学术会议场景',
    'NeurIPS': 'NeurIPS神经信息处理会议，AI深度学习研究，蓝色神经网络，顶级AI会议',
    'ECCV': 'ECCV欧洲计算机视觉会议，AI视觉算法，蓝色学术展示，国际会议场景',
    'TPAMI': 'IEEE TPAMI期刊论文，AI计算机视觉研究，蓝色学术封面，顶级期刊',
    'IJCV': 'IJCV国际计算机视觉期刊，AI视觉研究，蓝色论文展示，学术期刊'
  };
  
  let prompt = venuePrompts['CVPR'];
  for (const [key, value] of Object.entries(venuePrompts)) {
    if (venue.includes(key)) {
      prompt = value;
      break;
    }
  }
  
  return generateAIImage({ prompt, width: 600, height: 400 });
};

// 获取奖项配图
export const getAwardImage = (title: string): string => {
  const prompt = 'AI低空智能研究获奖，科技竞赛奖杯证书，蓝色荣誉展示，学术成就庆祝';
  return generateAIImage({ prompt, width: 600, height: 400 });
};

// 获取专利配图
export const getPatentImage = (title: string): string => {
  const prompt = 'AI低空智能技术专利证书，科技创新发明，蓝色专利文档，学术知识产权';
  return generateAIImage({ prompt, width: 600, height: 400 });
};

export default {
  generateAIImage,
  getDatasetImage,
  getModelImage,
  getHeroImage,
  getToolImage,
  getNewsImage,
  getResearchImage,
  getTeamMemberImage,
  getPaperImage,
  getAwardImage,
  getPatentImage
};
