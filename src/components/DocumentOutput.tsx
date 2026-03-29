import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, FileCode, Download, Copy, Check, Eye,
  ChevronRight, AlertCircle, RefreshCw, Maximize2,
  Minimize2, Code, File, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type OutputFormat = 'markdown' | 'word' | 'latex' | 'pdf';

interface DocumentOutputProps {
  content: string;
  title?: string;
  authors?: string[];
  abstract?: string;
  keywords?: string[];
  references?: string[];
  showPreview?: boolean;
}

const formatConfig: Record<OutputFormat, { 
  label: string; 
  icon: React.ReactNode; 
  extension: string;
  mimeType: string;
  description: string;
}> = {
  markdown: {
    label: 'Markdown',
    icon: <FileCode className="w-4 h-4" />,
    extension: '.md',
    mimeType: 'text/markdown',
    description: '适合在线阅读和版本控制'
  },
  word: {
    label: 'Word',
    icon: <FileText className="w-4 h-4" />,
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: '适合提交和协作编辑'
  },
  latex: {
    label: 'LaTeX',
    icon: <BookOpen className="w-4 h-4" />,
    extension: '.tex',
    mimeType: 'application/x-tex',
    description: '适合学术期刊投稿'
  },
  pdf: {
    label: 'PDF',
    icon: <File className="w-4 h-4" />,
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: '适合正式提交和打印'
  }
};

const DocumentOutput: React.FC<DocumentOutputProps> = ({
  content,
  title = '研究文档',
  authors = [],
  abstract = '',
  keywords = [],
  references = [],
  showPreview = true
}) => {
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('markdown');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const convertToMarkdown = useCallback((text: string): string => {
    return `# ${title}

${authors.length > 0 ? `**作者**: ${authors.join(', ')}\n` : ''}
${keywords.length > 0 ? `**关键词**: ${keywords.join(', ')}\n` : ''}

---

${abstract ? `## 摘要\n\n${abstract}\n\n---\n` : ''}

${text}

${references.length > 0 ? `## 参考文献\n\n${references.map((ref, i) => `[${i + 1}] ${ref}`).join('\n\n')}` : ''}
`;
  }, [title, authors, abstract, keywords, references]);

  const convertToWord = useCallback((text: string): string => {
    const wordXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="36"/>
        </w:rPr>
        <w:t>${title}</w:t>
      </w:r>
    </w:p>
    ${authors.length > 0 ? `
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r><w:t>${authors.join(', ')}</w:t></w:r>
    </w:p>` : ''}
    ${abstract ? `
    <w:p><w:r><w:t>摘要：${abstract}</w:t></w:r></w:p>` : ''}
    <w:p/>
    ${text.split('\n').map(line => `
    <w:p>
      <w:r><w:t>${line.replace(/[#*_`]/g, '')}</w:t></w:r>
    </w:p>`).join('')}
  </w:body>
</w:document>`;
    return wordXml;
  }, [title, authors, abstract]);

  const convertToLaTeX = useCallback((text: string): string => {
    const escapeLatex = (str: string) => {
      return str
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
    };

    const processMarkdownToLatex = (md: string) => {
      return md
        .replace(/^### (.+)$/gm, '\\subsubsection{$1}')
        .replace(/^## (.+)$/gm, '\\subsection{$1}')
        .replace(/^# (.+)$/gm, '\\section{$1}')
        .replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
        .replace(/\*(.+?)\*/g, '\\textit{$1}')
        .replace(/`(.+?)`/g, '\\texttt{$1}')
        .replace(/\n\n/g, '\n\n\\par\n\n');
    };

    return `\\documentclass[12pt,a4paper]{article}

% 基础宏包
\\usepackage[UTF8]{ctex}
\\usepackage[margin=2.5cm]{geometry}
\\usepackage{setspace}
\\usepackage{graphicx}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{booktabs}
\\usepackage{hyperref}
\\usepackage{natbib}

% 页面设置
\\onehalfspacing
\\setlength{\\parindent}{2em}

% 标题信息
\\title{${escapeLatex(title)}}
${authors.length > 0 ? `\\author{${authors.map(a => escapeLatex(a)).join(' \\and ')}}` : ''}
\\date{\\today}

\\begin{document}

\\maketitle

${abstract ? `
\\begin{abstract}
${escapeLatex(abstract)}
\\end{abstract}
` : ''}

${keywords.length > 0 ? `\\noindent\\textbf{关键词：} ${keywords.map(k => escapeLatex(k)).join('; ')}` : ''}

\\newpage

${processMarkdownToLatex(text)}

${references.length > 0 ? `
\\bibliographystyle{plainnat}
\\bibliography{references}
` : ''}

\\end{document}
`;
  }, [title, authors, abstract, keywords, references]);

  const formatContent = useMemo(() => {
    switch (selectedFormat) {
      case 'markdown':
        return convertToMarkdown(content);
      case 'word':
        return convertToWord(content);
      case 'latex':
        return convertToLaTeX(content);
      case 'pdf':
        // PDF 格式需要先生成 LaTeX，然后编译
        return convertToLaTeX(content);
      default:
        return content;
    }
  }, [selectedFormat, content, convertToMarkdown, convertToWord, convertToLaTeX]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formatContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formatContent]);

  const handleDownload = useCallback(() => {
    const config = formatConfig[selectedFormat];
    let blob: Blob;
    
    if (selectedFormat === 'word') {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'SimSun', serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; font-size: 24pt; }
    h2 { font-size: 16pt; margin-top: 20px; }
    h3 { font-size: 14pt; }
    p { text-indent: 2em; margin: 10px 0; }
    .abstract { background: #f5f5f5; padding: 15px; border-radius: 5px; }
    .keywords { color: #666; }
    .reference { margin: 5px 0; text-indent: -2em; padding-left: 2em; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${authors.length > 0 ? `<p style="text-align: center;">${authors.join(', ')}</p>` : ''}
  ${abstract ? `<div class="abstract"><strong>摘要：</strong>${abstract}</div>` : ''}
  ${keywords.length > 0 ? `<p class="keywords"><strong>关键词：</strong>${keywords.join(', ')}</p>` : ''}
  <hr/>
  ${content.split('\n').map(line => {
    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
    if (line.trim()) return `<p>${line}</p>`;
    return '';
  }).join('\n')}
  ${references.length > 0 ? `
    <h2>参考文献</h2>
    ${references.map((ref, i) => `<p class="reference">[${i + 1}] ${ref}</p>`).join('\n')}
  ` : ''}
</body>
</html>`;
      blob = new Blob([htmlContent], { type: 'application/msword' });
    } else if (selectedFormat === 'pdf') {
      // 对于 PDF 格式，我们生成 LaTeX 文件并提供编译说明
      const latexContent = convertToLaTeX(content);
      blob = new Blob([latexContent], { type: 'application/x-tex' });
      
      // 同时创建一个说明文件，告诉用户如何编译 LaTeX 为 PDF
      const instructions = "# PDF 生成说明\n\n1. 下载并安装 LaTeX 发行版（如 TeX Live、MiKTeX 等）\n2. 使用以下命令编译生成的 .tex 文件：\n   ```\n   xelatex filename.tex\n   bibtex filename\n   xelatex filename.tex\n   xelatex filename.tex\n   ```\n3. 编译完成后会生成对应的 .pdf 文件\n\n或者，您可以使用在线 LaTeX 编译器：\n- Overleaf: https://www.overleaf.com\n- ShareLaTeX: https://www.sharelatex.com\n\n将生成的 .tex 文件上传到这些平台，它们会自动编译为 PDF.";
      
      const instructionsBlob = new Blob([instructions], { type: 'text/plain' });
      const instructionsUrl = URL.createObjectURL(instructionsBlob);
      const instructionsLink = document.createElement('a');
      instructionsLink.href = instructionsUrl;
      instructionsLink.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}_PDF_Instructions.txt`;
      document.body.appendChild(instructionsLink);
      instructionsLink.click();
      document.body.removeChild(instructionsLink);
      URL.revokeObjectURL(instructionsUrl);
    } else {
      blob = new Blob([formatContent], { type: config.mimeType });
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}${selectedFormat === 'pdf' ? '.tex' : config.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  }, [selectedFormat, formatContent, title, content, abstract, keywords, authors, references, convertToLaTeX]);

  const renderPreview = () => {
    if (selectedFormat === 'markdown') {
      return (
        <div className="prose prose-sm max-w-none p-4">
          <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 p-4 rounded-lg">
            {formatContent}
          </pre>
        </div>
      );
    }
    
    if (selectedFormat === 'word') {
      return (
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto" style={{ minHeight: '400px' }}>
          <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
          {authors.length > 0 && (
            <p className="text-center text-gray-600 mb-4">{authors.join(', ')}</p>
          )}
          {abstract && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <strong>摘要：</strong>{abstract}
            </div>
          )}
          {keywords.length > 0 && (
            <p className="text-gray-600 mb-4"><strong>关键词：</strong>{keywords.join(', ')}</p>
          )}
          <hr className="my-4" />
          <div className="text-justify leading-relaxed">
            {content.split('\n\n').map((para, i) => (
              <p key={i} className="indent-8 mb-4">{para.replace(/[#*_`]/g, '')}</p>
            ))}
          </div>
        </div>
      );
    }
    
    if (selectedFormat === 'latex') {
      return (
        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{formatContent}</pre>
        </div>
      );
    }
    
    if (selectedFormat === 'pdf') {
      return (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <File className="w-5 h-5" />
            PDF 生成说明
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
            <li>PDF 格式需要通过 LaTeX 编译生成</li>
            <li>下载后会得到 .tex 文件和编译说明</li>
            <li>可以使用 TeX Live、MiKTeX 等本地编译</li>
            <li>也可以使用 Overleaf 等在线平台编译</li>
            <li>编译命令：<code className="bg-blue-100 px-1 rounded">xelatex filename.tex</code></li>
          </ul>
          <div className="mt-4 p-4 bg-white rounded border border-blue-100">
            <h4 className="font-medium text-sm text-blue-700 mb-2">LaTeX 预览</h4>
            <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-40">
              <pre>{formatContent.substring(0, 500)}...{formatContent.length > 500 ? '（内容过长，仅显示部分）' : ''}</pre>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <File className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">文档输出</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as OutputFormat)}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(formatConfig).map(([key, config]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              {config.icon}
              {config.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(formatConfig).map(([key, config]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{config.description}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-500" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      复制
                    </>
                  )}
                </Button>
                <Button size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" />
                  下载 {config.extension}
                </Button>
              </div>
            </div>

            {showPreview && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    预览
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    {renderPreview()}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {downloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">下载成功</AlertTitle>
            <AlertDescription className="text-green-700">
              文件已开始下载，请检查您的下载文件夹。
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  {formatConfig[selectedFormat].label} 格式预览
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-100px)]">
            {renderPreview()}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>格式说明</AlertTitle>
        <AlertDescription className="text-xs">
          <strong>Markdown</strong>: 原始格式，适合版本控制和在线阅读<br/>
          <strong>Word</strong>: 转换为 .doc 格式，可直接用 Word/WPS 打开编辑<br/>
          <strong>LaTeX</strong>: 学术论文格式，需 LaTeX 环境编译生成 PDF<br/>
          <strong>PDF</strong>: 提供 LaTeX 文件和编译说明，可通过 LaTeX 环境或在线平台生成 PDF
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentOutput;
