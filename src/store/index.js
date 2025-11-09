import Vue from 'vue';
import Vuex from 'vuex';
import mockClient from '@/utils/mockClient';
import { loadState, localStoragePlugin } from '@/utils/localStoragePlugin';

Vue.use(Vuex);

const persistedState = loadState();
// 兼容老版本仅存储数组的结构
const normalizedState = Array.isArray(persistedState)
  ? { categories: persistedState, currentCategoryId: null }
  : persistedState;

// 初始状态，优先从本地缓存中恢复，确保刷新后仍能保留学习进度
const state = {
  categories: normalizedState?.categories || [],
  currentCategoryId: normalizedState?.currentCategoryId || null
};

const getters = {
  categoryList: (rootState) => rootState.categories,
  currentCategoryId: (rootState) => rootState.currentCategoryId,
  currentCategory: (rootState) =>
    rootState.categories.find((item) => item.id === rootState.currentCategoryId) || null
};

const mutations = {
  // 初始化方向列表
  setCategories(rootState, payload) {
    rootState.categories = payload;
  },
  // 新增自定义方向
  addCategory(rootState, payload) {
    rootState.categories.push(payload);
  },
  // 删除指定方向，同时恢复默认选中状态
  removeCategory(rootState, categoryId) {
    rootState.categories = rootState.categories.filter((item) => item.id !== categoryId);
    if (rootState.currentCategoryId === categoryId) {
      rootState.currentCategoryId = null;
    }
  },
  // 保存方向信息与资源内容
  updateCategory(rootState, payload) {
    const index = rootState.categories.findIndex((item) => item.id === payload.id);
    if (index !== -1) {
      Vue.set(rootState.categories, index, payload);
    }
  },
  // 标记当前抽中的方向
  markSelected(rootState, categoryId) {
    rootState.categories = rootState.categories.map((item) => ({
      ...item,
      selected: item.id === categoryId
    }));
    rootState.currentCategoryId = categoryId;
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
  selectCategory({ commit }, categoryId) {
    commit('markSelected', categoryId);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [localStoragePlugin]
});

