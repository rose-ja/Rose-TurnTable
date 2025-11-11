# Rose TurnTable 项目文档

## 📋 目录

- [项目简介](#项目简介)
- [快速开始](#快速开始)
- [Supabase 接入指南](#supabase-接入指南)
  - [快速开始（5分钟）](#快速开始5分钟)
  - [详细步骤](#详细步骤)
- [数据库脚本说明](#数据库脚本说明)
- [ID 不一致问题修复总结](#id-不一致问题修复总结)
- [API 接口说明](#api-接口说明)
- [故障排除](#故障排除)

---

## 项目简介

Rose TurnTable 是一个转盘工具项目，用于帮助管理和选择学习方向。项目支持：

- ✅ 双转盘系统（项目类 + 学习类）
- ✅ 分类管理（添加、编辑、删除）
- ✅ 资源管理（为每个分类添加学习资源）
- ✅ Supabase 远程存储
- ✅ 本地存储降级方案

---

## 快速开始

### 环境要求

- Node.js >= 14
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm serve
```

### 构建生产版本

```bash
pnpm build
```

---

## Supabase 接入指南

### 快速开始（5分钟）

#### 步骤 1: 创建 Supabase 项目（2分钟）

1. 访问 https://supabase.com 并注册账号
2. 创建新项目，选择 **Free** 计划
3. 记住数据库密码（稍后会用到）

#### 步骤 2: 创建数据库表（1分钟）

1. 在 Supabase Dashboard 点击 **"SQL Editor"**
2. 打开 `database/supabase_schema.sql` 文件
3. 复制全部 SQL 代码并粘贴到 SQL Editor
4. 点击 **"Run"** 执行

#### 步骤 3: 获取 API 密钥（1分钟）

1. 在 Supabase Dashboard 点击 **"Settings"** → **"API"**
2. 复制 **Project URL** 和 **anon public key**

#### 步骤 4: 配置环境变量（30秒）

1. 在项目根目录创建 `.env.local` 文件：
   ```env
   VUE_APP_SUPABASE_URL=你的项目URL
   VUE_APP_SUPABASE_ANON_KEY=你的anon public key
   ```

#### 步骤 5: 安装依赖并启动（30秒）

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm serve
```

#### 步骤 6: 测试（1分钟）

1. 打开浏览器访问应用
2. 尝试添加新分类
3. 在 Supabase Dashboard 的 **"Table Editor"** 中查看数据

### 详细步骤

#### 1. 创建 Supabase 项目

##### 1.1 注册账号

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 **"Start your project"** 或 **"Sign Up"**
3. 使用 GitHub 账号登录（推荐）或邮箱注册

##### 1.2 创建新项目

1. 登录后，点击 **"New Project"**
2. 填写项目信息：
   - **Name**: `rose-turntable` （或你喜欢的名称）
   - **Database Password**: 设置一个强密码（**重要：记住这个密码**）
   - **Region**: 选择离你最近的区域（如 `Southeast Asia (Singapore)`）
   - **Pricing Plan**: 选择 **Free** 免费计划
3. 点击 **"Create new project"**
4. 等待 1-2 分钟，项目创建完成

#### 2. 设计数据库表结构

##### 2.1 进入 SQL Editor

1. 在 Supabase Dashboard 左侧菜单，点击 **"SQL Editor"**
2. 点击 **"New query"**

##### 2.2 创建表结构

复制 `database/supabase_schema.sql` 文件中的 SQL 并执行。该文件包含：

- `categories` 表：存储分类信息
- `resources` 表：存储资源信息
- 索引：提升查询性能
- 触发器：自动更新 `updated_at` 字段
- RLS 策略：配置访问权限

##### 2.3 验证表创建

1. 点击左侧菜单 **"Table Editor"**
2. 应该能看到 `categories` 和 `resources` 两个表

#### 3. 配置 Row Level Security (RLS)

RLS 策略已在 `supabase_schema.sql` 中配置，允许所有人（匿名用户）访问和修改数据。

**⚠️ 注意：**
- 这个配置允许**所有人**（匿名用户）访问和修改数据
- 适合个人项目或内部使用
- 如果需要用户认证，请参考 Supabase Auth 文档

#### 4. 获取 API 密钥

##### 4.1 获取项目 URL 和 API Key

1. 在 Supabase Dashboard 左侧菜单，点击 **"Settings"** (⚙️)
2. 点击 **"API"**
3. 找到以下信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon public key**: 类似 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. **复制这两个值**，稍后会用到

#### 5. 安装 Supabase SDK

依赖已在 `package.json` 中配置，直接安装即可：

```bash
pnpm install
```

#### 6. 配置环境变量

##### 6.1 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```env
VUE_APP_SUPABASE_URL=你的项目URL
VUE_APP_SUPABASE_ANON_KEY=你的anon public key
```

**示例：**
```env
VUE_APP_SUPABASE_URL=https://abcdefghijk.supabase.co
VUE_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MzU5NzY4MDAsImV4cCI6MTk1MTU1MjgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

##### 6.2 确保 .env.local 不被提交到 Git

检查 `.gitignore` 文件，确保包含：

```
.env.local
.env.*.local
```

#### 7. 数据迁移

##### 7.1 从 localStorage 迁移到 Supabase

如果已有 localStorage 数据，有两种迁移方式：

**方式 1: 使用迁移脚本（推荐）**

1. 启动开发服务器：`pnpm serve`
2. 打开浏览器控制台（F12）
3. 运行以下命令：
   ```javascript
   // 导出数据备份
   window.exportLocalStorageData()
   
   // 迁移数据到 Supabase
   window.migrateToSupabase()
   ```

**方式 2: 手动迁移**

1. 在浏览器控制台运行：`JSON.parse(localStorage.getItem('learning-turntable'))`
2. 复制数据
3. 在 Supabase Dashboard 的 Table Editor 中手动创建记录
4. 或使用 SQL Editor 执行 INSERT 语句

##### 7.2 插入初始数据

如果数据库为空，可以使用 `database/insert_all_data.sql` 脚本插入初始数据：

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 复制 `database/insert_all_data.sql` 的内容
4. 执行 SQL

#### 8. 测试验证

##### 8.1 启动开发服务器

```bash
pnpm serve
```

##### 8.2 测试功能

1. ✅ 打开应用，检查数据是否从 Supabase 加载
2. ✅ 添加新分类，检查 Supabase Table Editor 是否有新数据
3. ✅ 编辑分类，检查更新是否同步
4. ✅ 删除分类，检查删除是否生效
5. ✅ 添加资源，检查 resources 表是否有新数据

##### 8.3 查看 Supabase 日志

1. 在 Supabase Dashboard 点击 **"Logs"**
2. 选择 **"API"** 查看 API 请求日志
3. 检查是否有错误

---

## 数据库脚本说明

### 📁 文件列表

1. **supabase_schema.sql** - 数据库表结构和 RLS 策略
2. **insert_all_data.sql** - 插入 categories 和 resources 数据（完整版）

### 🚀 快速开始

#### 方式 1: 插入所有数据

如果是全新数据库，需要插入 categories 和 resources：

1. 打开 Supabase Dashboard
2. 进入 **SQL Editor**
3. 复制 `insert_all_data.sql` 的内容
4. 执行 SQL

### 📝 使用说明

#### insert_all_data.sql

- ✅ 一次性插入 categories 和 resources
- ✅ 适用于全新数据库初始化
- ✅ 自动跳过已存在的数据

### 🔍 验证数据

执行 SQL 后，可以使用以下查询验证数据：

```sql
-- 查看每个分类的资源数量
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
```

### ⚠️ 注意事项

1. **确保 categories 表有数据**：resources 数据依赖 categories 的 category_id
2. **label 必须匹配**：SQL 通过 label 来查找 category_id，确保 label 与 mock 数据一致
3. **避免重复插入**：脚本使用 `NOT EXISTS` 检查，不会重复插入相同的数据
4. **执行顺序**：先执行 `supabase_schema.sql`，再执行数据插入脚本

### 📊 数据统计

执行脚本后，应该有以下数据：

- **Categories**: 12 个分类（5 个项目类 + 7 个学习类）
- **Resources**: 26 个资源
  - 脚手架开发: 2 个
  - 组件库开发: 2 个
  - 数据大屏: 2 个
  - 后台管理系统: 2 个
  - 前端监控平台: 2 个
  - Vue 源码解析: 2 个
  - 打包工具与 Git: 3 个
  - 性能优化与调试: 2 个
  - 开发工具拓展: 3 个
  - Cypress/Vitest 自动化测试: 3 个
  - Figma 与 Cursor MCP: 3 个
  - CDN 图片缓存: 3 个

---

## ID 不一致问题修复总结

### 🐛 问题描述

当删除分类时，数据库中的 ID（UUID）和删除函数传入的 ID（临时 ID `custom-xxx`）不一致，导致删除失败。

### 🔍 问题原因

1. **新增分类时**：使用临时 ID `custom-${Date.now()}`
2. **保存到 Supabase 后**：Supabase 返回真实的 UUID
3. **ID 更新不完整**：保存后，本地状态的 ID 没有正确更新为 UUID
4. **删除时**：仍使用旧的临时 ID，Supabase 找不到记录

### ✅ 修复方案

#### 1. 更新 `updateCategory` mutation

- 支持通过旧 ID（临时 ID）查找分类
- 当 ID 从临时 ID 变为 UUID 时，自动更新 `currentCategoryIds`
- 排除内部字段 `_oldId`，避免污染数据

#### 2. 更新 `deleteCategory` action

- 检查是否是临时 ID（`custom-` 开头）
- 如果是临时 ID，只删除本地状态，不调用 Supabase API
- 如果是 UUID 但 Supabase 中不存在，也删除本地状态
- 增强错误处理，即使 Supabase 删除失败，也删除本地状态

#### 3. 更新 `selectCategory` action

- 检查是否是临时 ID
- 如果是临时 ID，只更新本地状态
- 验证分类是否存在，避免无效操作

#### 4. 更新 `saveCategoryResources` 方法

- 保存后获取返回的新 ID（UUID）
- 如果 ID 发生变化，更新 `activeCategory`
- 使用新的 ID 进行后续操作

### 📝 修改的文件

1. **src/store/index.js**
   - `updateCategory` mutation：支持 ID 更新
   - `removeCategory` mutation：改进删除逻辑
   - `deleteCategory` action：添加临时 ID 检查
   - `selectCategory` action：添加临时 ID 检查
   - `saveCategory` action：传递旧 ID 以便更新

2. **src/App.vue**
   - `saveCategoryResources` 方法：处理 ID 更新

### 🧪 测试场景

#### 场景 1: 新增分类并保存

1. 点击"新增方向"
2. 输入名称，创建临时 ID `custom-xxx`
3. 在资源对话框中保存
4. ✅ 验证：ID 应该更新为 UUID
5. ✅ 验证：Supabase 中应该有新记录

#### 场景 2: 保存前删除分类

1. 点击"新增方向"
2. 不保存，直接删除
3. ✅ 验证：应该只删除本地状态，不调用 Supabase API
4. ✅ 验证：分类应该从列表中消失

#### 场景 3: 保存后删除分类

1. 新增分类并保存
2. 获取 UUID
3. 删除分类
4. ✅ 验证：应该调用 Supabase API 删除
5. ✅ 验证：Supabase 中的记录应该被删除
6. ✅ 验证：本地状态应该更新

#### 场景 4: 编辑已保存的分类

1. 打开已保存的分类（有 UUID）
2. 修改信息并保存
3. ✅ 验证：ID 应该保持不变（仍然是 UUID）
4. ✅ 验证：Supabase 中的记录应该更新

#### 场景 5: 选中状态更新

1. 新增分类并保存
2. 选中该分类
3. ✅ 验证：应该使用 UUID 更新选中状态
4. ✅ 验证：Supabase 中的 `selected` 字段应该更新

### 🔧 技术细节

#### ID 类型判断

```javascript
const isTemporaryId = categoryId && categoryId.toString().startsWith('custom-');
```

#### ID 更新机制

```javascript
// 保存时传递旧 ID
const updatedCategory = {
  ...category,
  id: categoryId, // 新的 UUID
  _oldId: isNew && id ? id : undefined // 旧的临时 ID
};

// mutation 中使用旧 ID 查找
const oldId = payload._oldId || payload.id;
const index = rootState.categories.findIndex((item) => item.id === oldId || item.id === payload.id);
```

#### 错误处理

- Supabase 删除失败时，仍然删除本地状态
- Supabase 更新失败时，仍然更新本地状态
- 网络错误时，提供友好的错误提示

### ⚠️ 注意事项

1. **临时 ID 格式**：临时 ID 必须以 `custom-` 开头
2. **ID 更新时机**：只有在保存到 Supabase 后，ID 才会从临时 ID 变为 UUID
3. **数据一致性**：即使 Supabase 操作失败，本地状态也会更新，保证用户体验
4. **错误处理**：所有 Supabase 操作都有错误处理，避免应用崩溃

### 🎯 预期结果

- ✅ 新增分类后保存，ID 正确更新为 UUID
- ✅ 保存前删除分类，只删除本地状态
- ✅ 保存后删除分类，同时删除 Supabase 记录和本地状态
- ✅ 编辑分类，ID 保持不变
- ✅ 选中状态更新，使用正确的 UUID
- ✅ 所有操作都有适当的错误处理

---

## API 接口说明

### 文件结构

所有 Supabase 接口调用已封装在 `src/api/categories.js` 文件中。

### 接口列表

#### 1. fetchCategories()

获取所有分类（包含资源）

```javascript
import * as categoriesAPI from '@/api/categories';

const categories = await categoriesAPI.fetchCategories();
```

#### 2. createCategory(categoryData)

创建分类

```javascript
const newCategory = await categoriesAPI.createCategory({
  label: '新分类',
  description: '分类描述',
  type: 'learning',
  selected: false
});
```

#### 3. updateCategory(categoryId, categoryData)

更新分类

```javascript
await categoriesAPI.updateCategory(categoryId, {
  label: '更新后的名称',
  description: '更新后的描述'
});
```

#### 4. deleteCategory(categoryId)

删除分类

```javascript
await categoriesAPI.deleteCategory(categoryId);
```

#### 5. saveCategoryWithResources(category)

保存分类（包括资源）

```javascript
const savedCategory = await categoriesAPI.saveCategoryWithResources({
  id: 'category-id',
  label: '分类名称',
  description: '分类描述',
  type: 'learning',
  resources: [
    { title: '资源标题', link: 'https://example.com', completed: false }
  ]
});
```

#### 6. updateCategorySelection(type, categoryId)

更新分类的选中状态

```javascript
await categoriesAPI.updateCategorySelection('learning', categoryId);
```

### 数据格式化

所有从 Supabase 获取的数据都会自动格式化：

- `resources` 数组：自动过滤无效资源
- `completed` 字段：转换为布尔值
- `selected` 字段：转换为布尔值
- `type` 字段：默认值为 `'learning'`

---

## 故障排除

### 问题 1: 环境变量未加载

**解决：**
- 确保 `.env.local` 文件在项目根目录
- 重启开发服务器
- 检查变量名是否正确（必须以 `VUE_APP_` 开头）

### 问题 2: RLS 策略错误

**解决：**
- 检查 RLS 是否已启用
- 检查策略是否正确创建
- 在 Supabase Dashboard 的 **"Authentication"** → **"Policies"** 查看策略

### 问题 3: 跨域问题

**解决：**
- Supabase 默认允许跨域请求
- 如果遇到问题，检查浏览器控制台错误信息

### 问题 4: 数据未同步

**解决：**
- 检查网络连接
- 查看浏览器控制台错误
- 检查 Supabase Dashboard 的 API 日志

### 问题 5: 资源没有插入

**原因：**
- categories 表中没有对应的 label
- label 名称不匹配

**解决：**
- 检查 categories 表中的 label
- 确认 label 与 SQL 中的 label 完全一致

### 问题 6: 部分资源没有插入

**原因：**
- 资源已存在（通过 title 和 link 判断）

**解决：**
- 这是正常行为，脚本会自动跳过已存在的资源
- 如果需要重新插入，先删除对应的资源

### 问题 7: 外键约束错误

**原因：**
- category_id 不存在

**解决：**
- 确保 categories 表有对应的数据
- 检查 label 是否匹配

### 问题 8: ID 不一致问题

**原因：**
- 临时 ID 和 UUID 混淆
- ID 更新不完整

**解决：**
- 参考 [ID 不一致问题修复总结](#id-不一致问题修复总结)
- 确保保存后 ID 正确更新

---

## 📚 下一步

1. ✅ 完成以上步骤
2. ✅ 测试所有功能
3. ✅ 部署到生产环境
4. ✅ 配置自定义域名（可选）
5. ✅ 设置数据备份（可选）

---

## 🎉 完成！

恭喜！你已经成功接入 Supabase，数据现在存储在云端，不会因为清除浏览器缓存而丢失。


