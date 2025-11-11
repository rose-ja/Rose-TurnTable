-- ============================================
-- 完整插入 Categories 和 Resources 数据
-- 转盘工具项目
-- ============================================
-- 
-- 使用说明：
-- 1. 此脚本会先插入 categories 数据（如果不存在）
-- 2. 然后插入对应的 resources 数据
-- 3. 使用 ON CONFLICT 避免重复插入
-- 4. 适用于全新数据库初始化
--
-- 注意：
-- - 如果 categories 表已有数据，此脚本会跳过已存在的分类
-- - 如果 resources 表已有数据，此脚本会跳过已存在的资源
-- ============================================

-- ============================================
-- 1. 插入 Categories 数据
-- ============================================

-- 插入项目类分类
INSERT INTO public.categories (label, description, type, selected)
VALUES
  ('脚手架开发', '搭建脚手架模板，提升项目初始化效率', 'project', false),
  ('组件库开发', '从零搭建可复用组件库体系', 'project', false),
  ('数据大屏', '构建数据可视化大屏项目', 'project', false),
  ('后台管理系统', '掌握后台管理常用功能模块', 'project', false),
  ('前端监控平台', '搭建前端质量与性能监控体系', 'project', false)
ON CONFLICT DO NOTHING;

-- 插入学习类分类
INSERT INTO public.categories (label, description, type, selected)
VALUES
  ('Vue 源码解析', '深入理解 Vue2/Vue3 运行机制', 'learning', false),
  ('打包工具与 Git', '掌握 Webpack、Vite 与 Git', 'learning', false),
  ('性能优化与调试', '提升性能与调试能力', 'learning', false),
  ('开发工具拓展', 'TypeScript、Node.js、小程序等', 'learning', false),
  ('Cypress/Vitest 自动化测试', '构建端到端与单元测试自动化体系', 'learning', false),
  ('Figma 与 Cursor MCP', '提升设计协作与 AI 辅助开发效率', 'learning', false),
  ('CDN 图片缓存', '掌握静态资源加速与缓存策略', 'learning', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. 插入 Resources 数据
-- ============================================

-- 插入脚手架开发的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vue CLI 插件开发', 'https://cli.vuejs.org/zh/dev-guide/plugin-dev.html', false
FROM public.categories
WHERE label = '脚手架开发'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vue CLI 插件开发'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Plop 自动化脚手架', 'https://plopjs.com/', false
FROM public.categories
WHERE label = '脚手架开发'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Plop 自动化脚手架'
  );

-- 插入组件库开发的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Element 源码解析', 'https://github.com/ElemeFE/element', false
FROM public.categories
WHERE label = '组件库开发'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Element 源码解析'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Storybook 入门', 'https://storybook.js.org/tutorials/intro-to-storybook/vue/zh-CN/get-started/', false
FROM public.categories
WHERE label = '组件库开发'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Storybook 入门'
  );

-- 插入数据大屏的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'ECharts 官方文档', 'https://echarts.apache.org/zh/index.html', false
FROM public.categories
WHERE label = '数据大屏'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'ECharts 官方文档'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'DataV 可视化组件库', 'http://datav.jiaminghi.com/', false
FROM public.categories
WHERE label = '数据大屏'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'DataV 可视化组件库'
  );

-- 插入后台管理系统的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vue Admin Template', 'https://panjiachen.github.io/vue-element-admin-site/zh/', false
FROM public.categories
WHERE label = '后台管理系统'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vue Admin Template'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, '权限控制实践', 'https://juejin.cn/post/6844903664008486919', false
FROM public.categories
WHERE label = '后台管理系统'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = '权限控制实践'
  );

-- 插入前端监控平台的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Sentry 前端监控', 'https://docs.sentry.io/platforms/javascript/', false
FROM public.categories
WHERE label = '前端监控平台'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Sentry 前端监控'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Web 性能监控', 'https://web.dev/performance-scoring/', false
FROM public.categories
WHERE label = '前端监控平台'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Web 性能监控'
  );

-- 插入 Vue 源码解析的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vue2 揭秘', 'https://ustbhuangyi.github.io/vue-analysis/', false
FROM public.categories
WHERE label = 'Vue 源码解析'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vue2 揭秘'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vue3 设计与实现', 'https://vue3js.cn/start/', false
FROM public.categories
WHERE label = 'Vue 源码解析'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vue3 设计与实现'
  );

-- 插入打包工具与 Git 的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Webpack 官方文档', 'https://webpack.docschina.org/', false
FROM public.categories
WHERE label = '打包工具与 Git'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Webpack 官方文档'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vite 指南', 'https://cn.vitejs.dev/guide/', false
FROM public.categories
WHERE label = '打包工具与 Git'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vite 指南'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Pro Git', 'https://git-scm.com/book/zh/v2', false
FROM public.categories
WHERE label = '打包工具与 Git'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Pro Git'
  );

-- 插入性能优化与调试的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Lighthouse 使用指南', 'https://developer.chrome.com/docs/lighthouse/overview/', false
FROM public.categories
WHERE label = '性能优化与调试'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Lighthouse 使用指南'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Chrome DevTools 调试技巧', 'https://developer.chrome.com/docs/devtools/', false
FROM public.categories
WHERE label = '性能优化与调试'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Chrome DevTools 调试技巧'
  );

-- 插入开发工具拓展的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'TypeScript 官方手册', 'https://www.typescriptlang.org/zh/docs/', false
FROM public.categories
WHERE label = '开发工具拓展'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'TypeScript 官方手册'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Node.js 入门', 'https://nodejs.dev/en/learn/', false
FROM public.categories
WHERE label = '开发工具拓展'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Node.js 入门'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, '微信小程序开发指南', 'https://developers.weixin.qq.com/miniprogram/dev/framework/', false
FROM public.categories
WHERE label = '开发工具拓展'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = '微信小程序开发指南'
  );

-- 插入 Cypress/Vitest 自动化测试的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Cypress 官方文档', 'https://docs.cypress.io/', false
FROM public.categories
WHERE label = 'Cypress/Vitest 自动化测试'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Cypress 官方文档'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Vitest 指南', 'https://cn.vitest.dev/guide/', false
FROM public.categories
WHERE label = 'Cypress/Vitest 自动化测试'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Vitest 指南'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, '前端测试策略实践', 'https://testingjavascript.com/', false
FROM public.categories
WHERE label = 'Cypress/Vitest 自动化测试'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = '前端测试策略实践'
  );

-- 插入 Figma 与 Cursor MCP 的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Figma 设计系统指南', 'https://help.figma.com/hc/zh-cn', false
FROM public.categories
WHERE label = 'Figma 与 Cursor MCP'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Figma 设计系统指南'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Cursor MCP 集成文档', 'https://docs.cursor.com/mcp', false
FROM public.categories
WHERE label = 'Figma 与 Cursor MCP'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Cursor MCP 集成文档'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'AI 辅助协同最佳实践', 'https://www.figma.com/community/file/1234567890-ai-design-workflow', false
FROM public.categories
WHERE label = 'Figma 与 Cursor MCP'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'AI 辅助协同最佳实践'
  );

-- 插入 CDN 图片缓存的资源
INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'CDN 最佳实践', 'https://developer.fastly.com/solutions/examples/caching/', false
FROM public.categories
WHERE label = 'CDN 图片缓存'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'CDN 最佳实践'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, '图片优化与缓存策略', 'https://web.dev/image-cdns/', false
FROM public.categories
WHERE label = 'CDN 图片缓存'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = '图片优化与缓存策略'
  );

INSERT INTO public.resources (category_id, title, link, completed)
SELECT id, 'Cloudflare Images 教程', 'https://developers.cloudflare.com/images/', false
FROM public.categories
WHERE label = 'CDN 图片缓存'
  AND NOT EXISTS (
    SELECT 1 FROM public.resources r 
    WHERE r.category_id = public.categories.id 
      AND r.title = 'Cloudflare Images 教程'
  );

-- ============================================
-- 3. 验证数据
-- ============================================

-- 查看插入的资源数量
SELECT 
  c.label as category_label,
  COUNT(r.id) as resources_count
FROM public.categories c
LEFT JOIN public.resources r ON r.category_id = c.id
GROUP BY c.id, c.label
ORDER BY c.label;

-- 查看所有资源
SELECT 
  c.label as category_label,
  r.title as resource_title,
  r.link as resource_link,
  r.completed
FROM public.categories c
INNER JOIN public.resources r ON r.category_id = c.id
ORDER BY c.label, r.title;

-- ============================================

