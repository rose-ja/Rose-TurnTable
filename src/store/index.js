/**
 * Vuex Store
 * 管理应用的状态，包括分类数据、选中状态等
 */
import Vue from 'vue';
import Vuex from 'vuex';
import * as categoriesAPI from '@/api/categories';
import { loadState, localStoragePlugin } from '@/utils/localStoragePlugin';
import { mockCategories } from '@/mock/resources';

Vue.use(Vuex);

// 默认分类类型
const DEFAULT_TYPE = 'learning';

/**
 * 规范化分类数据
 * 确保每个分类都有 type 和 selected 属性
 * @param {Array} collections - 分类数组
 * @returns {Array} 规范化后的分类数组
 */
const normalizeCategories = (collections = []) =>
  (collections || []).map(item => ({
    ...item,
    type: item.type || DEFAULT_TYPE,
    selected: Boolean(item.selected),
  }));

// 从 localStorage 加载持久化状态
const persistedState = loadState();
// 兼容老版本仅存储数组的结构
const normalizedState = Array.isArray(persistedState)
  ? {
      categories: persistedState,
      currentCategoryIds: { project: null, learning: null },
    }
  : persistedState || {};

/**
 * 初始状态
 * 优先从本地缓存中恢复，确保刷新后仍能保留学习进度
 */
const state = {
  categories: normalizeCategories(normalizedState.categories), // 所有分类列表
  currentCategoryIds: {
    project: normalizedState.currentCategoryIds?.project || null, // 当前选中的项目类分类 ID
    learning: normalizedState.currentCategoryIds?.learning || null, // 当前选中的学习类分类 ID
  },
};

/**
 * Getters
 * 提供计算属性，方便组件访问状态
 */
const getters = {
  // 获取所有分类列表
  categoryList: rootState => rootState.categories,
  // 获取项目类分类列表
  projectCategories: rootState => rootState.categories.filter(item => item.type === 'project'),
  // 获取学习类分类列表
  learningCategories: rootState => rootState.categories.filter(item => item.type !== 'project'),
  // 获取当前选中的分类 ID
  currentCategoryIds: rootState => rootState.currentCategoryIds,
  // 根据类型获取当前选中的分类
  currentCategoryByType: rootState => type =>
    rootState.categories.find(item => item.id === rootState.currentCategoryIds?.[type]) || null,
};

/**
 * Mutations
 * 同步修改状态的方法
 */
const mutations = {
  /**
   * 设置分类列表
   * @param {Object} rootState - 根状态
   * @param {Array} payload - 分类数组
   */
  setCategories(rootState, payload) {
    rootState.categories = normalizeCategories(payload);
  },
  /**
   * 添加新分类
   * @param {Object} rootState - 根状态
   * @param {Object} payload - 分类数据
   */
  addCategory(rootState, payload) {
    rootState.categories.push({
      ...payload,
      type: payload.type || DEFAULT_TYPE,
      selected: Boolean(payload.selected),
    });
  },
  /**
   * 删除分类
   * 支持通过临时 ID 或 UUID 删除
   * 如果删除的是当前选中的分类，清除选中状态
   * @param {Object} rootState - 根状态
   * @param {string} categoryId - 分类 ID
   */
  removeCategory(rootState, categoryId) {
    const removed = rootState.categories.find(item => item.id === categoryId);
    if (removed) {
      const type = removed.type || DEFAULT_TYPE;
      // 删除分类
      rootState.categories = rootState.categories.filter(item => item.id !== categoryId);
      // 如果删除的是当前选中的分类，清除选中状态
      if (rootState.currentCategoryIds[type] === categoryId) {
        rootState.currentCategoryIds = {
          ...rootState.currentCategoryIds,
          [type]: null,
        };
      }
    }
  },
  /**
   * 更新分类信息
   * 支持通过旧 ID（临时 ID）查找并更新为新 ID（UUID）
   * 用于处理新增分类后 ID 从临时 ID 变为 UUID 的情况
   * @param {Object} rootState - 根状态
   * @param {Object} payload - 分类数据，可能包含 _oldId 字段
   */
  updateCategory(rootState, payload) {
    // 支持通过旧 ID（临时 ID）查找并更新为新 ID（UUID）
    const oldId = payload._oldId || payload.id;
    const index = rootState.categories.findIndex(item => item.id === oldId || item.id === payload.id);

    if (index !== -1) {
      // 如果 ID 发生了变化（从临时 ID 变为 UUID），需要更新
      // 排除内部字段 _oldId
      const { _oldId: _unused, ...categoryData } = payload; // eslint-disable-line no-unused-vars
      Vue.set(rootState.categories, index, {
        ...categoryData,
        type: categoryData.type || rootState.categories[index].type || DEFAULT_TYPE,
        selected: Boolean(categoryData.selected),
      });

      // 如果 ID 变化了，需要更新 currentCategoryIds
      if (oldId !== categoryData.id && rootState.currentCategoryIds) {
        const updatedCategory = rootState.categories[index];
        const type = updatedCategory.type || DEFAULT_TYPE;
        if (rootState.currentCategoryIds[type] === oldId) {
          rootState.currentCategoryIds = {
            ...rootState.currentCategoryIds,
            [type]: categoryData.id,
          };
        }
      }
    } else {
      // 如果找不到，可能是新增的分类，直接添加
      // 排除内部字段 _oldId
      const { _oldId: _unused, ...categoryData } = payload; // eslint-disable-line no-unused-vars
      rootState.categories.push({
        ...categoryData,
        type: categoryData.type || DEFAULT_TYPE,
        selected: Boolean(categoryData.selected),
      });
    }
  },
  /**
   * 标记分类为选中状态
   * 同一类型只能有一个分类被选中
   * @param {Object} rootState - 根状态
   * @param {Object} payload - { type: 'project' | 'learning', categoryId: string }
   */
  markSelected(rootState, { type, categoryId }) {
    const targetType = type || DEFAULT_TYPE;
    rootState.categories = rootState.categories.map(item => {
      // 只有同类型的分类才会更新选中状态
      if ((item.type || DEFAULT_TYPE) !== targetType) {
        return item;
      }
      return {
        ...item,
        selected: categoryId ? item.id === categoryId : false,
      };
    });
    rootState.currentCategoryIds = {
      ...rootState.currentCategoryIds,
      [targetType]: categoryId || null,
    };
  },
};

const actions = {
  /**
   * 初始化分类列表
   * 优先从 Supabase 加载，如果失败则使用 mock 数据
   */
  async initializeCategories({ commit, state, dispatch }) {
    // 如果已有数据（从 localStorage 恢复），且 Supabase 未配置，则直接返回
    if (state.categories.length && !process.env.VUE_APP_SUPABASE_URL) {
      return;
    }

    // 如果已有数据，先尝试从 Supabase 同步
    if (state.categories.length && process.env.VUE_APP_SUPABASE_URL) {
      try {
        await dispatch('syncFromSupabase');
        return;
      } catch (error) {
        console.warn('Failed to sync from Supabase, using local data:', error);
        return;
      }
    }

    // 从 Supabase 加载数据
    if (process.env.VUE_APP_SUPABASE_URL) {
      try {
        const normalized = await categoriesAPI.fetchCategories();

        if (normalized && normalized.length > 0) {
          // 调试日志：检查格式化后的数据
          const totalResources = normalized.reduce((sum, cat) => sum + (cat.resources?.length || 0), 0);
          console.log('从 Supabase 加载的数据:', {
            categoriesCount: normalized.length,
            totalResources,
            categories: normalized.map(cat => ({
              label: cat.label,
              resourcesCount: cat.resources?.length || 0,
            })),
          });

          // 使用 Vue.set 确保响应式更新，避免背景闪烁
          commit('setCategories', normalized);

          // 更新当前选中的分类
          const selectedProject = normalized.find(cat => cat.type === 'project' && cat.selected);
          const selectedLearning = normalized.find(cat => cat.type !== 'project' && cat.selected);
          if (selectedProject) {
            commit('markSelected', {
              type: 'project',
              categoryId: selectedProject.id,
            });
          }
          if (selectedLearning) {
            commit('markSelected', {
              type: 'learning',
              categoryId: selectedLearning.id,
            });
          }

          return;
        }
      } catch (error) {
        console.error('Failed to load categories from Supabase:', error);
        // 如果 Supabase 加载失败，使用 mock 数据
      }
    }

    // 如果没有 Supabase 配置或加载失败，使用 mock 数据
    commit('setCategories', mockCategories);
  },

  /**
   * 从 Supabase 同步数据
   * 用于在有本地数据的情况下，从 Supabase 获取最新数据
   */
  async syncFromSupabase({ commit }) {
    if (!process.env.VUE_APP_SUPABASE_URL) {
      return;
    }

    const normalized = await categoriesAPI.fetchCategories();
    if (normalized && normalized.length > 0) {
      commit('setCategories', normalized);
    }
  },

  /**
   * 保存分类（包括资源）
   * 如果是新分类（临时 ID），会创建新记录并返回 UUID
   * 如果是已有分类，会更新现有记录
   * @param {Object} context - Vuex context
   * @param {Object} category - 分类数据
   * @returns {Promise<Object>} 保存后的分类
   */
  async saveCategory({ commit }, category) {
    // 如果没有配置 Supabase，只更新本地状态
    if (!process.env.VUE_APP_SUPABASE_URL) {
      commit('updateCategory', category);
      return category;
    }

    try {
      const { id } = category;
      const isNew = !id || id.toString().startsWith('custom-');

      // 使用 API 保存分类和资源
      const updatedCategory = await categoriesAPI.saveCategoryWithResources(category);

      // 更新本地状态
      // 如果 ID 发生了变化（从临时 ID 变为 UUID），需要传递旧 ID
      const categoryWithOldId = {
        ...updatedCategory,
        _oldId: isNew && id ? id : undefined, // 传递旧 ID 以便 mutation 能找到正确的分类
      };
      commit('updateCategory', categoryWithOldId);

      // 返回更新后的分类（不包含内部字段）
      const { _oldId: _unused, ...result } = categoryWithOldId; // eslint-disable-line no-unused-vars
      return result;
    } catch (error) {
      console.error('Failed to save category to Supabase:', error);
      // 即使 Supabase 保存失败，也更新本地状态
      commit('updateCategory', category);
      throw error;
    }
  },

  /**
   * 删除分类
   * 如果是临时 ID，只删除本地状态
   * 如果是 UUID，会从 Supabase 删除，然后删除本地状态
   * @param {Object} context - Vuex context
   * @param {string} categoryId - 分类 ID
   */
  async deleteCategory({ commit, state }, categoryId) {
    // 检查是否是临时 ID（未保存到 Supabase 的分类）
    const isTemporaryId = categoryId && categoryId.toString().startsWith('custom-');

    // 如果是临时 ID，只删除本地状态，不调用 Supabase
    if (isTemporaryId || !process.env.VUE_APP_SUPABASE_URL) {
      commit('removeCategory', categoryId);
      return;
    }

    // 验证分类是否存在
    const category = state.categories.find(cat => cat.id === categoryId);
    if (!category) {
      console.warn('Category not found:', categoryId);
      // 即使找不到，也尝试删除本地状态
      commit('removeCategory', categoryId);
      return;
    }

    try {
      // 使用 API 删除分类
      await categoriesAPI.deleteCategory(categoryId);
      commit('removeCategory', categoryId);
    } catch (error) {
      console.error('Failed to delete category from Supabase:', error);
      // 即使 Supabase 删除失败，也删除本地状态
      commit('removeCategory', categoryId);
      // 不抛出错误，允许删除本地状态
    }
  },

  /**
   * 选择分类（更新选中状态）
   * 同一类型只能有一个分类被选中
   * @param {Object} context - Vuex context
   * @param {Object} payload - { type: 'project' | 'learning', categoryId: string }
   */
  async selectCategory({ commit, state }, { type, categoryId }) {
    // 如果是临时 ID，只更新本地状态
    const isTemporaryId = categoryId && categoryId.toString().startsWith('custom-');

    if (isTemporaryId || !process.env.VUE_APP_SUPABASE_URL) {
      commit('markSelected', { type, categoryId });
      return;
    }

    // 验证分类是否存在
    const category = state.categories.find(cat => cat.id === categoryId);
    if (!category) {
      console.warn('Category not found for selection:', categoryId);
      commit('markSelected', { type, categoryId });
      return;
    }

    try {
      // 使用 API 更新选中状态
      await categoriesAPI.updateCategorySelection(type, categoryId);
      commit('markSelected', { type, categoryId });
    } catch (error) {
      console.error('Failed to select category in Supabase:', error);
      // 即使 Supabase 更新失败，也更新本地状态
      commit('markSelected', { type, categoryId });
    }
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [localStoragePlugin],
});
