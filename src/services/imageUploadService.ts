import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

const BUCKET_NAME = 'visdrone-images';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  progress: number;
}

export async function uploadImage(
  file: File,
  path?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = path || `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const fullPath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fullPath);

    return { success: true, url: urlData.publicUrl };
  } catch (err) {
    console.error('Upload exception:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}

export async function deleteImage(url: string): Promise<UploadResult> {
  try {
    const path = url.split(`${BUCKET_NAME}/`)[1];
    if (!path) {
      return { success: false, error: 'Invalid URL' };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([`images/${path}`]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
  }
}

export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(`images/${path}`);
  return data.publicUrl;
}

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes(BUCKET_NAME);
}

export async function uploadTeamImage(
  file: File,
  memberId: string
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `team/${memberId}.${ext}`;
  return uploadImage(file, fileName);
}

export async function uploadNewsImage(
  file: File,
  newsId: string
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `news/${newsId}-${Date.now()}.${ext}`;
  return uploadImage(file, fileName);
}

export async function uploadDatasetImage(
  file: File,
  datasetId: string
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `datasets/${datasetId}-${Date.now()}.${ext}`;
  return uploadImage(file, fileName);
}

export async function uploadModelImage(
  file: File,
  modelId: string
): Promise<UploadResult> {
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `models/${modelId}-${Date.now()}.${ext}`;
  return uploadImage(file, fileName);
}
