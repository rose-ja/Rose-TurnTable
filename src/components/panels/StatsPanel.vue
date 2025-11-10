<template>
  <el-card class="stats-panel" shadow="never">
    <div class="panel-head">
      <div class="title">学习概览</div>
      <div class="tag-group">
        <el-tag
          effect="dark"
          :type="statistics.currentProjectLabel ? 'success' : 'info'"
        >
          项目转盘：{{ statistics.currentProjectLabel || '未选中' }}
        </el-tag>
        <el-tag
          effect="dark"
          :type="statistics.currentLearningLabel ? 'warning' : 'info'"
        >
          学习转盘：{{ statistics.currentLearningLabel || '未选中' }}
        </el-tag>
      </div>
    </div>
    <el-row :gutter="16">
      <el-col :xs="12" :sm="6">
        <stat-item label="方向总数" :value="statistics.categoryCount" icon="el-icon-collection" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <stat-item label="资源总数" :value="statistics.resourceCount" icon="el-icon-reading" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <stat-item label="自定义方向" :value="statistics.customCategoryCount" icon="el-icon-edit-outline" />
      </el-col>
      <el-col :xs="12" :sm="6">
        <stat-item label="完成资源" :value="statistics.completedResources" icon="el-icon-success" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import StatItem from './StatItem.vue';

export default {
  name: 'StatsPanel',
  components: {
    StatItem
  },
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    currentIds: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    statistics() {
      // 计算学习概览数据，便于面板展示
      const categoryCount = this.categories.length;
      const resourceCount = this.categories.reduce((total, item) => total + (item.resources?.length || 0), 0);
      const customCategoryCount = this.categories.filter((item) => item.id && item.id.startsWith('custom-')).length;
      const completedResources = this.categories.reduce(
        (total, item) => total + (item.resources?.filter((resource) => resource.completed).length || 0),
        0
      );
      const projectCategories = this.categories.filter((item) => item.type === 'project');
      const learningCategories = this.categories.filter((item) => item.type !== 'project');
      const currentProject = projectCategories.find(
        (item) => item.id === this.currentIds?.project || item.selected
      );
      const currentLearning = learningCategories.find(
        (item) => item.id === this.currentIds?.learning || item.selected
      );
      return {
        categoryCount,
        resourceCount,
        customCategoryCount,
        completedResources,
        currentProjectLabel: currentProject?.label || '',
        currentLearningLabel: currentLearning?.label || ''
      };
    }
  }
};
</script>

<style lang="less" scoped>
.stats-panel {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff, #f6f9ff);
  border: 1px solid #e5e9f2;
  border-radius: 16px;
  padding: 20px;

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;

    .title {
      font-weight: 600;
      font-size: 16px;
      color: #303133;
    }

    .tag-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
  }
}
</style>

