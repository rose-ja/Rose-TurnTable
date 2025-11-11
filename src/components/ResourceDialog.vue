<template>
  <div class="resource-dialog-wrapper">
    <el-dialog
      width="900px"
      :visible.sync="dialogVisible"
      :title="form.label ? `资源详情 - ${form.label}` : '资源详情'"
      @close="handleClose"
      :close-on-click-modal="false"
      class="resource-dialog"
    >
      <el-form label-width="80px" size="small" class="resource-form">
        <el-form-item label="名称">
          <el-input v-model="form.label" placeholder="请输入学习方向名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择所属转盘">
            <el-option v-for="option in typeOptions" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入学习方向简介" />
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
        <el-table
          :data="form.resources"
          size="small"
          border
          empty-text="暂无资源"
          max-height="400"
          :show-overflow-tooltip="false"
        >
          <el-table-column label="资源名称" width="180" show-overflow-tooltip>
            <template #default="{ row }">
              <el-input v-model="row.title" placeholder="请输入名称" size="mini" class="resource-input" />
            </template>
          </el-table-column>
          <el-table-column label="资源链接" min-width="380">
            <template #default="{ row, $index }">
              <div class="link-cell">
                <el-input
                  v-model="row.link"
                  placeholder="https://example.com"
                  size="mini"
                  class="link-input"
                  @dblclick.native="showFullLink(row, $index)"
                  @focus="handleLinkFocus($event)"
                />
                <el-tooltip content="双击输入框或点击图标查看完整链接" placement="top">
                  <el-button
                    type="text"
                    size="mini"
                    icon="el-icon-view"
                    class="view-link-btn"
                    @click="showFullLink(row, $index)"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="form.selected"
            label="完成度"
            width="180"
            align="center"
            class-name="completion-column"
          >
            <template #default="{ row }">
              <completion-status
                :value="row.completed"
                @input="handleCompletionChange(row, $event)"
                :uncompleted-label="completionLabels.uncompleted"
                :completed-label="completionLabels.completed"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template #default="{ $index }">
              <el-button type="text" size="mini" @click="removeResource($index)" style="color: #f56c6c">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSave">保 存</el-button>
      </template>
    </el-dialog>

    <!-- 完整链接查看对话框 -->
    <el-dialog
      width="700px"
      title="查看完整链接"
      :visible.sync="linkDialogVisible"
      :close-on-click-modal="false"
      class="link-dialog"
    >
      <div class="link-viewer">
        <div class="link-info">
          <div class="link-label">资源名称：</div>
          <div class="link-value">{{ currentLinkTitle || '未命名资源' }}</div>
        </div>
        <div class="link-info">
          <div class="link-label">完整链接：</div>
          <el-input :value="currentLink" readonly type="textarea" :rows="5" class="link-textarea" ref="linkTextarea" />
          <div class="link-hint">💡 提示：可以在此文本框中选中并复制链接，或使用下方按钮</div>
        </div>
      </div>
      <template #footer>
        <el-button size="small" @click="linkDialogVisible = false">关 闭</el-button>
        <el-button size="small" @click="copyLink">复制链接</el-button>
        <el-button type="primary" size="small" @click="openLink">打开链接</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CompletionStatus from './CompletionStatus.vue';

/**
 * 资源详情对话框组件
 * 支持编辑分类和资源信息
 */
export default {
  name: 'ResourceDialog',
  components: {
    CompletionStatus,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Object,
      default: null,
    },
    // 完成度标签配置（从父组件传递）
    completionLabels: {
      type: Object,
      default: () => ({
        uncompleted: '未完成',
        completed: '已完成',
      }),
    },
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        id: '',
        label: '',
        description: '',
        type: 'learning',
        selected: false,
        resources: [],
      },
      typeOptions: [
        { label: '项目方向转盘', value: 'project' },
        { label: '学习技能转盘', value: 'learning' },
      ],
      linkDialogVisible: false, // 完整链接对话框显示状态
      currentLink: '', // 当前显示的完整链接
      currentLinkTitle: '', // 当前链接对应的资源名称
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
      },
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
      },
    },
  },
  methods: {
    addResource() {
      // 默认新增一条空资源，等待用户补充标题与链接
      this.form.resources.push({
        id: `resource-${Date.now()}`,
        title: '',
        link: '',
        completed: false,
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
      if (!this.form.type) {
        this.$message.warning('请选择所属转盘');
        return;
      }
      // 仅保留填写完整的资源条目，并确保每条都有完成状态
      const resources = this.form.resources
        .filter(item => item.title && item.link)
        .map(item => ({
          ...item,
          id: item.id || `resource-${Date.now()}`,
          completed: Boolean(item.completed),
        }));
      this.$emit('save', {
        ...this.form,
        resources,
      });
      this.dialogVisible = false;
    },
    // 统一转化 category 数据，兼容历史字段并补齐布尔值
    normalizeForm(payload) {
      const cloned = JSON.parse(JSON.stringify(payload));
      cloned.selected = Boolean(cloned.selected);
      cloned.type = cloned.type || 'learning';
      cloned.resources = (cloned.resources || []).map(item => ({
        ...item,
        completed: Boolean(item.completed),
      }));
      this.form = cloned;
    },
    /**
     * 显示完整链接
     * @param {Object} row - 资源行数据
     * @param {number} index - 资源索引
     */
    showFullLink(row, index) {
      if (!row.link || !row.link.trim()) {
        this.$message.info('该资源链接为空');
        return;
      }
      this.currentLink = row.link.trim();
      this.currentLinkTitle = row.title || `资源 ${index + 1}`;
      this.linkDialogVisible = true;
      // 在对话框显示后，自动选中链接文本，方便用户复制
      this.$nextTick(() => {
        if (this.$refs.linkTextarea && this.$refs.linkTextarea.$refs && this.$refs.linkTextarea.$refs.textarea) {
          const textarea = this.$refs.linkTextarea.$refs.textarea;
          textarea.select();
        }
      });
    },
    /**
     * 复制链接到剪贴板
     * 使用现代 Clipboard API，如果不可用则回退到 execCommand
     */
    async copyLink() {
      if (!this.currentLink) {
        return;
      }

      try {
        // 优先使用现代 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.currentLink);
          this.$message.success('链接已复制到剪贴板');
        } else {
          // 回退到传统方法
          const textarea = document.createElement('textarea');
          textarea.value = this.currentLink;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          this.$message.success('链接已复制到剪贴板');
        }
      } catch (err) {
        console.error('复制失败:', err);
        this.$message.error('复制失败，请手动复制');
      }
    },
    /**
     * 打开链接
     */
    openLink() {
      if (!this.currentLink) {
        return;
      }
      // 确保链接有协议前缀
      let url = this.currentLink.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    },
    /**
     * 处理链接输入框获得焦点事件
     * 选中输入框中的文本，方便用户查看和编辑
     */
    handleLinkFocus(event) {
      // 延迟选中，确保输入框已获得焦点
      this.$nextTick(() => {
        if (event && event.target) {
          event.target.select();
        }
      });
    },
    /**
     * 处理完成度状态变更
     * @param {Object} row - 资源行数据
     * @param {Boolean} completed - 新的完成状态
     */
    handleCompletionChange(row, completed) {
      row.completed = completed;
      // 触发变更事件，方便父组件监听
      this.$emit('completion-change', {
        resource: row,
        completed,
      });
    },
  },
};
</script>

<style lang="less" scoped>
// 包裹根元素样式（Vue 2 要求单一根元素）
.resource-dialog-wrapper {
  display: contents; // 让包裹元素不参与布局，仅作为语法要求
}

.resource-form {
  margin-bottom: 16px;

  :deep(.el-select) {
    width: 100%;
  }
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

  // 链接单元格样式
  .link-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .link-input {
      flex: 1;
      min-width: 0; // 确保 flex 布局中能够正确收缩
    }

    .view-link-btn {
      flex-shrink: 0;
      padding: 0 4px;
      font-size: 16px;
      color: #409eff;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #66b1ff;
      }

      &:active {
        color: #3a8ee6;
      }
    }
  }

  // 资源输入框样式
  .resource-input {
    width: 100%;
  }
}

// 链接查看器样式
.link-viewer {
  .link-info {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .link-label {
      font-weight: 600;
      color: #606266;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .link-value {
      padding: 12px;
      background-color: #f5f7fa;
      border-radius: 4px;
      word-break: break-all;
      line-height: 1.6;
      font-size: 14px;
      color: #303133;
      min-height: 20px;
    }

    .link-textarea {
      margin-top: 8px;

      :deep(.el-textarea__inner) {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #409eff;
        background-color: #f5f7fa;
        border: 1px solid #dcdfe6;
        cursor: text;
        resize: vertical;
        line-height: 1.6;
        word-break: break-all;
      }
    }

    .link-hint {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
      font-style: italic;
    }
  }
}

// 弹窗样式优化
:deep(.resource-dialog) {
  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .el-table {
    width: 100%;

    .el-table__body-wrapper {
      max-height: 400px;
      overflow-y: auto;
    }

    // 确保表格列宽正确分配
    .el-table__header-wrapper,
    .el-table__body-wrapper {
      width: 100% !important;
    }

    // 增加表格行高
    .el-table__row {
      height: auto;
      min-height: 56px; // 增加最小行高

      td {
        padding: 12px 0; // 增加单元格内边距
        vertical-align: middle;
      }
    }

    // 完成度列特殊样式
    .completion-column {
      .cell {
        padding: 8px 12px; // 增加完成度列的内边距
        min-height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    // 表格头部样式
    .el-table__header {
      th {
        padding: 12px 0;
        background-color: #fafafa;
        font-weight: 600;
        color: #606266;
      }
    }
  }
}

// 链接查看对话框样式优化
:deep(.link-dialog) {
  .el-dialog__body {
    padding: 20px;
  }
}
</style>
