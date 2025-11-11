-- ============================================
-- Supabase 数据库表结构
-- 转盘工具项目
-- ============================================

-- 删除已存在的表（谨慎使用，仅用于重置）
-- DROP TABLE IF EXISTS public.resources CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;

-- ============================================
-- 1. 创建 categories 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'learning',
  selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. 创建 resources 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. 创建索引以提升查询性能
-- ============================================
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);
CREATE INDEX IF NOT EXISTS idx_categories_selected ON public.categories(selected);
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources(category_id);
CREATE INDEX IF NOT EXISTS idx_resources_completed ON public.resources(completed);

-- ============================================
-- 4. 创建更新时间触发器函数
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. 为表添加更新触发器
-- ============================================
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. 启用 Row Level Security (RLS)
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. 创建 RLS 策略 - categories 表
-- ============================================

-- 允许所有人读取
CREATE POLICY "Allow public read access on categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- 允许所有人插入
CREATE POLICY "Allow public insert access on categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新
CREATE POLICY "Allow public update access on categories"
  ON public.categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 允许所有人删除
CREATE POLICY "Allow public delete access on categories"
  ON public.categories
  FOR DELETE
  USING (true);

-- ============================================
-- 8. 创建 RLS 策略 - resources 表
-- ============================================

-- 允许所有人读取
CREATE POLICY "Allow public read access on resources"
  ON public.resources
  FOR SELECT
  USING (true);

-- 允许所有人插入
CREATE POLICY "Allow public insert access on resources"
  ON public.resources
  FOR INSERT
  WITH CHECK (true);

-- 允许所有人更新
CREATE POLICY "Allow public update access on resources"
  ON public.resources
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 允许所有人删除
CREATE POLICY "Allow public delete access on resources"
  ON public.resources
  FOR DELETE
  USING (true);

-- ============================================

