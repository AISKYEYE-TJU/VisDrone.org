import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { uploadImage, uploadTeamImage, uploadNewsImage, uploadDatasetImage, uploadModelImage, isImageUrl } from '@/services/imageUploadService';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: 'team' | 'news' | 'dataset' | 'model' | 'general';
  id?: string;
  aspectRatio?: 'square' | 'video' | 'any';
}

export function ImageUpload({
  value,
  onChange,
  label = '图片',
  bucket = 'general',
  id,
  aspectRatio = 'any',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragOver, setDragOver] = useState(false);

  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10MB');
      return;
    }

    setUploading(true);
    try {
      let result;
      if (bucket === 'team' && id) {
        result = await uploadTeamImage(file, id);
      } else if (bucket === 'news' && id) {
        result = await uploadNewsImage(file, id);
      } else if (bucket === 'dataset' && id) {
        result = await uploadDatasetImage(file, id);
      } else if (bucket === 'model' && id) {
        result = await uploadModelImage(file, id);
      } else {
        result = await uploadImage(file);
      }

      if (result.success && result.url) {
        setPreview(result.url);
        onChange(result.url);
        toast.success('上传成功');
      } else {
        toast.error(result.error || '上传失败');
      }
    } catch (err) {
      toast.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    any: 'aspect-auto',
  }[aspectRatio];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className={`${aspectRatioClass} w-full object-cover rounded-lg`}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => {
                setPreview(null);
                onChange('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-500 mb-2">
              {uploading ? '上传中...' : '拖拽图片到此处，或点击上传'}
            </p>
            <p className="text-xs text-slate-400">支持 JPG, PNG, GIF, WebP，最大 10MB</p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleChange}
              disabled={uploading}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={uploading}
            >
              选择文件
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ImageGalleryProps {
  value?: string;
  images: string[];
  onChange: (url: string) => void;
  label?: string;
}

export function ImageGallery({ value, images, onChange, label }: ImageGalleryProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPreviewUrl(img);
              onChange(img);
            }}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              value === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
            }`}
          >
            <img
              src={img}
              alt={`Option ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>图片预览</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ImageUrlInput({
  value,
  onChange,
  label = '图片 URL',
  placeholder = '输入图片 URL 或上传图片',
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showUpload, setShowUpload] = useState(false);

  const handleUrlSubmit = () => {
    onChange(inputValue);
  };

  const handleUploadComplete = (url: string) => {
    setInputValue(url);
    onChange(url);
    setShowUpload(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="w-20">{label}</Label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button variant="outline" onClick={handleUrlSubmit}>
          使用URL
        </Button>
        <Button variant="outline" onClick={() => setShowUpload(true)}>
          上传
        </Button>
      </div>

      {inputValue && isImageUrl(inputValue) && (
        <div className="ml-20">
          <img
            src={inputValue}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传图片</DialogTitle>
          </DialogHeader>
          <ImageUpload onChange={handleUploadComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
