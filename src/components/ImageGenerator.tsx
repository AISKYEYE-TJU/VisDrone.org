import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Copy, Sparkles } from 'lucide-react';
import { API_CONFIG } from '@/config/api';

interface ImageGenerationOptions {
  prompt: string;
  size: 'square' | 'portrait' | 'landscape';
  style: 'photorealistic' | 'artistic' | 'scientific' | 'abstract';
}

export const generateImage = async (options: ImageGenerationOptions): Promise<string> => {
  const { prompt, size, style } = options;
  
  const sizeMap = {
    square: '1024x1024',
    portrait: '1024x1536',
    landscape: '1536x1024'
  };

  const styleMap = {
    photorealistic: 'photorealistic, high detail, professional',
    artistic: 'artistic, creative, stylized',
    scientific: 'scientific, technical, accurate',
    abstract: 'abstract, conceptual, artistic'
  };

  const enhancedPrompt = `${prompt}, ${styleMap[style]}, professional quality, high resolution`;
  
  try {
    // 使用 AutoDL API 生成图片
    const response = await fetch(`${API_CONFIG.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        prompt: enhancedPrompt,
        n: 1,
        size: sizeMap[size]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Image generation error:', error);
    // 降级方案：使用 text-to-image API
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(enhancedPrompt)}&image_size=${size}`;
  }
};

interface ImageGeneratorProps {
  onImageGenerated?: (url: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'square' | 'portrait' | 'landscape'>('square');
  const [style, setStyle] = useState<'photorealistic' | 'artistic' | 'scientific' | 'abstract'>('photorealistic');
  const [imageUrl, setImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const url = await generateImage({ prompt, size, style });
      setImageUrl(url);
      if (onImageGenerated) {
        onImageGenerated(url);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, size, style, onImageGenerated]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(imageUrl);
  }, [imageUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI 图片生成
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">图片描述</Label>
          <Input
            id="prompt"
            placeholder="描述你想要的图片，例如：科技感的科研实验室"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>尺寸</Label>
            <div className="flex gap-2">
              <Button
                variant={size === 'square' ? 'default' : 'outline'}
                onClick={() => setSize('square')}
              >
                方形
              </Button>
              <Button
                variant={size === 'portrait' ? 'default' : 'outline'}
                onClick={() => setSize('portrait')}
              >
                竖版
              </Button>
              <Button
                variant={size === 'landscape' ? 'default' : 'outline'}
                onClick={() => setSize('landscape')}
              >
                横版
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>风格</Label>
            <div className="flex gap-2">
              <Button
                variant={style === 'photorealistic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyle('photorealistic')}
              >
                写实
              </Button>
              <Button
                variant={style === 'artistic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyle('artistic')}
              >
                艺术
              </Button>
              <Button
                variant={style === 'scientific' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyle('scientific')}
              >
                科技
              </Button>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成图片
            </>
          )}
        </Button>
        
        {imageUrl && (
          <div className="space-y-2">
            <div className="border rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Generated image"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4 mr-1" />
                复制链接
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(imageUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-1" />
                下载
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGenerator;
