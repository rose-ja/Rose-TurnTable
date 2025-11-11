<template>
  <div class="app-container">
    <app-header />

    <div class="content-grid">
      <turntable
        class="turntable"
        title="项目方向转盘"
        center-label="项目"
        :categories="projectCategories"
        :spinning="spinning.project"
        :selected-id="selectedIds.project"
        :disabled="!projectCategories.length"
        spin-label="抽取项目方向"
        @spin-request="handleSpin('project')"
        @update:selectedId="selectedIds.project = $event"
        @spin-end="handleSpinEnd('project', $event)"
      />
      <turntable
        class="turntable"
        title="学习技能转盘"
        center-label="学习"
        :categories="learningCategories"
        :spinning="spinning.learning"
        :selected-id="selectedIds.learning"
        :disabled="!learningCategories.length"
        spin-label="抽取学习方向"
        @spin-request="handleSpin('learning')"
        @update:selectedId="selectedIds.learning = $event"
        @spin-end="handleSpinEnd('learning', $event)"
      />
    </div>

    <stats-panel class="stats" :categories="categories" :current-ids="currentCategoryIds" />

    <category-list
      :project-categories="projectCategories"
      :learning-categories="learningCategories"
      :current-ids="currentCategoryIds"
      @add="handleAddCategory"
      @detail="openResourceDialog"
      @remove="removeCategory"
      @spin="startSpin"
    />

    <resource-dialog
      :visible.sync="resourceDialogVisible"
      :category="activeCategory"
      :completion-labels="completionLabels"
      @save="saveCategoryResources"
      @completion-change="handleCompletionChange"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import AppHeader from '@/components/layout/AppHeader.vue';
import Turntable from '@/components/Turntable.vue';
import StatsPanel from '@/components/panels/StatsPanel.vue';
import CategoryList from '@/components/panels/CategoryList.vue';
import ResourceDialog from '@/components/ResourceDialog.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    Turntable,
    StatsPanel,
    CategoryList,
    ResourceDialog,
  },
  data() {
    return {
      // 转盘旋转状态
      spinning: {
        project: false, // 项目转盘是否在旋转
        learning: false, // 学习转盘是否在旋转
      },
      // 当前选中的分类 ID
      selectedIds: {
        project: null, // 项目类选中的分类 ID
        learning: null, // 学习类选中的分类 ID
      },
      resourceDialogVisible: false, // 资源对话框显示状态
      activeCategory: null, // 当前激活的分类（用于编辑）
      // 完成度标签配置（可自定义）
      completionLabels: {
        uncompleted: '未完成',
        completed: '已完成',
      },
    };
  },
  computed: {
    ...mapGetters(['categoryList', 'currentCategoryIds']),
    // 所有分类列表
    categories() {
      return this.categoryList;
    },
    // 项目类分类列表
    projectCategories() {
      return this.categories.filter(item => item.type === 'project');
    },
    // 学习类分类列表
    learningCategories() {
      return this.categories.filter(item => item.type !== 'project');
    },
  },
  created() {
    // 初始化分类数据
    this.initializeCategories();
  },
  watch: {
    projectCategories: {
      handler(list) {
        if (!list.some(item => item.id === this.selectedIds.project)) {
          this.selectedIds.project = null;
        }
      },
      immediate: true,
    },
    learningCategories: {
      handler(list) {
        if (!list.some(item => item.id === this.selectedIds.learning)) {
          this.selectedIds.learning = null;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations(['addCategory', 'updateCategory']),
    ...mapActions(['initializeCategories', 'saveCategory', 'selectCategory', 'deleteCategory']),
    handleSpin(type) {
      if (this.spinning[type]) {
        return;
      }
      const list = type === 'project' ? this.projectCategories : this.learningCategories;
      if (!list.length) {
        this.$message.warning('请先添加方向');
        return;
      }
      this.spinning[type] = true;
      this.selectedIds[type] = null;
      this.$nextTick(() => {
        const random = this.randomCategory(type);
        if (random) {
          this.selectedIds[type] = random.id;
        }
      });
    },
    startSpin({ type, id }) {
      if (this.spinning[type]) {
        return;
      }
      this.spinning[type] = true;
      this.selectedIds[type] = null;
      this.$nextTick(() => {
        this.selectedIds[type] = id;
      });
    },
    handleSpinEnd(type, categoryId) {
      const list = type === 'project' ? this.projectCategories : this.learningCategories;
      const target = list.find(item => item.id === categoryId);
      if (target) {
        const typeLabel = type === 'project' ? '项目方向' : '学习方向';
        this.$notify({
          title: '抽取结果',
          message: `本次${typeLabel}：${target.label}`,
          type: 'success',
        });
        this.selectedIds[type] = categoryId;
      }
      this.selectCategory({ type, categoryId });
      this.spinning[type] = false;
    },
    randomCategory(type) {
      const list = type === 'project' ? this.projectCategories : this.learningCategories;
      if (!list.length) {
        return null;
      }
      const index = Math.floor(Math.random() * list.length);
      return list[index];
    },
    handleAddCategory(type) {
      const targetType = type || 'learning';
      this.$prompt('请输入新增方向的名称', '新增方向', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(({ value }) => {
          if (!value) {
            this.$message.warning('名称不能为空');
            return;
          }
          const newCategory = {
            id: `custom-${Date.now()}`,
            label: value,
            description: '请在详情中补充简介与资源',
            selected: false,
            type: targetType,
            resources: [],
          };
          // 先添加到本地状态，显示对话框
          this.addCategory(newCategory);
          this.activeCategory = { ...newCategory };
          this.resourceDialogVisible = true;
        })
        .catch(() => {});
    },
    openResourceDialog(category) {
      this.activeCategory = JSON.parse(JSON.stringify(category));
      this.resourceDialogVisible = true;
    },
    async saveCategoryResources(payload) {
      try {
        const normalized = {
          ...payload,
          type: payload.type || 'learning',
        };
        // 保存分类，可能会返回新的 ID（如果是从临时 ID 变为 UUID）
        const savedCategory = await this.saveCategory(normalized);

        // 更新 activeCategory 的 ID（如果 ID 发生了变化）
        if (savedCategory && savedCategory.id !== normalized.id) {
          this.activeCategory = { ...this.activeCategory, ...savedCategory };
        }

        this.$message.success('已保存学习资源');

        // 使用保存后的 ID（可能是新的 UUID）
        const finalId = savedCategory?.id || normalized.id;
        if (normalized.selected && finalId) {
          await this.selectCategory({ type: normalized.type, categoryId: finalId });
        }
      } catch (error) {
        console.error('Failed to save category:', error);
        this.$message.error('保存失败，请检查网络连接');
      }
    },
    async removeCategory(categoryId) {
      try {
        await this.deleteCategory(categoryId);
        this.$message.success('已删除分类');
      } catch (error) {
        console.error('Failed to delete category:', error);
        this.$message.error('删除失败，请检查网络连接');
      }
    },
    /**
     * 处理完成度状态变更
     * @param {Object} payload - 包含 resource 和 completed 的对象
     */
    handleCompletionChange(payload) {
      const { resource, completed } = payload;
      // 这里可以添加自定义逻辑，比如自动保存、统计等
      console.log('完成度变更:', resource.title, completed ? '已完成' : '未完成');
      // 如果需要自动保存，可以在这里调用保存方法
      // this.saveCategoryResources({ ...this.activeCategory });
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  padding: 40px 32px 64px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 60%);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(31, 56, 88, 0.12);
}

.content-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  margin-bottom: 32px;

  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 32px;
  }
}

.turntable {
  flex: none;
}

.stats {
  width: 100%;
  margin-bottom: 32px;
}
</style>
