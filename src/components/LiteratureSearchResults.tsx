import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Database, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SemanticScholarPaper, ArxivPaper } from '@/config/api';

interface LiteratureSearchResultsProps {
  papers: (SemanticScholarPaper | ArxivPaper)[];
  title?: string;
  description?: string;
}

const LiteratureSearchResults: React.FC<LiteratureSearchResultsProps> = ({ 
  papers, 
  title = '文献检索结果',
  description = '检索到的相关学术文献' 
}) => {
  if (papers.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">未检索到相关文献，请尝试调整搜索关键词。</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          {title} ({papers.length} 篇)
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {papers.map((paper, index) => {
              const isSemanticScholar = 'paperId' in paper;
              const isArxiv = 'id' in paper;
              
              return (
                <div key={isSemanticScholar ? paper.paperId : paper.id} className="p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={`text-xs ${isArxiv ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {isArxiv ? 'arXiv' : 'Semantic Scholar'}
                        </Badge>
                        <a
                          href={isSemanticScholar ? paper.url : paper.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm hover:text-blue-600 flex items-center gap-1"
                        >
                          {paper.title}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {isSemanticScholar 
                          ? paper.authors?.map(a => a.name).slice(0, 3).join(', ') 
                          : paper.authors.slice(0, 3).join(', ')}
                        {isSemanticScholar && paper.year ? ` · ${paper.year}` : ''}
                        {isSemanticScholar && paper.citationCount ? ` · 引用: ${paper.citationCount}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {isSemanticScholar 
                          ? paper.abstract || paper.tldr?.text || '暂无摘要' 
                          : paper.summary || '暂无摘要'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiteratureSearchResults;