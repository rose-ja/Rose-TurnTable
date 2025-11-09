<template>
  <el-card class="category-panel" shadow="never">
    <div class="panel-header">
      <span>学习方向列表</span>
      <el-button type="primary" size="mini" @click="$emit('add')">新增方向</el-button>
    </div>
    <el-table :data="categories" border :row-class-name="rowClassName">
      <el-table-column prop="label" label="名称" />
      <el-table-column prop="description" label="简介" show-overflow-tooltip />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button size="mini" @click="$emit('detail', row)">详情</el-button>
          <el-button size="mini" type="primary" @click="$emit('spin', row.id)">直接抽中</el-button>
          <el-popconfirm title="确定删除该方向吗？" @confirm="$emit('remove', row.id)">
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'CategoryList',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: String,
      default: null
    }
  },
  methods: {
    rowClassName({ row }) {
      // 用绿色背景强调当前正在学习的方向
      return row.id === this.currentId ? 'is-selected-row' : '';
    }
  }
};
</script>

<style lang="less" scoped>
.category-panel {
  border-radius: 16px;
  border: 1px solid #e5e9f2;
  box-shadow: 0 10px 24px rgba(31, 56, 88, 0.08);

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 16px;
  }
}

:deep(.is-selected-row) {
  background-color: #f0f9eb;

  td {
    color: #409eff;
  }
}
</style>

