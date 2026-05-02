import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Globe, Mail, MapPin, 
  User, Phone, Building, Info, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LAB_INFO } from '@/lib';

const SiteConfig: React.FC = () => {
  const [labInfo, setLabInfo] = useState({
    name: LAB_INFO.name,
    nameEn: LAB_INFO.nameEn,
    institution: LAB_INFO.institution,
    location: LAB_INFO.location,
    contactEmail: LAB_INFO.contactEmail,
    principal: LAB_INFO.principal
  });

  const [siteConfig, setSiteConfig] = useState({
    title: '人机协同设计实验室',
    description: '东南大学艺术学院人机协同设计实验室官方网站',
    keywords: '人机协同，设计创新，AI，生成式设计，东南大学',
    favicon: '/favicon.ico',
    logo: '/logo.png'
  });

  const [socialLinks, setSocialLinks] = useState({
    github: '',
    twitter: '',
    wechat: '',
    weibo: '',
    zhihu: ''
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    console.log('保存配置:', { labInfo, siteConfig, socialLinks });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">网站配置</h2>
          <p className="text-muted-foreground">管理实验室基本信息和网站设置</p>
        </div>
        <Button onClick={handleSave} disabled={isSaved}>
          {isSaved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              已保存
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              保存配置
            </>
          )}
        </Button>
      </div>

      {isSaved && (
        <Alert variant="default">
          <AlertDescription>
            配置已成功保存，部分更改可能需要刷新页面后生效
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="lab" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lab">
            <Building className="w-4 h-4 mr-2" />
            实验室信息
          </TabsTrigger>
          <TabsTrigger value="site">
            <Globe className="w-4 h-4 mr-2" />
            网站设置
          </TabsTrigger>
          <TabsTrigger value="social">
            <Mail className="w-4 h-4 mr-2" />
            社交链接
          </TabsTrigger>
        </TabsList>

        {/* 实验室信息 */}
        <TabsContent value="lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
              <CardDescription>实验室的名称、机构和负责人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">实验室名称</Label>
                  <Input
                    id="name"
                    value={labInfo.name}
                    onChange={(e) => setLabInfo({ ...labInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">英文名称</Label>
                  <Input
                    id="nameEn"
                    value={labInfo.nameEn}
                    onChange={(e) => setLabInfo({ ...labInfo, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="institution">所属机构</Label>
                <Input
                  id="institution"
                  value={labInfo.institution}
                  onChange={(e) => setLabInfo({ ...labInfo, institution: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="principal">实验室负责人</Label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="principal"
                    value={labInfo.principal}
                    onChange={(e) => setLabInfo({ ...labInfo, principal: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">地址</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={labInfo.location}
                    onChange={(e) => setLabInfo({ ...labInfo, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">联系邮箱</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={labInfo.contactEmail}
                      onChange={(e) => setLabInfo({ ...labInfo, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">联系电话</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value=""
                      placeholder="（可选）"
                      onChange={(e) => setLabInfo({ ...labInfo, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 网站设置 */}
        <TabsContent value="site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO 设置</CardTitle>
              <CardDescription>网站标题、描述和关键词，用于搜索引擎优化</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">网站标题</Label>
                <Input
                  id="title"
                  value={siteConfig.title}
                  onChange={(e) => setSiteConfig({ ...siteConfig, title: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  显示在浏览器标题栏和搜索引擎结果中
                </p>
              </div>

              <div>
                <Label htmlFor="description">网站描述</Label>
                <Textarea
                  id="description"
                  value={siteConfig.description}
                  onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  用于搜索引擎结果摘要，建议 150-160 个字符
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">关键词</Label>
                <Input
                  id="keywords"
                  value={siteConfig.keywords}
                  onChange={(e) => setSiteConfig({ ...siteConfig, keywords: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  用逗号分隔的关键词，用于 SEO 优化
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>网站图标</CardTitle>
              <CardDescription>配置网站的 Logo 和 Favicon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo 路径</Label>
                <Input
                  id="logo"
                  value={siteConfig.logo}
                  onChange={(e) => setSiteConfig({ ...siteConfig, logo: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  网站顶部显示的 Logo 图片路径
                </p>
              </div>

              <div>
                <Label htmlFor="favicon">Favicon 路径</Label>
                <Input
                  id="favicon"
                  value={siteConfig.favicon}
                  onChange={(e) => setSiteConfig({ ...siteConfig, favicon: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  浏览器标签页显示的小图标，建议尺寸 32x32
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 社交链接 */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>社交媒体链接</CardTitle>
              <CardDescription>添加实验室的社交媒体账号</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  placeholder="https://github.com/your-lab"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/your-lab"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="wechat">微信公众号</Label>
                <Input
                  id="wechat"
                  placeholder="请输入公众号名称"
                  value={socialLinks.wechat}
                  onChange={(e) => setSocialLinks({ ...socialLinks, wechat: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="weibo">微博</Label>
                <Input
                  id="weibo"
                  placeholder="https://weibo.com/your-lab"
                  value={socialLinks.weibo}
                  onChange={(e) => setSocialLinks({ ...socialLinks, weibo: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="zhihu">知乎</Label>
                <Input
                  id="zhihu"
                  placeholder="https://www.zhihu.com/people/your-lab"
                  value={socialLinks.zhihu}
                  onChange={(e) => setSocialLinks({ ...socialLinks, zhihu: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteConfig;
