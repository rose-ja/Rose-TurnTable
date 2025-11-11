<template>
  <div class="stat-item">
    <div class="icon">
      <i :class="icon" />
    </div>
    <div class="content">
      <div class="value">{{ value }}</div>
      <div class="label">{{ label }}</div>
    </div>
  </div>
</template>

<script>
// 展示单个统计指标的小卡片组件
export default {
  name: 'StatItem',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: 0,
    },
    icon: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
.stat-item {
  display: flex;
  align-items: center;
  background: #f9fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(64, 158, 255, 0.12);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(31, 56, 88, 0.12);
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #409eff, #67c23a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    margin-right: 16px;
  }

  .content {
    .value {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      line-height: 1.2;
    }

    .label {
      font-size: 13px;
      color: #909399;
    }
  }
}
</style>
