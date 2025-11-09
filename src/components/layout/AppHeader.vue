<template>
  <el-card class="app-header" shadow="hover">
    <div class="title">
      <span>学习方向转盘</span>
      <el-button type="primary" :loading="spinning" @click="$emit('spin')">
        {{ spinning ? '正在抽取...' : '点击开始' }}
      </el-button>
    </div>
    <div class="sub-title">抽到哪个方向，就优先学习该方向的内容</div>
  </el-card>
</template>

<script>
// 页面顶部简介及触发按钮
export default {
  name: 'AppHeader',
  props: {
    spinning: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="less" scoped>
.app-header {
  margin-bottom: 32px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffffff, #f6f9ff);
  box-shadow: 0 15px 35px rgba(31, 56, 88, 0.1);

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 22px;
    font-weight: 700;
    color: #303133;
    letter-spacing: 1px;
  }

  .sub-title {
    margin-top: 12px;
    color: #909399;
  }
}
</style>

