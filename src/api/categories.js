/**
 * Categories API
 * 封装所有与 categories 和 resources 相关的 Supabase 接口调用
 */
import { supabase } from '@/utils/supabaseClient';

/**
 * 格式化分类数据
 * @param {Array} categories - 从 Supabase 获取的分类数据
 * @returns {Array} 格式化后的分类数据
 */
function normalizeCategories(categories) {
  if (!categories || categories.length === 0) {
    return [];
  }

  return categories.map(cat => {
    // 处理 resources：Supabase 返回的可能是 null、空数组或数组
    let resources = [];
    if (cat.resources !== null && cat.resources !== undefined) {
      if (Array.isArray(cat.resources)) {
        resources = cat.resources
          .filter(res => res && res.id && res.title && res.link) // 过滤掉无效的资源
          .map(res => ({
            id: res.id,
            title: res.title || '',
            link: res.link || '',
            completed: Boolean(res.completed),
          }));
      }
    }

    return {
      id: cat.id,
      label: cat.label,
      description: cat.description || '',
      type: cat.type || 'learning',
      selected: Boolean(cat.selected),
      resources,
    };
  });
}

/**
 * 获取所有分类（包含资源）
 * @returns {Promise<Array>} 分类列表
 */
export async function fetchCategories() {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*, resources(*)')
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return normalizeCategories(data || []);
}

/**
 * 创建分类
 * @param {Object} categoryData - 分类数据
 * @returns {Promise<Object>} 创建的分类
 */
export async function createCategory(categoryData) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.from('categories').insert([categoryData]).select().single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * 更新分类
 * @param {string} categoryId - 分类 ID
 * @param {Object} categoryData - 分类数据
 * @returns {Promise<void>}
 */
export async function updateCategory(categoryId, categoryData) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('categories').update(categoryData).eq('id', categoryId);

  if (error) {
    throw error;
  }
}

/**
 * 删除分类
 * @param {string} categoryId - 分类 ID
 * @returns {Promise<void>}
 */
export async function deleteCategory(categoryId) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('categories').delete().eq('id', categoryId);

  if (error) {
    // 检查是否是 "not found" 错误
    if (error.code === 'PGRST116' || error.message?.includes('not found')) {
      // 分类不存在，不抛出错误
      return;
    }
    throw error;
  }
}

/**
 * 批量删除分类的资源
 * @param {string} categoryId - 分类 ID
 * @returns {Promise<void>}
 */
export async function deleteCategoryResources(categoryId) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.from('resources').delete().eq('category_id', categoryId);

  if (error) {
    console.warn('Failed to delete category resources:', error);
    // 不抛出错误，允许继续执行
  }
}

/**
 * 批量创建资源
 * @param {Array} resources - 资源列表
 * @returns {Promise<void>}
 */
export async function createResources(resources) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  if (!resources || resources.length === 0) {
    return;
  }

  const resourceData = resources
    .filter(res => res.title && res.link)
    .map(res => ({
      category_id: res.category_id,
      title: res.title,
      link: res.link,
      completed: Boolean(res.completed),
    }));

  if (resourceData.length === 0) {
    return;
  }

  const { error } = await supabase.from('resources').insert(resourceData);

  if (error) {
    throw error;
  }
}

/**
 * 更新分类的选中状态
 * @param {string} type - 分类类型 ('project' | 'learning')
 * @param {string} categoryId - 分类 ID
 * @returns {Promise<void>}
 */
export async function updateCategorySelection(type, categoryId) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  // 先取消同类型其他分类的选中状态
  const { error: unselectError } = await supabase.from('categories').update({ selected: false }).eq('type', type);

  if (unselectError) {
    throw unselectError;
  }

  // 设置当前分类为选中
  if (categoryId) {
    const { error: selectError } = await supabase.from('categories').update({ selected: true }).eq('id', categoryId);

    if (selectError) {
      throw selectError;
    }
  }
}

/**
 * 保存分类（包括资源）
 * @param {Object} category - 分类数据
 * @returns {Promise<Object>} 保存后的分类
 */
export async function saveCategoryWithResources(category) {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    throw new Error('Supabase is not configured');
  }

  const { id, resources, ...categoryData } = category;
  const isNew = !id || id.toString().startsWith('custom-');
  let categoryId = id;

  // 创建或更新分类
  if (isNew) {
    const newCategory = await createCategory(categoryData);
    categoryId = newCategory.id;
  } else {
    await updateCategory(id, categoryData);
  }

  // 处理资源
  if (categoryId) {
    // 先删除旧的资源
    await deleteCategoryResources(categoryId);

    // 插入新的资源
    if (resources && resources.length > 0) {
      const resourceData = resources.map(res => ({
        ...res,
        category_id: categoryId,
      }));
      await createResources(resourceData);
    }
  }

  // 返回更新后的分类
  return {
    ...category,
    id: categoryId,
    resources: resources || [],
  };
}
