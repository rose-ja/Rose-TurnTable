import Vue from 'vue';
import Vuex from 'vuex';
import mockClient from '@/utils/mockClient';
import { loadState, localStoragePlugin } from '@/utils/localStoragePlugin';

Vue.use(Vuex);

const DEFAULT_TYPE = 'learning';

const normalizeCategories = (collections = []) =>
  (collections || []).map((item) => ({
    ...item,
    type: item.type || DEFAULT_TYPE,
    selected: Boolean(item.selected)
  }));

const persistedState = loadState();
// 兼容老版本仅存储数组的结构
const normalizedState = Array.isArray(persistedState)
  ? { categories: persistedState, currentCategoryIds: { project: null, learning: null } }
  : persistedState || {};

// 初始状态，优先从本地缓存中恢复，确保刷新后仍能保留学习进度
const state = {
  categories: normalizeCategories(normalizedState.categories),
  currentCategoryIds: {
    project: normalizedState.currentCategoryIds?.project || null,
    learning: normalizedState.currentCategoryIds?.learning || null
  }
};

const getters = {
  categoryList: (rootState) => rootState.categories,
  projectCategories: (rootState) => rootState.categories.filter((item) => item.type === 'project'),
  learningCategories: (rootState) => rootState.categories.filter((item) => item.type !== 'project'),
  currentCategoryIds: (rootState) => rootState.currentCategoryIds,
  currentCategoryByType: (rootState) => (type) =>
    rootState.categories.find((item) => item.id === rootState.currentCategoryIds?.[type]) || null
};

const mutations = {
  // 初始化方向列表
  setCategories(rootState, payload) {
    rootState.categories = normalizeCategories(payload);
  },
  // 新增自定义方向
  addCategory(rootState, payload) {
    rootState.categories.push({
      ...payload,
      type: payload.type || DEFAULT_TYPE,
      selected: Boolean(payload.selected)
    });
  },
  // 删除指定方向，同时恢复默认选中状态
  removeCategory(rootState, categoryId) {
    const removed = rootState.categories.find((item) => item.id === categoryId);
    rootState.categories = rootState.categories.filter((item) => item.id !== categoryId);
    if (removed) {
      const type = removed.type || DEFAULT_TYPE;
      if (rootState.currentCategoryIds[type] === categoryId) {
        rootState.currentCategoryIds = {
          ...rootState.currentCategoryIds,
          [type]: null
        };
      }
    }
  },
  // 保存方向信息与资源内容
  updateCategory(rootState, payload) {
    const index = rootState.categories.findIndex((item) => item.id === payload.id);
    if (index !== -1) {
      Vue.set(rootState.categories, index, {
        ...payload,
        type: payload.type || rootState.categories[index].type || DEFAULT_TYPE,
        selected: Boolean(payload.selected)
      });
    }
  },
  // 标记当前抽中的方向
  markSelected(rootState, { type, categoryId }) {
    const targetType = type || DEFAULT_TYPE;
    rootState.categories = rootState.categories.map((item) => {
      if ((item.type || DEFAULT_TYPE) !== targetType) {
        return item;
      }
      return {
        ...item,
        selected: categoryId ? item.id === categoryId : false
      };
    });
    rootState.currentCategoryIds = {
      ...rootState.currentCategoryIds,
      [targetType]: categoryId || null
    };
  }
};

const actions = {
  async initializeCategories({ commit, state }) {
    if (state.categories.length) {
      return;
    }
    const response = await mockClient.get('/mock/categories');
    commit('setCategories', response.data);
  },
  saveCategory({ commit }, category) {
    commit('updateCategory', category);
    return mockClient.post('/mock/categories', category);
  },
  selectCategory({ commit }, payload) {
    commit('markSelected', payload);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [localStoragePlugin]
});

