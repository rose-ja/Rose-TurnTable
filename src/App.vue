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
      @save="saveCategoryResources"
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
    ResourceDialog
  },
  data() {
    return {
      spinning: {
        project: false,
        learning: false
      },
      selectedIds: {
        project: null,
        learning: null
      },
      resourceDialogVisible: false,
      activeCategory: null
    };
  },
  computed: {
    ...mapGetters(['categoryList', 'currentCategoryIds']),
    categories() {
      // 统一出口，便于后续在本组件中添加额外计算
      return this.categoryList;
    },
    projectCategories() {
      return this.categories.filter((item) => item.type === 'project');
    },
    learningCategories() {
      return this.categories.filter((item) => item.type !== 'project');
    }
  },
  created() {
    this.initializeCategories();
  },
  watch: {
    projectCategories: {
      handler(list) {
        if (!list.some((item) => item.id === this.selectedIds.project)) {
          this.selectedIds.project = null;
        }
      },
      immediate: true
    },
    learningCategories: {
      handler(list) {
        if (!list.some((item) => item.id === this.selectedIds.learning)) {
          this.selectedIds.learning = null;
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['addCategory', 'removeCategory', 'updateCategory']),
    ...mapActions(['initializeCategories', 'saveCategory', 'selectCategory']),
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
      const target = list.find((item) => item.id === categoryId);
      if (target) {
        const typeLabel = type === 'project' ? '项目方向' : '学习方向';
        this.$notify({
          title: '抽取结果',
          message: `本次${typeLabel}：${target.label}`,
          type: 'success'
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
        cancelButtonText: '取消'
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
            resources: []
          };
          this.addCategory(newCategory);
          this.activeCategory = newCategory;
          this.resourceDialogVisible = true;
        })
        .catch(() => {});
    },
    openResourceDialog(category) {
      this.activeCategory = JSON.parse(JSON.stringify(category));
      this.resourceDialogVisible = true;
    },
    async saveCategoryResources(payload) {
      const normalized = {
        ...payload,
        type: payload.type || 'learning'
      };
      this.updateCategory(normalized);
      await this.saveCategory(normalized);
      this.$message.success('已保存学习资源');
      if (normalized.selected) {
        this.selectCategory({ type: normalized.type, categoryId: normalized.id });
      }
    }
  }
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

