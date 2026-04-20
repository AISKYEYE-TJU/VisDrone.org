// Supabase Edge Function for checking image generation task status

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    const { taskId } = await req.json();
    
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    console.log('Checking task status:', taskId);

    // Query task status from Wanxiang API
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WANXIANG_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Wanxiang API error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Task status response:', data);

    const taskStatus = data.output?.task_status;
    
    if (taskStatus === 'SUCCEEDED') {
      const imageUrl = data.output?.results?.[0]?.url;
      return new Response(
        JSON.stringify({
          status: 'SUCCEEDED',
          imageUrl: imageUrl,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else if (taskStatus === 'FAILED') {
      return new Response(
        JSON.stringify({
          status: 'FAILED',
          error: data.output?.message || 'Task failed',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else {
      // PENDING or RUNNING
      return new Response(
        JSON.stringify({
          status: taskStatus,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        status: 'ERROR',
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
