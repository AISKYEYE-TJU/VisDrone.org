import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, Download, RefreshCw, CheckCircle, XCircle, 
  Search, Settings, AlertCircle, Clock, Calendar, 
  BarChart3, PieChart, Activity, TrendingUp, FileText, 
  ChevronRight, ArrowLeft, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// ==================== 类型定义 ====================

type SkillCategory = 'research' | 'writing' | 'data-analysis' | 'citation' | 'conference' | 'grant';
type UpdateStatus = 'idle' | 'searching' | 'installing' | 'updating' | 'verifying' | 'completed' | 'error';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  installed: boolean;
  lastUpdated?: string;
}

interface Message {
  id: string;
  content: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

interface UpdateState {
  status: UpdateStatus;
  progress: number;
  currentSkill?: string;
  message: string;
  skillsFound: number;
  skillsInstalled: number;
  skillsUpdated: number;
  errors: string[];
}

// ==================== 技能分类 ====================

const skillCategories: { [key in SkillCategory]: { name: string; description: string; icon: React.ReactNode; color: string } } = {
  research: {
    name: '研究',
    description: '文献综述、研究设计、方法论',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-600'
  },
  writing: {
    name: '写作',
    description: '学术写作、论文准备、发表',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-green-100 text-green-600'
  },
  'data-analysis': {
    name: '数据分析',
    description: '统计分析、数据可视化、计算方法',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-600'
  },
  citation: {
    name: '引用管理',
    description: '引用格式、参考文献管理',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-yellow-100 text-yellow-600'
  },
  conference: {
    name: '会议准备',
    description: '会议提交、演讲、networking',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-600'
  },
  grant: {
    name: '基金申请',
    description: '基金提案开发、资金申请',
    icon: <Book className="w-5 h-5" />,
    color: 'bg-red-100 text-red-600'
  }
};

// ==================== 初始技能数据 ====================

const initialSkills: Skill[] = [
  {
    id: 'agent-identifier',
    name: '智能体识别工具',
    description: '帮助识别和管理智能体',
    category: 'research',
    version: '1.2.0',
    installed: true,
    lastUpdated: '2026-02-20'
  },
  {
    id: 'architecture-design',
    name: '架构设计工具',
    description: '帮助设计软件架构',
    category: 'research',
    version: '1.0.1',
    installed: true,
    lastUpdated: '2026-02-18'
  },
  {
    id: 'bug-detective',
    name: ' bug 检测工具',
    description: '帮助检测和修复代码中的 bug',
    category: 'data-analysis',
    version: '1.1.0',
    installed: true,
    lastUpdated: '2026-02-15'
  },
  {
    id: 'citation-verification',
    name: '引用验证工具',
    description: '帮助验证和管理参考文献',
    category: 'citation',
    version: '2.0.0',
    installed: true,
    lastUpdated: '2026-02-10'
  },
  {
    id: 'code-review-excellence',
    name: '代码审查工具',
    description: '帮助进行高质量的代码审查',
    category: 'research',
    version: '1.0.0',
    installed: true,
    lastUpdated: '2026-02-05'
  },
  {
    id: 'command-development',
    name: '命令开发工具',
    description: '帮助开发和管理命令',
    category: 'research',
    version: '1.5.0',
    installed: true,
    lastUpdated: '2026-02-01'
  },
  {
    id: 'ml-paper-writing',
    name: '机器学习论文写作',
    description: '帮助撰写机器学习相关论文',
    category: 'writing',
    version: '1.2.0',
    installed: true,
    lastUpdated: '2026-01-28'
  },
  {
    id: 'research-ideation',
    name: '研究构思助手',
    description: '帮助进行研究构思和文献综述',
    category: 'research',
    version: '1.3.0',
    installed: true,
    lastUpdated: '2026-01-25'
  },
  {
    id: 'results-analysis',
    name: '结果分析工具',
    description: '提供研究结果分析和可视化功能',
    category: 'data-analysis',
    version: '1.4.0',
    installed: true,
    lastUpdated: '2026-01-20'
  },
  {
    id: 'writing-anti-ai',
    name: '反AI写作工具',
    description: '帮助撰写更具人性化的内容',
    category: 'writing',
    version: '1.2.0',
    installed: true,
    lastUpdated: '2026-01-15'
  }
];

// 从本地存储加载技能数据
const loadSkillsFromStorage = (): Skill[] => {
  try {
    // 强制使用新的初始技能数据，清除旧的本地存储
    localStorage.removeItem('academicSkills');
    return initialSkills;
  } catch (error) {
    console.error('Failed to load skills from storage:', error);
    return initialSkills;
  }
};

// 保存技能数据到本地存储
const saveSkillsToStorage = (skills: Skill[]) => {
  try {
    localStorage.setItem('academicSkills', JSON.stringify(skills));
  } catch (error) {
    console.error('Failed to save skills to storage:', error);
  }
};

// ==================== 主组件 ====================

const AcademicSkillsUpdaterAgent: React.FC = () => {
  // 状态管理
  const [skills, setSkills] = useState<Skill[]>(loadSkillsFromStorage);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [updateState, setUpdateState] = useState<UpdateState>({
    status: 'idle',
    progress: 0,
    message: '',
    skillsFound: 0,
    skillsInstalled: 0,
    skillsUpdated: 0,
    errors: []
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [updateInterval, setUpdateInterval] = useState('daily');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillFiles, setSkillFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'skills' | 'files'>('skills');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  
  // 初始加载时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // 添加消息
  const addMessage = (content: string, type: 'info' | 'success' | 'error' | 'warning') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  // 过滤技能
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);
  
  // 模拟从GitHub等数据源获取新技能
  const fetchNewSkillsFromGitHub = async (): Promise<Skill[]> => {
    // 模拟从GitHub API获取新技能
    addMessage('从GitHub搜索新技能...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 模拟从GitHub获取的新技能
    const newSkillsFromGitHub: Skill[] = [
      {
        id: 'ai-literature-review',
        name: 'AI文献综述助手',
        description: '利用AI技术进行深度文献分析和综述生成',
        category: 'research',
        version: '2.0.0',
        installed: false
      },
      {
        id: 'grant-proposal-generator',
        name: '基金提案生成器',
        description: '自动生成基金申请提案的核心内容',
        category: 'grant',
        version: '1.5.0',
        installed: false
      },
      {
        id: 'data-visualization-pro',
        name: '数据可视化专业版',
        description: '高级数据可视化工具，支持复杂图表生成',
        category: 'data-analysis',
        version: '2.5.0',
        installed: false
      },
      {
        id: 'academic-writing-assistant',
        name: '学术写作助手',
        description: '智能学术写作辅助工具，提供语法和结构建议',
        category: 'writing',
        version: '1.8.0',
        installed: false
      },
      {
        id: 'conference-presentation',
        name: '会议演讲助手',
        description: '帮助准备会议演讲材料和练习',
        category: 'conference',
        version: '1.2.0',
        installed: false
      }
    ];
    
    addMessage(`从GitHub发现 ${newSkillsFromGitHub.length} 个新技能`, 'success');
    return newSkillsFromGitHub;
  };

  // 模拟技能更新流程
  const runSkillUpdate = async () => {
    setUpdateState(prev => ({
      ...prev,
      status: 'searching',
      progress: 0,
      message: '正在搜索最新的学术技能...',
      skillsFound: 0,
      skillsInstalled: 0,
      skillsUpdated: 0,
      errors: []
    }));
    
    addMessage('开始搜索最新的学术技能...', 'info');
    
    // 从GitHub等数据源获取新技能
    const newSkills = await fetchNewSkillsFromGitHub();
    
    setUpdateState(prev => ({
      ...prev,
      status: 'installing',
      progress: 30,
      message: `发现 ${newSkills.length} 个新技能，开始安装...`,
      skillsFound: newSkills.length
    }));
    
    addMessage(`发现 ${newSkills.length} 个新技能，开始安装...`, 'info');
    
    // 模拟安装过程
    let installedCount = 0;
    for (let i = 0; i < newSkills.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setUpdateState(prev => ({
        ...prev,
        progress: 30 + (i + 1) * (60 / newSkills.length),
        currentSkill: newSkills[i].name,
        message: `正在安装 ${newSkills[i].name}...`,
        skillsInstalled: i + 1
      }));
      
      addMessage(`安装技能: ${newSkills[i].name}`, 'success');
      installedCount++;
    }
    
    setUpdateState(prev => ({
      ...prev,
      status: 'updating',
      progress: 90,
      message: '正在更新现有技能...'
    }));
    
    addMessage('开始更新现有技能...', 'info');
    
    // 模拟更新现有技能
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUpdateState(prev => ({
      ...prev,
      status: 'verifying',
      progress: 95,
      message: '正在验证技能安装状态...'
    }));
    
    addMessage('验证技能安装状态...', 'info');
    
    // 模拟验证过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUpdateState(prev => ({
      ...prev,
      status: 'completed',
      progress: 100,
      message: '技能更新完成！'
    }));
    
    addMessage('技能更新完成！', 'success');
    addMessage(`已安装 ${installedCount} 个新技能，更新 2 个现有技能`, 'success');
    
    // 更新技能列表，添加新技能并更新现有技能
    setSkills(prev => {
      // 合并现有技能和新技能，去重
      const existingSkillIds = new Set(prev.map(s => s.id));
      // 自动安装新技能
      const skillsToAdd = newSkills.filter(s => !existingSkillIds.has(s.id)).map(skill => ({
        ...skill,
        installed: true,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      
      // 更新现有技能
      const updatedExistingSkills = prev.map(skill => ({
        ...skill,
        installed: true,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      
      // 合并技能列表
      const updatedSkills = [...updatedExistingSkills, ...skillsToAdd];
      
      // 自动保存到本地存储
      saveSkillsToStorage(updatedSkills);
      
      return updatedSkills;
    });
  };
  
  // 安装单个技能
  const installSkill = async (skill: Skill) => {
    addMessage(`开始安装技能: ${skill.name}`, 'info');
    
    // 模拟安装过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSkills(prev => {
      const updatedSkills = prev.map(s => 
        s.id === skill.id 
          ? { ...s, installed: true, lastUpdated: new Date().toISOString().split('T')[0] }
          : s
      );
      
      // 自动保存到本地存储
      saveSkillsToStorage(updatedSkills);
      return updatedSkills;
    });
    
    addMessage(`技能安装成功: ${skill.name}`, 'success');
  };
  
  // 更新单个技能
  const updateSkill = async (skill: Skill) => {
    addMessage(`开始更新技能: ${skill.name}`, 'info');
    
    // 模拟更新过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSkills(prev => {
      const updatedSkills = prev.map(s => 
        s.id === skill.id 
          ? { ...s, version: '1.0.1', lastUpdated: new Date().toISOString().split('T')[0] }
          : s
      );
      
      // 自动保存到本地存储
      saveSkillsToStorage(updatedSkills);
      return updatedSkills;
    });
    
    addMessage(`技能更新成功: ${skill.name}`, 'success');
  };
  
  // 查看技能文件
  const viewSkillFiles = (skill: Skill) => {
    setSelectedSkill(skill);
    setViewMode('files');
    
    // 尝试加载真实的技能文件
    try {
      const fs = require('fs');
      const path = require('path');
      
      // 输出调试信息
      console.log('Skill ID:', skill.id);
      console.log('Current working directory:', process.cwd());
      
      // 使用相对路径
      const skillPath = path.join('claude-scholar', 'skills', skill.id);
      console.log('Using relative path:', skillPath);
      
      if (fs.existsSync(skillPath)) {
        const files = fs.readdirSync(skillPath, { recursive: true });
        console.log('Files found:', files);
        const fileList = files.map((file: string) => {
          const filePath = path.join(skillPath, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            isDirectory: stats.isDirectory()
          };
        });
        setSkillFiles(fileList);
      } else {
        console.log('No path found for skill:', skill.id);
        setSkillFiles([]);
      }
    } catch (error) {
      console.error('Error loading skill files:', error);
      setSkillFiles([]);
    }
  };
  
  // 加载文件内容
  const loadFileContent = (file: any) => {
    if (file.isDirectory) return;
    
    try {
      const fs = require('fs');
      const content = fs.readFileSync(file.path, 'utf8');
      setSelectedFile(file);
      setFileContent(content);
    } catch (error) {
      console.error('Error loading file content:', error);
      setFileContent('无法加载文件内容');
    }
  };
  
  // 返回技能列表
  const returnToSkills = () => {
    setViewMode('skills');
    setSelectedSkill(null);
    setSkillFiles([]);
    setSelectedFile(null);
    setFileContent('');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">学术技能更新器</h1>
          <p className="text-muted-foreground">Academic Skills Updater</p>
        </motion.div>

        {viewMode === 'skills' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧：控制面板 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 space-y-4"
            >
              {/* 技能分类 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    技能分类
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SkillCategory | 'all')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择技能分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有分类</SelectItem>
                      {Object.entries(skillCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* 技能统计 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    技能统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">总技能数</span>
                      <span className="text-lg font-bold">{skills.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">已安装技能</span>
                      <span className="text-lg font-bold">{skills.filter(s => s.installed).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">未安装技能</span>
                      <span className="text-lg font-bold">{skills.filter(s => !s.installed).length}</span>
                    </div>
                    <Separator />
                    <div className="text-sm font-medium mb-2">技能类别分布</div>
                    {Object.entries(skillCategories).map(([key, category]) => {
                      const count = skills.filter(s => s.category === key).length;
                      const percentage = skills.length > 0 ? Math.round((count / skills.length) * 100) : 0;
                      return (
                        <div key={key} className="space-y-1 mb-2">
                          <div className="flex justify-between text-xs">
                            <span>{category.name}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-full rounded-full ${category.color.replace('text-', 'bg-')}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 自动更新设置 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    自动更新设置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">启用自动更新</span>
                        <span className="text-xs text-muted-foreground">定期检查并更新学术技能</span>
                      </div>
                      <Switch
                        checked={autoUpdate}
                        onCheckedChange={setAutoUpdate}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm mb-2 block">更新频率</Label>
                      <Select value={updateInterval} onValueChange={setUpdateInterval}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择更新频率" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">每天</SelectItem>
                          <SelectItem value="weekly">每周</SelectItem>
                          <SelectItem value="monthly">每月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 更新状态 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    更新状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">更新进度</span>
                        <span className="text-sm text-muted-foreground">{updateState.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${updateState.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium">当前状态:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {updateState.message}
                      </p>
                    </div>
                    
                    {updateState.status === 'completed' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>发现技能:</span>
                          <span className="font-medium">{updateState.skillsFound}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>安装技能:</span>
                          <span className="font-medium">{updateState.skillsInstalled}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>更新技能:</span>
                          <span className="font-medium">{updateState.skillsUpdated}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 右侧：技能列表和操作 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <Tabs defaultValue="skills">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="skills">
                    <Book className="w-4 h-4 mr-2" />
                    技能管理
                  </TabsTrigger>
                  <TabsTrigger value="log">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    更新日志
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="skills" className="mt-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <div>
                        <CardTitle className="text-lg">学术技能列表</CardTitle>
                        <CardDescription>
                          管理和更新学术和科研相关技能
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={runSkillUpdate}
                        disabled={updateState.status !== 'idle' && updateState.status !== 'completed'}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        检查更新
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredSkills.map((skill) => (
                          <motion.Card 
                            key={skill.id} 
                            className="border hover:shadow-md transition-all duration-300"
                            whileHover={{ y: -2 }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${skillCategories[skill.category].color} flex items-center justify-center`}>
                                      {skillCategories[skill.category].icon}
                                    </div>
                                    <div>
                                      <h3 
                                        className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
                                        onClick={() => viewSkillFiles(skill)}
                                      >
                                        {skill.name}
                                        <Eye className="w-4 h-4" />
                                      </h3>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <Badge className={`text-xs ${skillCategories[skill.category].color}`}>
                                          {skillCategories[skill.category].name}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          v{skill.version}
                                        </Badge>
                                        {skill.installed && (
                                          <Badge className="text-xs bg-green-100 text-green-600">
                                            已安装
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {skill.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    {skill.installed && skill.lastUpdated && (
                                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        最后更新: {skill.lastUpdated}
                                      </div>
                                    )}
                                    <div className={`w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden`}>
                                      <div 
                                        className={`h-full rounded-full ${skillCategories[skill.category].color.replace('text-', 'bg-')}`}
                                        style={{ width: '75%' }} // 模拟技能使用进度
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                  {skill.installed ? (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateSkill(skill)}
                                      className="transition-all duration-200"
                                    >
                                      <RefreshCw className="w-4 h-4 mr-1" />
                                      更新
                                    </Button>
                                  ) : (
                                    <Button 
                                      size="sm"
                                      onClick={() => installSkill(skill)}
                                      className="transition-all duration-200"
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      安装
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </motion.Card>
                        ))}
                        
                        {filteredSkills.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              未找到技能
                            </p>
                            <p className="text-sm">
                              尝试选择不同的分类或点击"检查更新"按钮
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="log" className="mt-4">
                  <Card className="h-[calc(100vh-180px)] flex flex-col">
                    <CardHeader className="py-4 border-b">
                      <CardTitle className="text-lg">更新日志</CardTitle>
                      <CardDescription>
                        查看技能更新的详细记录
                      </CardDescription>
                    </CardHeader>
                    <div 
                      ref={messagesEndRef} 
                      className="flex-1 overflow-y-auto px-4 py-4"
                    >
                      <div className="space-y-3">
                        {messages.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">
                              暂无更新记录
                            </p>
                            <p className="text-sm">
                              运行技能更新后，这里将显示详细的更新日志
                            </p>
                          </div>
                        )}
                        {messages.map((message) => (
                          <div 
                            key={message.id}
                            className={`p-3 rounded-lg border ${ 
                              message.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : message.type === 'error' 
                                  ? 'bg-red-50 border-red-200 text-red-800' 
                                  : message.type === 'warning' 
                                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                                    : 'bg-blue-50 border-blue-200 text-blue-800'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="shrink-0">
                                {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {message.type === 'error' && <XCircle className="w-5 h-5" />}
                                {message.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                                {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {message.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        ) : (
          // 文件查看模式
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* 左侧：文件列表 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4"
            >
              <Card className="h-[calc(100vh-180px)] flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={returnToSkills}
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        返回
                      </Button>
                      <FileText className="w-5 h-5" />
                      技能文件
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-md">{selectedSkill?.name}</CardTitle>
                  <CardDescription>查看技能的文件结构</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    {skillFiles.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          暂无文件
                        </p>
                        <p className="text-sm">
                          该技能可能还没有相关文件
                        </p>
                      </div>
                    ) : (
                      skillFiles.map((file, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors ${selectedFile?.path === file.path ? 'bg-gray-100' : ''}`}
                          onClick={() => loadFileContent(file)}
                        >
                          {file.isDirectory ? (
                            <Folder className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{file.name}</span>
                          {!file.isDirectory && (
                            <Badge variant="outline" className="text-xs ml-auto">
                              {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 右侧：文件内容 */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-8"
            >
              <Card className="h-[calc(100vh-180px)] flex flex-col">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg">文件内容</CardTitle>
                  {selectedFile && (
                    <CardDescription>{selectedFile.name}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  {!selectedFile ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <FileText className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">未选择文件</p>
                      <p className="text-sm">请从左侧文件列表中选择一个文件查看内容</p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="mb-4">
                        <Badge className="mb-2">{selectedFile.name}</Badge>
                        <p className="text-xs text-muted-foreground">{selectedFile.path}</p>
                      </div>
                      <div className="flex-1 overflow-auto">
                        <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
                          <code>{fileContent}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AcademicSkillsUpdaterAgent;