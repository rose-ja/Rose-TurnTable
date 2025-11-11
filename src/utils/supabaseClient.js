import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file');
  console.error('Required variables:');
  console.error('  - VUE_APP_SUPABASE_URL');
  console.error('  - VUE_APP_SUPABASE_ANON_KEY');
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // 我们不需要认证会话
  },
});

// 测试连接
if (supabaseUrl && supabaseKey) {
  console.log('✅ Supabase client initialized');
  console.log('🔗 URL:', supabaseUrl);
} else {
  console.warn('⚠️ Supabase client not initialized - using localStorage fallback');
}

export default supabase;
