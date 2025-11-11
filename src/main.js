/**
 * 应用入口文件
 * 初始化 Vue 应用，注册 Element UI 组件库
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.less';
import App from './App.vue';
import store from './store';

// 在开发环境中加载迁移工具（仅在控制台使用）
if (process.env.NODE_ENV === 'development') {
  import('@/utils/migrateToSupabase');
}

Vue.config.productionTip = false;

// 注册 Element UI 组件库
Vue.use(ElementUI);

// 创建 Vue 实例
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
