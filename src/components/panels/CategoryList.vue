<template>
  <el-card class="category-panel" shadow="never">
    <div class="panel-header">
      <span>方向列表管理</span>
    </div>

    <div class="category-group">
      <div class="group-header">
        <span>项目方向转盘</span>
        <el-button type="primary" size="mini" @click="$emit('add', 'project')">新增项目方向</el-button>
      </div>
      <el-table
        :data="projectCategories"
        border
        empty-text="暂无项目方向"
        :row-class-name="args => rowClassName(args, 'project')"
      >
        <el-table-column prop="label" label="名称" />
        <el-table-column prop="description" label="简介" show-overflow-tooltip />
        <el-table-column label="操作" width="260">
          <template #default="{ row }">
            <el-button size="mini" @click="$emit('detail', row)">详情</el-button>
            <el-button size="mini" type="primary" @click="$emit('spin', { type: 'project', id: row.id })">
              直接抽中
            </el-button>
            <el-popconfirm title="确定删除该方向吗？" @confirm="$emit('remove', row.id)">
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="category-group">
      <div class="group-header">
        <span>学习技能转盘</span>
        <el-button type="primary" size="mini" @click="$emit('add', 'learning')">新增学习方向</el-button>
      </div>
      <el-table
        :data="learningCategories"
        border
        empty-text="暂无学习方向"
        :row-class-name="args => rowClassName(args, 'learning')"
      >
        <el-table-column prop="label" label="名称" />
        <el-table-column prop="description" label="简介" show-overflow-tooltip />
        <el-table-column label="操作" width="260">
          <template #default="{ row }">
            <el-button size="mini" @click="$emit('detail', row)">详情</el-button>
            <el-button size="mini" type="primary" @click="$emit('spin', { type: 'learning', id: row.id })">
              直接抽中
            </el-button>
            <el-popconfirm title="确定删除该方向吗？" @confirm="$emit('remove', row.id)">
              <el-button size="mini" type="danger" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'CategoryList',
  props: {
    projectCategories: {
      type: Array,
      default: () => [],
    },
    learningCategories: {
      type: Array,
      default: () => [],
    },
    currentIds: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    rowClassName({ row }, type) {
      // 用绿色背景强调当前正在学习的方向
      return row.id === this.currentIds?.[type] ? 'is-selected-row' : '';
    },
  },
};
</script>

<style lang="less" scoped>
.category-panel {
  border-radius: 16px;
  border: 1px solid #e5e9f2;
  box-shadow: 0 10px 24px rgba(31, 56, 88, 0.08);

  .panel-header {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 12px;
  }
}

.category-group {
  & + .category-group {
    margin-top: 24px;
  }

  .group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 15px;
  }
}

:deep(.is-selected-row) {
  background-color: #f0f9eb;

  td {
    color: #409eff;
  }
}
</style>
