export const mockCategories = [
  {
    id: 'project-scaffold',
    type: 'project',
    label: '脚手架开发',
    description: '搭建脚手架模板，提升项目初始化效率',
    selected: false,
    resources: [
      { id: 'cli-plugin', title: 'Vue CLI 插件开发', link: 'https://cli.vuejs.org/zh/dev-guide/plugin-dev.html', completed: false },
      { id: 'plop', title: 'Plop 自动化脚手架', link: 'https://plopjs.com/', completed: false }
    ]
  },
  {
    id: 'component-lib',
    type: 'project',
    label: '组件库开发',
    description: '从零搭建可复用组件库体系',
    selected: false,
    resources: [
      { id: 'element-source', title: 'Element 源码解析', link: 'https://github.com/ElemeFE/element', completed: false },
      { id: 'storybook', title: 'Storybook 入门', link: 'https://storybook.js.org/tutorials/intro-to-storybook/vue/zh-CN/get-started/', completed: false }
    ]
  },
  {
    id: 'data-visualization',
    type: 'project',
    label: '数据大屏',
    description: '构建数据可视化大屏项目',
    selected: false,
    resources: [
      { id: 'echarts', title: 'ECharts 官方文档', link: 'https://echarts.apache.org/zh/index.html', completed: false },
      { id: 'dataV', title: 'DataV 可视化组件库', link: 'http://datav.jiaminghi.com/', completed: false }
    ]
  },
  {
    id: 'admin-system',
    type: 'project',
    label: '后台管理系统',
    description: '掌握后台管理常用功能模块',
    selected: false,
    resources: [
      { id: 'vue-admin', title: 'Vue Admin Template', link: 'https://panjiachen.github.io/vue-element-admin-site/zh/', completed: false },
      { id: 'permission', title: '权限控制实践', link: 'https://juejin.cn/post/6844903664008486919', completed: false }
    ]
  },
  {
    id: 'monitoring',
    type: 'project',
    label: '前端监控平台',
    description: '搭建前端质量与性能监控体系',
    selected: false,
    resources: [
      { id: 'sentry', title: 'Sentry 前端监控', link: 'https://docs.sentry.io/platforms/javascript/', completed: false },
      { id: 'performance', title: 'Web 性能监控', link: 'https://web.dev/performance-scoring/', completed: false }
    ]
  },
  {
    id: 'vue-source',
    type: 'learning',
    label: 'Vue 源码解析',
    description: '深入理解 Vue2/Vue3 运行机制',
    selected: false,
    resources: [
      { id: 'vue2-source', title: 'Vue2 揭秘', link: 'https://ustbhuangyi.github.io/vue-analysis/', completed: false },
      { id: 'vue3-source', title: 'Vue3 设计与实现', link: 'https://vue3js.cn/start/', completed: false }
    ]
  },
  {
    id: 'build-tools',
    type: 'learning',
    label: '打包工具与 Git',
    description: '掌握 Webpack、Vite 与 Git',
    selected: false,
    resources: [
      { id: 'webpack-doc', title: 'Webpack 官方文档', link: 'https://webpack.docschina.org/', completed: false },
      { id: 'vite-doc', title: 'Vite 指南', link: 'https://cn.vitejs.dev/guide/', completed: false },
      { id: 'git-pro', title: 'Pro Git', link: 'https://git-scm.com/book/zh/v2', completed: false }
    ]
  },
  {
    id: 'performance',
    type: 'learning',
    label: '性能优化与调试',
    description: '提升性能与调试能力',
    selected: false,
    resources: [
      { id: 'lightouse', title: 'Lighthouse 使用指南', link: 'https://developer.chrome.com/docs/lighthouse/overview/', completed: false },
      { id: 'debug', title: 'Chrome DevTools 调试技巧', link: 'https://developer.chrome.com/docs/devtools/', completed: false }
    ]
  },
  {
    id: 'tooling',
    type: 'learning',
    label: '开发工具拓展',
    description: 'TypeScript、Node.js、小程序等',
    selected: false,
    resources: [
      { id: 'typescript', title: 'TypeScript 官方手册', link: 'https://www.typescriptlang.org/zh/docs/', completed: false },
      { id: 'nodejs', title: 'Node.js 入门', link: 'https://nodejs.dev/en/learn/', completed: false },
      { id: 'mini-program', title: '微信小程序开发指南', link: 'https://developers.weixin.qq.com/miniprogram/dev/framework/', completed: false }
    ]
  },
  {
    id: 'automation-testing',
    type: 'learning',
    label: 'Cypress/Vitest 自动化测试',
    description: '构建端到端与单元测试自动化体系',
    selected: false,
    resources: [
      { id: 'cypress-doc', title: 'Cypress 官方文档', link: 'https://docs.cypress.io/', completed: false },
      { id: 'vitest-doc', title: 'Vitest 指南', link: 'https://cn.vitest.dev/guide/', completed: false },
      { id: 'testing-strategy', title: '前端测试策略实践', link: 'https://testingjavascript.com/', completed: false }
    ]
  },
  {
    id: 'design-collaboration',
    type: 'learning',
    label: 'Figma 与 Cursor MCP',
    description: '提升设计协作与 AI 辅助开发效率',
    selected: false,
    resources: [
      { id: 'figma-guide', title: 'Figma 设计系统指南', link: 'https://help.figma.com/hc/zh-cn', completed: false },
      { id: 'cursor-mcp', title: 'Cursor MCP 集成文档', link: 'https://docs.cursor.com/mcp', completed: false },
      { id: 'ai-collaboration', title: 'AI 辅助协同最佳实践', link: 'https://www.figma.com/community/file/1234567890-ai-design-workflow', completed: false }
    ]
  },
  {
    id: 'cdn-cache',
    type: 'learning',
    label: 'CDN 图片缓存',
    description: '掌握静态资源加速与缓存策略',
    selected: false,
    resources: [
      { id: 'cdn-best-practice', title: 'CDN 最佳实践', link: 'https://developer.fastly.com/solutions/examples/caching/', completed: false },
      { id: 'image-optimization', title: '图片优化与缓存策略', link: 'https://web.dev/image-cdns/', completed: false },
      { id: 'cloudflare-images', title: 'Cloudflare Images 教程', link: 'https://developers.cloudflare.com/images/', completed: false }
    ]
  }
];

