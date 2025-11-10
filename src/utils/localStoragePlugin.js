const STORAGE_KEY = 'learning-turntable';

export const loadState = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.warn('读取本地缓存失败：', error);
    return null;
  }
};

export const localStoragePlugin = (store) => {
  if (typeof window === 'undefined') {
    return;
  }
  store.subscribe((mutation, state) => {
    try {
      const serialized = JSON.stringify({
        categories: state.categories,
        currentCategoryIds: state.currentCategoryIds
      });
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.warn('写入本地缓存失败：', error);
    }
  });
};

