// Supabase Edge Function for generating images using Tongyi Wanxiang
// This bypasses CORS restrictions by calling the API from the server side

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const WANXIANG_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const WANXIANG_API_KEY = Deno.env.get('WANXIANG_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { prompt, category, title } = await req.json();
    
    // Build prompt
    let finalPrompt = prompt;
    if (!finalPrompt && category) {
      const prompts: Record<string, string> = {
        '学术交流': '学术会议场景，研究人员在交流讨论，现代化的会议室，专业的学术氛围，蓝色和青色配色方案，高质量',
        '学术活动': '学术研讨会场景，演讲者在台上演讲，听众认真听讲，现代化的讲堂，蓝色和青色配色方案，高质量',
        '平台建设': '技术平台场景，云计算基础设施，数据中心，服务器机房，未来科技感，蓝色和青色配色方案，高质量',
        '科研项目': '科学研究实验室，科学家在做实验，现代化的实验设备，创新的科研环境，蓝色和青色配色方案，高质量',
        '学术成果': '学术成果展示，颁奖典礼，研究人员庆祝成功，学术出版物，蓝色和青色配色方案，高质量',
        '竞赛获奖': '竞赛颁奖典礼，奖杯奖牌，胜利庆祝，舞台灯光，成功的喜悦，蓝色和青色配色方案，高质量',
      };
      finalPrompt = prompts[category] || '学术科研场景，现代化，专业，蓝色和青色配色方案，高质量';
    }
    if (title && !finalPrompt?.includes(title)) {
      finalPrompt = `${title}，${finalPrompt}`;
    }

    console.log('Generating image with prompt:', finalPrompt);

    // Call Wanxiang API
    const response = await fetch(WANXIANG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WANXIANG_API_KEY}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx2.1-t2i-turbo',
        input: {
          prompt: finalPrompt,
        },
        parameters: {
          size: '1024*1024',
          n: 1,
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Wanxiang API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Wanxiang API response:', data);

    // Return task ID for async polling
    return new Response(
      JSON.stringify({
        success: true,
        taskId: data.output?.task_id,
        prompt: finalPrompt,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
