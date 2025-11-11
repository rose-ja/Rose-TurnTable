<template>
  <el-card class="app-header" shadow="hover">
    <div class="title">
      <span>学习方向转盘</span>
    </div>
    <div class="sub-title">项目与学习技能两套转盘，帮助你快速确定下一步计划</div>
  </el-card>
</template>

<script>
// 页面顶部简介及触发按钮
export default {
  name: 'AppHeader',
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
