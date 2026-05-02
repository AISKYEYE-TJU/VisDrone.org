import { motion } from "framer-motion";
import { Mail, Globe, Github, ExternalLink, BookOpen, FileText, Award, Calendar, User, ArrowRight, Phone } from "lucide-react";
import { TeamMember, ResearchProject, Publication, cn } from "@/lib/index";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

/**
 * 团队成员卡片组件
 */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
        <CardHeader className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            <Avatar className="w-32 h-32 border-2 border-background shadow-inner">
              <AvatarImage src={member.image} alt={member.name} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground">
                <User className="w-12 h-12" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{member.name}</h3>
            <p className="text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">
              {member.title}
            </p>
            <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent-foreground border-accent/20">
              {member.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {member.bio}
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {member.researchInterests.map((interest) => (
              <span 
                key={interest} 
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {interest}
              </span>
            ))}
          </div>
          <div className="pt-4 flex justify-center gap-3">
            {member.email && (
              <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            )}
            {member.website && (
              <a href={member.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
          {/* 虚拟学生智能体链接 */}
          {(member.id.startsWith('phd-ai-') || member.id.startsWith('master-ai-')) && (
            <div className="pt-4">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link to={`/virtual-students/${member.id}`}>
                  与智能体对话
                </Link>
              </Button>
            </div>
          )}
          
          {/* 赵天娇个人页面链接 */}
          {member.id === 'zhao-tianjiao' && (
            <div className="pt-4">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link to="/zhaotianjiao">
                  个人主页
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * 研究项目卡片组件
 */
export function ResearchCard({ project }: { project: ResearchProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-border bg-card overflow-hidden group">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={cn(
              "shadow-sm",
              project.status === '进行中' ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
            )}>
              {project.status}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {project.year}
          </div>
          <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.titleEn && (
            <p className="text-sm text-muted-foreground font-sans italic">{project.titleEn}</p>
          )}
        </CardHeader>
        <CardContent className="p-6 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        {project.link && (
          <div className="p-6 pt-0 mt-auto">
            <Button variant="link" className="p-0 h-auto text-primary group-hover:translate-x-1 transition-transform">
              查看详情 <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

/**
 * 出版物卡片组件
 */
export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "border-l-4 transition-all duration-200 hover:shadow-md",
        publication.isSelected ? "border-l-primary bg-primary/5 shadow-sm" : "border-l-transparent hover:border-l-muted-foreground/30"
      )}>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px] uppercase font-mono">
                  {publication.type}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">{publication.year}</span>
                {publication.isSelected && (
                  <Badge variant="secondary" className="text-[10px] bg-accent/20 text-accent-foreground border-accent/10">
                    精选成果
                  </Badge>
                )}
              </div>
              <h4 className="text-base font-semibold text-foreground leading-snug">
                {publication.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {publication.authors.map((author, idx) => (
                  <span key={author}>
                    <span className={`${author.includes('赵天娇') || (author.includes('Zhao') && !author.includes('Zhao, X.')) ? 'font-bold text-foreground' : ''}`}>
                      {author}
                    </span>
                    {idx < publication.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="text-sm italic text-muted-foreground/80">
                {publication.venue}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {publication.link && (
                <Button variant="ghost" size="icon" asChild className="rounded-full h-9 w-9">
                  <a href={publication.link} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {publication.doi && (
                <Button variant="ghost" size="icon" asChild className="rounded-full h-9 w-9">
                  <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noreferrer">
                    <FileText className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
