import { IMAGES } from "@/assets/images";
import { TeamMember, ResearchProject, Publication } from "@/lib/index";

/**
 * 实验室团队成员数据
 * 包含：负责人、在读研究生、博士生及校友
 */
export const teamMembers: TeamMember[] = [
  {
    id: "zhao-tianjiao",
    name: "赵天娇",
    nameEn: "Tianjiao Zhao",
    role: "PI",
    title: "创始人",
    image: "/photoztj.jpg",
    bio: "女，中共党员，1987年出生。人机协同设计实验室创始人。2015年获香港理工大学设计学博士学位，曾在台湾大学建筑与城乡研究所担任访问学人。长期致力于智能创新设计与设计教育研究，主持国家自然科学基金面上项目等多项科研课题。",
    researchInterests: ["设计创新教育", "群智创新设计", "人机交互设计", "生成式设计"],
    email: "zhaotianjiao@seu.edu.cn",
    phone: "18222863021",
    website: "https://haiseu.com",
    scholar: "#"
  },
  {
    id: "phd-1",
    name: "邹佳怡",
    nameEn: "Jiayi Zou",
    role: "PhD",
    title: "香港理工大学设计学博士生",
    image: "/zoujiayi.png",
    bio: "研究方向为智能设计教育。",
    researchInterests: ["智能设计教育", "设计创新", "教育技术"],
    email: "zoujiayi@polyu.edu.hk"
  },
  {
    id: "master-1",
    name: "罗晨尹",
    nameEn: "Chenyin Luo",
    role: "Master",
    title: "天津大学设计学硕士生",
    image: "/luochenyin.png",
    bio: "研究方向为设计创意与科普可视化。",
    researchInterests: ["设计创意", "科普可视化", "视觉设计"],
    email: "luochenyin@tju.edu.cn"
  },
  {
    id: "alumni-1",
    name: "贾佳怡",
    nameEn: "Jiayi Jia",
    role: "Alumni",
    title: "2024届硕士毕业生",
    image: "/alumni/image1.jpeg",
    bio: "百度地图",
    researchInterests: []
  },
  {
    id: "alumni-5",
    name: "郑雅文",
    nameEn: "Yawen Zheng",
    role: "Alumni",
    title: "2022届硕士毕业生",
    image: "/alumni/image5.jpeg",
    bio: "中国工商银行天津分行",
    researchInterests: []
  },
  {
    id: "alumni-2",
    name: "张欣悦",
    nameEn: "Xinyue Zhang",
    role: "Alumni",
    title: "2021届硕士毕业生",
    image: "/alumni/image2.jpeg",
    bio: "美团 · APP技术部",
    researchInterests: []
  },
  {
    id: "alumni-3",
    name: "陈孟娇",
    nameEn: "Mengjiao Chen",
    role: "Alumni",
    title: "2020届硕士毕业生",
    image: "/alumni/image3.jpeg",
    bio: "中国移动通信集团设计院",
    researchInterests: []
  },
  {
    id: "alumni-4",
    name: "朱天飞",
    nameEn: "Tianfei Zhu",
    role: "Alumni",
    title: "2020届硕士毕业生",
    image: "/alumni/image4.jpeg",
    bio: "天津内燃机研究所",
    researchInterests: []
  },
  // 虚拟博士生
  {
    id: "phd-ai-1",
    name: "智绘",
    nameEn: "Zhi Hui",
    role: "PhD",
    title: "AI设计智能体",
    image: IMAGES.PHD_AI_1,
    bio: "专注于生成式设计算法研究，擅长利用大语言模型和扩散模型进行创意生成。",
    researchInterests: ["生成式AI", "创意算法", "设计自动化"]
  },
  {
    id: "phd-ai-2",
    name: "交互",
    nameEn: "Jiao Hu",
    role: "PhD",
    title: "人机交互智能体",
    image: IMAGES.PHD_AI_2,
    bio: "研究多模态交互界面设计，探索自然语言与视觉交互的融合技术。",
    researchInterests: ["多模态交互", "界面设计", "用户体验"]
  },
  {
    id: "phd-ai-3",
    name: "群智",
    nameEn: "Qun Zhi",
    role: "PhD",
    title: "群智创新智能体",
    image: IMAGES.PHD_AI_3,
    bio: "研究集体智慧在设计过程中的应用，构建协作式设计系统。",
    researchInterests: ["群智设计", "协作系统", "创新方法"]
  },
  // 虚拟硕士生
  {
    id: "master-ai-1",
    name: "创想",
    nameEn: "Chuang Xiang",
    role: "Master",
    title: "创意设计智能体",
    image: IMAGES.MASTER_AI_1,
    bio: "专注于AI辅助创意生成，探索设计思维与人工智能的结合点。",
    researchInterests: ["创意生成", "设计思维", "AI辅助设计"]
  },
  {
    id: "master-ai-2",
    name: "视觉",
    nameEn: "Shi Jue",
    role: "Master",
    title: "视觉设计智能体",
    image: IMAGES.MASTER_AI_2,
    bio: "研究计算机视觉在设计中的应用，擅长图像识别和视觉风格分析。",
    researchInterests: ["计算机视觉", "视觉设计", "风格迁移"]
  },
  {
    id: "master-ai-3",
    name: "体验",
    nameEn: "Ti Yan",
    role: "Master",
    title: "用户体验智能体",
    image: IMAGES.MASTER_AI_3,
    bio: "专注于用户体验评估与优化，利用AI技术分析用户行为数据。",
    researchInterests: ["用户体验", "行为分析", "数据可视化"]
  },
  {
    id: "master-ai-4",
    name: "代码",
    nameEn: "Dai Ma",
    role: "Master",
    title: "创意编程智能体",
    image: IMAGES.MASTER_AI_4,
    bio: "研究创意编程与生成艺术，将代码作为设计工具。",
    researchInterests: ["创意编程", "生成艺术", "交互装置"]
  },
  {
    id: "master-ai-5",
    name: "语言",
    nameEn: "Yu Yan",
    role: "Master",
    title: "自然语言处理智能体",
    image: IMAGES.MASTER_AI_5,
    bio: "研究自然语言处理在设计中的应用，开发设计相关的对话系统。",
    researchInterests: ["NLP", "对话系统", "设计助手"]
  },
  {
    id: "master-ai-6",
    name: "伦理",
    nameEn: "Lun Li",
    role: "Master",
    title: "AI伦理智能体",
    image: IMAGES.MASTER_AI_6,
    bio: "研究AI设计工具的伦理问题，确保技术应用符合人类价值观。",
    researchInterests: ["AI伦理", "设计伦理", "负责任创新"]
  },
  {
    id: "master-ai-7",
    name: "教育",
    nameEn: "Jiao Yu",
    role: "Master",
    title: "设计教育智能体",
    image: IMAGES.MASTER_AI_7,
    bio: "研究AI在设计教育中的应用，开发智能教学辅助系统。",
    researchInterests: ["设计教育", "智能教学", "教育技术"]
  },
  {
    id: "master-ai-8",
    name: "未来",
    nameEn: "Wei Lai",
    role: "Master",
    title: "未来设计智能体",
    image: IMAGES.MASTER_AI_8,
    bio: "探索未来设计趋势，研究新兴技术对设计行业的影响。",
    researchInterests: ["未来设计", "技术趋势", "设计预见"]
  },
  {
    id: "master-ai-9",
    name: "对齐",
    nameEn: "Dui Qi",
    role: "Master",
    title: "对齐智能体",
    image: IMAGES.MASTER_AI_9,
    bio: "研究人的设计价值如何和机器对齐，如何让机器掌握人的审美、刺激人的审美、提高人的审美",
    researchInterests: ["价值对齐", "审美计算", "设计美学", "人机协同设计"]
  }
];

/**
 * 核心研究项目数据
 * 涵盖实验室目前进行中和已完成的重大科研课题
 */
export const researchProjects: ResearchProject[] = [
  {
    id: "p11",
    title: "教育部产学协同育人项目：AI辅助设计教育",
    titleEn: "Ministry of Education Industry-University Collaborative Education Project: AI-Assisted Design Education",
    description: "AI辅助设计教育，2025.12-2026.12，20万，主持，在研。",
    image: IMAGES.PROJECT_11,
    tags: ["AI Education", "Design Teaching", "Industry-University Cooperation"],
    status: "进行中",
    year: "2025 - 2026"
  },
  {
    id: "p4",
    title: "天津大学数字化赋能人才培养项目：AI辅助设计教育研究",
    titleEn: "Tianjin University Digital Empowerment Talent Training Project: AI-Assisted Design Education Research",
    description: "AI辅助设计教育研究，2024.3-2025.3，2万，主持，结题。",
    image: IMAGES.PROJECT_4,
    tags: ["AI Education", "Digital Empowerment", "Design Teaching"],
    status: "已完成",
    year: "2024 - 2025"
  },
  {
    id: "p1",
    title: "国家自然科学基金面上项目：设计大数据驱动的创意设计教育方法与应用",
    titleEn: "National Natural Science Foundation: Design Big Data Driven Creative Design Education Methods and Applications",
    description: "设计大数据驱动的创意设计教育方法与应用，2023.1-2026.12，55万，主持，在研。",
    image: IMAGES.PROJECT_1,
    tags: ["Big Data", "Design Education", "Creative Methods"],
    status: "进行中",
    year: "2023 - 2026"
  },
  {
    id: "p7",
    title: "校企合作课程共建项目：基于蓝湖系列产品的《用户体验设计》课程建设",
    titleEn: "University-Enterprise Cooperation Course Co-construction Project: User Experience Design Course Construction Based on Blue Lake Series Products",
    description: "基于蓝湖系列产品的《用户体验设计》课程建设，2021.05.01-2024.04.01，2万，主持，结题。",
    image: IMAGES.PROJECT_7,
    tags: ["User Experience", "Course Construction", "Industry Cooperation"],
    status: "已完成",
    year: "2021 - 2024"
  },
  {
    id: "p5",
    title: "教育部人文社会科学研究项目：藏东玛尼堆文化艺术的数字化保存及创新发展研究",
    titleEn: "Ministry of Education Humanities and Social Sciences Research Project: Digital Preservation and Innovative Development of Zangdong Mani堆 Cultural Art",
    description: "藏东玛尼堆文化艺术的数字化保存及创新发展研究，2019.01.01-2021.12.30，8万元，参与，结题。",
    image: IMAGES.PROJECT_5,
    tags: ["Cultural Heritage", "Digital Preservation", "Tibetan Culture"],
    status: "已完成",
    year: "2019 - 2021"
  },
  {
    id: "p9",
    title: "校企合作技术开发项目：智能台灯设计与研发",
    titleEn: "University-Enterprise Cooperation Technology Development Project: Smart Desk Lamp Design and R&D",
    description: "智能台灯设计与研发，2018.8-2021.8，20万，参与，结题。",
    image: IMAGES.PROJECT_9,
    tags: ["Smart Products", "Industrial Design", "R&D"],
    status: "已完成",
    year: "2018 - 2021"
  },
  {
    id: "p3",
    title: "教育部产学研协同育人项目：《用户体验设计》课程教学改革",
    titleEn: "Ministry of Education Industry-University-Research Collaborative Education Project: Teaching Reform of User Experience Design Course",
    description: "《用户体验设计》课程教学改革，2019.5.14-2020.5.14，3万，主持，结题。",
    image: IMAGES.PROJECT_3,
    tags: ["Education Reform", "User Experience", "Curriculum Development"],
    status: "已完成",
    year: "2019 - 2020"
  },
  {
    id: "p8",
    title: "校企合作技术开发项目：基于工程项目综合管理平台信息系统的技术集成与系统化支持",
    titleEn: "University-Enterprise Cooperation Technology Development Project: Technical Integration and Systematic Support Based on Engineering Project Comprehensive Management Platform Information System",
    description: "基于工程项目综合管理平台信息系统的技术集成与系统化支持，2019.3.6-2020.6.1，9.5万，参与，结题。",
    image: IMAGES.PROJECT_8,
    tags: ["Information System", "Engineering Management", "Technical Integration"],
    status: "已完成",
    year: "2019 - 2020"
  },
  {
    id: "p2",
    title: "国家自然科学基金青年项目：基于深度学习技术的设计创意激发方法研究",
    titleEn: "National Natural Science Foundation Youth Project: Research on Design Creativity Stimulation Methods Based on Deep Learning Technology",
    description: "基于深度学习技术的设计创意激发方法研究，2018.1-2020.12，25万，主持，结题。",
    image: IMAGES.PROJECT_2,
    tags: ["Deep Learning", "Creativity", "Design Methods"],
    status: "已完成",
    year: "2018 - 2020"
  },
  {
    id: "p6",
    title: "天津大学自主创新项目：地铁公共空间中的共享服务设计理论与方法",
    titleEn: "Tianjin University Independent Innovation Project: Shared Service Design Theory and Methods in Subway Public Space",
    description: "地铁公共空间中的共享服务设计理论与方法，2017.1-2017.12，1万，主持，结题。",
    image: IMAGES.PROJECT_6,
    tags: ["Public Space", "Service Design", "Subway"],
    status: "已完成",
    year: "2017"
  },
  {
    id: "p10",
    title: "天津大学自主创新项目：藏东玛尼石刻艺术的艺术特色、文化意义及保护研究",
    titleEn: "Tianjin University Independent Innovation Project: Artistic Characteristics, Cultural Significance and Protection Research of Zangdong Mani Stone Carving Art",
    description: "藏东玛尼石刻艺术的艺术特色、文化意义及保护研究，2017.1-2017.12，1万，参与，结题。",
    image: IMAGES.PROJECT_10,
    tags: ["Cultural Heritage", "Stone Carving", "Tibetan Art"],
    status: "已完成",
    year: "2017"
  }
];

/**
 * 学术出版物数据
 * 包含期刊、会议、专著等分类，支持首页精选展示
 */
export const publications: Publication[] = [
  // 2026年论文
  {
    id: "pub-2026-01",
    title: "Enhancing Design Ideation: Comparing AIGC-Engaged and Traditional Brainstorming in Educational Contexts",
    authors: ["Zou, J.", "Zhao, X.", "Siu, K.W. M.", "Zhao, T. J."],
    venue: "Educational Technology Research and Development",
    year: 2026,
    type: "期刊论文",
    doi: "",
    isSelected: true
  },
  {
    id: "pub-2025-02",
    title: "Experimental study on improving the quality of interdisciplinary design: Collaborate with AI psychology experts for design develop process",
    authors: ["Zhao, X.", "Zou, J.", "Siu, K.W. M.", "Zhao, T. J."],
    venue: "Design Studies",
    year: 2025,
    type: "期刊论文",
    doi: "",
    isSelected: true
  },
  
  // 2024年论文
  {
    id: "pub-2024-01",
    title: "Intelligent Evaluation Method for Design Education: Comparison research between visualizing heat-maps of class activation and eye-movement",
    authors: ["Zhao T.J.", "Jia Y.J.", "Yang J.Y.", "Wang Q."],
    venue: "Journal of Eye Movement Research",
    year: 2024,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2023年论文
  {
    id: "pub-2023-01",
    title: "Research on emotion-embedded design flow based on deep learning technology",
    authors: ["Zhao T.J.", "Jia J.Y.", "Zhu T.F.", "Yang J.Y."],
    venue: "International Journal of Technology and Design Education",
    year: 2023,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2023-02",
    title: "A study on users' attention distribution to product features under different emotions",
    authors: ["Zhao T.J.", "Zhang X.Y.", "Zhang H.C.", "Meng Y.F."],
    venue: "Behaviour & Information Technology",
    year: 2023,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2023-03",
    title: "Research on evaluation elements of design works for design education",
    authors: ["Yang J.Y.", "Jia J.Y.", "Zhao.T.J.*"],
    venue: "Lecture notes in Artificial Intelligence",
    year: 2023,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2021年论文
  {
    id: "pub-2021-01",
    title: "Creative idea generation method based on deep learning",
    authors: ["Zhao, T.J.", "Yang J.Y.", "Zhang H.C.", "Kin Wai Michael Siu"],
    venue: "International Journal of Technology and Design Education",
    year: 2021,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2021-02",
    title: "Research on Improving Empathy Based on the Campus Barrier-Free Virtual Experience Game",
    authors: ["Yang J.Y.", "Zheng Y.W.", "Zhao T. J.*", "Zhang M."],
    venue: "HCII 2021",
    year: 2021,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  
  // 2019年论文
  {
    id: "pub-2019-01",
    title: "Exploration of product design emotion based on three-level theory of emotional design",
    authors: ["Zhao T.J.", "Zhu, T.F."],
    venue: "Advances in Intelligent Systems and Computing",
    year: 2019,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  
  // 2018年论文
  {
    id: "pub-2018-01",
    title: "A Study of the Influence of Images on Design Creative Stimulation",
    authors: ["Chen M.J.", "Zhao T. J.*", "Zhang H.C.", "Luo S.J."],
    venue: "Social Computing and Social Media. User Experience and Behavior. 10th International Conference, SCSM 3-18",
    year: 2018,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2018-02",
    title: "日常生活形态探索方法研究——产品形态设计教学探索与实践",
    authors: ["赵天娇", "张赫晨", "杨君宇"],
    venue: "装饰",
    year: 2018,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2018-03",
    title: "设计思维在动画设计中的应用研究",
    authors: ["赵天娇", "孙晗", "李响"],
    venue: "艺术与设计(理论)",
    year: 2018,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2018-04",
    title: "面向老年人的地铁空间用户需求研究",
    authors: ["赵天娇", "邵健伟"],
    venue: "包装工程",
    year: 2018,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2017年论文
  {
    id: "pub-2017-01",
    title: "The Application of Augmented Reality Technology on Museum Exhibition—A Museum Display Project in Mawangdui Han Dynasty Tombs Virtual",
    authors: ["Han D", "Li X", "Zhao T. J.*"],
    venue: "Augmented and Mixed Reality",
    year: 2017,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2017-02",
    title: "Discovering subway design opportunities using social network data: The image-need-design opportunity model",
    authors: ["Zhao T.J.", "Siu K W M", "Sun H."],
    venue: "International Conference on Social Computing and Social Media. Springer, Cham, 2017",
    year: 2017,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2017-03",
    title: "The Production of URT Public Space: People, Occupation, and Practice in the Hong Kong Mass Transit Railway",
    authors: ["Zhao, T.J.", "Kin Wai Michael Siu"],
    venue: "The International Journal of Architectonic, Spatial, and Environmental Design",
    year: 2017,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2017-04",
    title: "Deep Learning based Design Image Management",
    authors: ["Zhao T. J", "Gao K", "Li X", "et al"],
    venue: "Proceedings of the International Conference on Environmental Science and Sustainable Energy, Ed.by ZhaoYang Dong[M]// ESSE 2017",
    year: 2017,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2017-05",
    title: "基于自由与控制理论的公共空间行为研究",
    authors: ["赵天娇", "李兴", "邵健伟"],
    venue: "设计",
    year: 2017,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2015年论文
  {
    id: "pub-2015-01",
    title: "The Needs for Quality Urban Rail Transit Life in Asian Metropolitan Cities",
    authors: ["Zhao, T.J.", "Siu, K. W. M."],
    venue: "Applied Research in Quality of Life",
    year: 2015,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2014年论文
  {
    id: "pub-2014-01",
    title: "The Boundaries of Public Space: A Case Study of Hong Kong Mass Transit Railway",
    authors: ["Zhao, T.J.", "Siu, K. W. M."],
    venue: "International Journal of Design",
    year: 2014,
    type: "期刊论文",
    doi: "",
    isSelected: true
  },
  {
    id: "pub-2014-02",
    title: "Freedom and Control: A state of balance in public space",
    authors: ["Zhao, T.J.", "Siu, K. W. M."],
    venue: "Facilities",
    year: 2014,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2014-03",
    title: "An Ergonomic Study of Firefighters' Postural Comfort Evaluation Based on EMG Method",
    authors: ["Yang L", "Kang B", "Wang T", "Zhao T.J."],
    venue: "Proceedings of the Human Factors & Ergonomics Society Annual Meeting",
    year: 2014,
    type: "会议论文",
    doi: "",
    isSelected: false
  },
  
  // 2013年论文
  {
    id: "pub-2013-01",
    title: "City spaces and human relations in Hong Kong's Mass Transit Railway: From circulation to everyday life",
    authors: ["Siu, K. W. M.", "Zhao, T. J."],
    venue: "Journal of Human Behavior in the Social Environment",
    year: 2013,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2012年论文
  {
    id: "pub-2012-01",
    title: "The role of subway in the urban life: Case study in Hong Kong Mass Transit Railway",
    authors: ["Zhao T. J.", "Siu K. W. M."],
    venue: "Humanities and Social Sciences Review",
    year: 2012,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 2022年论文
  {
    id: "pub-2022-01",
    title: "Research on Image Retrieval Optimization Based on Eye Movement Experiment Data",
    authors: ["Zhao T.J.", "Chen M.J.", "Liu W.F."],
    venue: "Journal of Education and Training Studies",
    year: 2022,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2022-02",
    title: "年画吉祥意象在现代设计中的创新应用——以杨柳青年画为例",
    authors: ["赵天娇", "李晓璐", "王涵昱"],
    venue: "设计",
    year: 2022,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2021-03",
    title: "新工科背景下\"用户体验设计\"课程教学改革探索--\"多融\"课程模式实践",
    authors: ["赵天娇", "张赫晨", "潘璐"],
    venue: "创意与设计",
    year: 2021,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  {
    id: "pub-2018-05",
    title: "微建筑视角下无人驾驶汽车舱内视知觉设计研究",
    authors: ["杨君宇", "项忠霞", "贡小雷", "赵天娇"],
    venue: "包装工程",
    year: 2018,
    type: "期刊论文",
    doi: "",
    isSelected: false
  },
  
  // 专著和教材
  {
    id: "book-2020-01",
    title: "视觉策略助推服务设计----VI 高手之路",
    authors: ["杨君宇", "赵天娇", "张赫晨"],
    venue: "清华大学出版社",
    year: 2020,
    type: "教材",
    isSelected: false
  },
  {
    id: "book-2026-01",
    title: "用户体验与视觉设计",
    authors: ["杨君宇", "赵天娇", "张赫晨"],
    venue: "机械工业出版社",
    year: 2026,
    type: "教材",
    isSelected: false
  },
  {
    id: "book-2026-02",
    title: "影响世界的设计大师",
    authors: ["赵天娇"],
    venue: "机械工业出版社",
    year: 2026,
    type: "专著",
    isSelected: false
  },
  {
    id: "book-2026-03",
    title: "设计师如何用AIGC：实战案例与方法",
    authors: ["赵天娇", "邹佳怡"],
    venue: "机械工业出版社",
    year: 2026,
    type: "教材",
    isSelected: false
  }
];
