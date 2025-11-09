<template>
  <el-dialog
    width="640px"
    :visible.sync="dialogVisible"
    :title="form.label ? `资源详情 - ${form.label}` : '资源详情'"
    @close="handleClose"
  >
    <el-form label-width="80px" size="small" class="resource-form">
      <el-form-item label="名称">
        <el-input v-model="form.label" placeholder="请输入学习方向名称" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="请输入学习方向简介"
        />
      </el-form-item>
    </el-form>

    <el-alert
      :title="form.selected ? '当前状态：已选中（正在重点学习）' : '当前状态：未选中'"
      :type="form.selected ? 'success' : 'info'"
      show-icon
      class="status-alert"
    />

    <div class="resource-section">
      <div class="section-header">
        <span>学习资源</span>
        <el-button size="mini" type="primary" @click="addResource">新增资源</el-button>
      </div>
      <el-table :data="form.resources" size="small" border empty-text="暂无资源">
        <el-table-column label="资源名称">
          <template #default="{ row }">
            <el-input v-model="row.title" placeholder="请输入名称" />
          </template>
        </el-table-column>
        <el-table-column label="资源链接">
          <template #default="{ row }">
            <el-input v-model="row.link" placeholder="https://example.com" />
          </template>
        </el-table-column>
        <el-table-column v-if="form.selected" label="完成度" width="160">
          <template #default="{ row }">
            <el-radio-group v-model="row.completed">
              <el-radio :label="false">未完成</el-radio>
              <el-radio :label="true">已完成</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ $index }">
            <el-button type="text" @click="removeResource($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSave">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'ResourceDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    category: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        id: '',
        label: '',
        description: '',
        selected: false,
        resources: []
      }
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        this.dialogVisible = value;
        if (value && this.category) {
          this.normalizeForm(this.category);
        }
      }
    },
    dialogVisible(value) {
      this.$emit('update:visible', value);
    },
    category: {
      deep: true,
      handler(value) {
        if (this.dialogVisible && value) {
          this.normalizeForm(value);
        }
      }
    }
  },
  methods: {
    addResource() {
      // 默认新增一条空资源，等待用户补充标题与链接
      this.form.resources.push({
        id: `resource-${Date.now()}`,
        title: '',
        link: '',
        completed: false
      });
    },
    removeResource(index) {
      this.form.resources.splice(index, 1);
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleSave() {
      if (!this.form.label) {
        this.$message.warning('请填写学习方向名称');
        return;
      }
      // 仅保留填写完整的资源条目，并确保每条都有完成状态
      const resources = this.form.resources
        .filter((item) => item.title && item.link)
        .map((item) => ({
          ...item,
          id: item.id || `resource-${Date.now()}`,
          completed: Boolean(item.completed)
        }));
      this.$emit('save', {
        ...this.form,
        resources
      });
      this.dialogVisible = false;
    },
    // 统一转化 category 数据，兼容历史字段并补齐布尔值
    normalizeForm(payload) {
      const cloned = JSON.parse(JSON.stringify(payload));
      cloned.selected = Boolean(cloned.selected);
      cloned.resources = (cloned.resources || []).map((item) => ({
        ...item,
        completed: Boolean(item.completed)
      }));
      this.form = cloned;
    }
  }
};
</script>

<style lang="less" scoped>
.resource-form {
  margin-bottom: 16px;
}

.status-alert {
  margin-bottom: 16px;
}

.resource-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .el-input {
    width: 100%;
  }
}
</style>

