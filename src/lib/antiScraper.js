/**
 * 反爬虫设计工具
 * 提供请求频率限制、异常行为检测等功能
 */

class AntiScraper {
  constructor() {
    this.requestTimes = new Map();
    this.maxRequestsPerMinute = 60; // 每分钟最大请求数
    this.maxRequestsPerHour = 500;   // 每小时最大请求数
    this.blockDuration = 5 * 60 * 1000; // 封禁5分钟
    this.blockedIPs = new Map();
    
    // 用户行为跟踪
    this.copyPasteCount = 0;
    this.mouseMovements = [];
    this.lastRequestTime = 0;
    
    // 初始化
    this.initBehaviorDetection();
  }

  // 初始化行为检测
  initBehaviorDetection() {
    // 检测复制粘贴（异常行为）
    document.addEventListener('copy', () => {
      this.copyPasteCount++;
      if (this.copyPasteCount > 10) {
        this.triggerAlert('多次复制内容');
      }
    });

    // 检测鼠标移动（区分人类和爬虫）
    document.addEventListener('mousemove', (e) => {
      this.mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      });
      
      // 只保留最近100条记录
      if (this.mouseMovements.length > 100) {
        this.mouseMovements.shift();
      }
    });

    // 检测键盘输入速度
    let keyPressTimes = [];
    document.addEventListener('keypress', () => {
      const now = Date.now();
      keyPressTimes.push(now);
      
      // 只保留最近10次按键
      if (keyPressTimes.length > 10) {
        keyPressTimes.shift();
      }
      
      // 如果按键间隔太短（可能是机器）
      if (keyPressTimes.length >= 2) {
        const avgInterval = (keyPressTimes[keyPressTimes.length - 1] - keyPressTimes[0]) / keyPressTimes.length;
        if (avgInterval < 10) { // 小于10ms
          this.triggerAlert('异常输入速度');
        }
      }
    });
  }

  // 检查请求频率
  checkRequestFrequency(identifier = 'default') {
    const now = Date.now();
    
    // 检查是否被封禁
    if (this.isBlocked(identifier)) {
      return { allowed: false, reason: '请求过于频繁，请稍后再试' };
    }
    
    // 获取请求历史
    if (!this.requestTimes.has(identifier)) {
      this.requestTimes.set(identifier, {
        minute: [],
        hour: [],
        total: 0
      });
    }
    
    const history = this.requestTimes.get(identifier);
    
    // 清理过期记录
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;
    
    history.minute = history.minute.filter(time => time > oneMinuteAgo);
    history.hour = history.hour.filter(time => time > oneHourAgo);
    
    // 检查频率限制
    if (history.minute.length >= this.maxRequestsPerMinute) {
      this.blockIP(identifier);
      return { allowed: false, reason: '请求过于频繁，已临时封禁' };
    }
    
    if (history.hour.length >= this.maxRequestsPerHour) {
      this.blockIP(identifier);
      return { allowed: false, reason: '请求过于频繁，已临时封禁' };
    }
    
    // 记录请求时间
    history.minute.push(now);
    history.hour.push(now);
    history.total++;
    this.lastRequestTime = now;
    
    return { allowed: true };
  }

  // 检查是否被封禁
  isBlocked(identifier) {
    if (!this.blockedIPs.has(identifier)) {
      return false;
    }
    
    const blockInfo = this.blockedIPs.get(identifier);
    if (Date.now() > blockInfo.unblockTime) {
      this.blockedIPs.delete(identifier);
      return false;
    }
    
    return true;
  }

  // 封禁IP
  blockIP(identifier) {
    this.blockedIPs.set(identifier, {
      reason: '请求频率超限',
      unblockTime: Date.now() + this.blockDuration
    });
  }

  // 触发警报
  triggerAlert(reason) {
    console.warn(`[反爬虫警告] ${reason} - 时间: ${new Date().toISOString()}`);
    // 可以在这里添加更多处理逻辑，如发送通知等
  }

  // 检测人类行为
  isHuman() {
    // 检查鼠标移动模式
    if (this.mouseMovements.length > 10) {
      const recent = this.mouseMovements.slice(-10);
      let totalDistance = 0;
      
      for (let i = 1; i < recent.length; i++) {
        const dx = recent[i].x - recent[i-1].x;
        const dy = recent[i].y - recent[i-1].y;
        totalDistance += Math.sqrt(dx*dx + dy*dy);
      }
      
      // 如果鼠标移动距离太少，可能是爬虫
      if (totalDistance < 50) {
        return false;
      }
    }
    
    return true;
  }

  // 获取客户端信息
  getClientInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // 重置计数器
  reset() {
    this.requestTimes.clear();
    this.blockedIPs.clear();
    this.copyPasteCount = 0;
    this.mouseMovements = [];
  }
}

// 创建全局实例
const antiScraper = new AntiScraper();

// 导出
export default antiScraper;

// React Hook
export const useAntiScraper = () => {
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [blockReason, setBlockReason] = React.useState('');

  const checkRequest = React.useCallback((identifier) => {
    const result = antiScraper.checkRequestFrequency(identifier);
    if (!result.allowed) {
      setIsBlocked(true);
      setBlockReason(result.reason);
      return false;
    }
    return true;
  }, []);

  React.useEffect(() => {
    // 定期检查封禁状态
    const interval = setInterval(() => {
      const result = antiScraper.checkRequestFrequency();
      if (result.allowed && isBlocked) {
        setIsBlocked(false);
        setBlockReason('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked]);

  return { checkRequest, isBlocked, blockReason, clientInfo: antiScraper.getClientInfo() };
};
