<template>
  <div class="completion-status">
    <el-radio-group
      :value="value"
      @input="handleChange"
      size="small"
      class="completion-radio-group"
      :disabled="disabled"
    >
      <el-radio :label="false" class="completion-radio">
        <span class="radio-label">{{ uncompletedLabel }}</span>
      </el-radio>
      <el-radio :label="true" class="completion-radio">
        <span class="radio-label">{{ completedLabel }}</span>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
/**
 * 完成度状态组件
 * 支持父组件传递数据和控制
 */
export default {
  name: 'CompletionStatus',
  props: {
    // 完成状态值
    value: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 未完成标签文本
    uncompletedLabel: {
      type: String,
      default: '未完成',
    },
    // 已完成标签文本
    completedLabel: {
      type: String,
      default: '已完成',
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * 处理状态变更
     * @param {Boolean} newValue - 新的完成状态
     */
    handleChange(newValue) {
      this.$emit('input', newValue);
      this.$emit('change', newValue);
    },
  },
};
</script>

<style lang="less" scoped>
.completion-status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px; // 增加最小高度，避免被挤压
  padding: 8px 0;
}

.completion-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-height: 48px; // 确保单选按钮组有足够的高度
}

.completion-radio {
  margin: 0;
  height: auto;
  line-height: 1.8;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }

  :deep(.el-radio__input) {
    margin-right: 8px;

    .el-radio__inner {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }
  }

  :deep(.el-radio__label) {
    padding-left: 0;
    font-size: 13px;
    color: #606266;
    white-space: nowrap;
  }

  // 选中状态样式
  &.is-checked {
    .radio-label {
      color: #409eff;
      font-weight: 500;
    }

    :deep(.el-radio__label) {
      color: #409eff;
    }
  }

  // 禁用状态样式
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }
}

.radio-label {
  display: inline-block;
  line-height: 1.6;
  user-select: none;
}
</style>
