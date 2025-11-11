/**
 * 数据迁移工具
 * 将 localStorage 中的数据迁移到 Supabase
 *
 * 使用方法：
 * 1. 在浏览器控制台运行此脚本
 * 2. 或创建一个迁移按钮调用此函数
 */

import { supabase } from './supabaseClient';
import { loadState } from './localStoragePlugin';

/**
 * 迁移 localStorage 数据到 Supabase
 */
export async function migrateLocalStorageToSupabase() {
  if (!process.env.VUE_APP_SUPABASE_URL) {
    console.error('❌ Supabase 未配置，无法迁移数据');
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // 1. 从 localStorage 加载数据
    const localData = loadState();
    if (!localData || !localData.categories || localData.categories.length === 0) {
      console.warn('⚠️ 没有找到 localStorage 数据');
      return { success: false, error: 'No local data found' };
    }

    console.log('📦 开始迁移数据...');
    console.log(`找到 ${localData.categories.length} 个分类`);

    // 2. 检查 Supabase 是否已有数据
    const { data: existingCategories, error: checkError } = await supabase.from('categories').select('id').limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingCategories && existingCategories.length > 0) {
      const confirm = window.confirm('Supabase 中已有数据，迁移可能会创建重复记录。\n\n是否继续？');
      if (!confirm) {
        return { success: false, error: 'Migration cancelled' };
      }
    }

    // 3. 迁移分类和资源
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const category of localData.categories) {
      try {
        // 插入分类
        const { data: newCategory, error: categoryError } = await supabase
          .from('categories')
          .insert([
            {
              label: category.label,
              description: category.description || '',
              type: category.type || 'learning',
              selected: Boolean(category.selected),
            },
          ])
          .select()
          .single();

        if (categoryError) {
          throw categoryError;
        }

        // 插入资源
        if (category.resources && category.resources.length > 0) {
          const resources = category.resources
            .filter(res => res.title && res.link)
            .map(res => ({
              category_id: newCategory.id,
              title: res.title,
              link: res.link,
              completed: Boolean(res.completed),
            }));

          if (resources.length > 0) {
            const { error: resourcesError } = await supabase.from('resources').insert(resources);

            if (resourcesError) {
              throw resourcesError;
            }
          }
        }

        successCount++;
        console.log(`✅ 已迁移: ${category.label}`);
      } catch (error) {
        errorCount++;
        errors.push({ category: category.label, error: error.message });
        console.error(`❌ 迁移失败: ${category.label}`, error);
      }
    }

    // 4. 更新选中状态
    if (localData.currentCategoryIds) {
      // const { project, learning } = localData.currentCategoryIds;

      // 这里需要根据原始 ID 找到新的 UUID
      // 由于 ID 可能不同，这个功能需要手动处理
      console.log('ℹ️ 选中状态需要手动更新');
    }

    console.log(`\n📊 迁移完成:`);
    console.log(`  ✅ 成功: ${successCount}`);
    console.log(`  ❌ 失败: ${errorCount}`);

    if (errors.length > 0) {
      console.error('错误详情:', errors);
    }

    return {
      success: errorCount === 0,
      successCount,
      errorCount,
      errors,
    };
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 导出数据为 JSON（用于备份）
 */
export function exportLocalStorageData() {
  const data = loadState();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `turntable-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('✅ 数据已导出');
}

/**
 * 清除 localStorage 数据
 */
export function clearLocalStorageData() {
  const confirm = window.confirm('确定要清除 localStorage 数据吗？\n\n此操作不可恢复！');
  if (confirm) {
    localStorage.removeItem('learning-turntable');
    console.log('✅ localStorage 数据已清除');
    window.location.reload();
  }
}

// 在开发环境中，将函数挂载到 window 对象，方便在控制台调用
if (process.env.NODE_ENV === 'development') {
  window.migrateToSupabase = migrateLocalStorageToSupabase;
  window.exportLocalStorageData = exportLocalStorageData;
  window.clearLocalStorageData = clearLocalStorageData;
}
