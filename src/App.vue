<template>
  <div class="app-container">
    <app-header :spinning="spinning" @spin="handleSpin" />

    <div class="content-grid">
      <turntable
        class="turntable"
        :categories="categories"
        :spinning="spinning"
        :selected-id="selectedId"
        @update:selectedId="selectedId = $event"
        @spin-end="handleSpinEnd"
      />
      <stats-panel class="stats" :categories="categories" />
    </div>

    <category-list
      :categories="categories"
      :current-id="currentCategoryId"
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
      spinning: false,
      selectedId: null,
      resourceDialogVisible: false,
      activeCategory: null
    };
  },
  computed: {
    ...mapGetters(['categoryList', 'currentCategoryId', 'currentCategory']),
    categories() {
      // 统一出口，便于后续在本组件中添加额外计算
      return this.categoryList;
    }
  },
  created() {
    this.initializeCategories();
  },
  methods: {
    ...mapMutations(['addCategory', 'removeCategory', 'updateCategory']),
    ...mapActions(['initializeCategories', 'saveCategory', 'selectCategory']),
    async handleSpin() {
      if (!this.categories.length) {
        this.$message.warning('请先添加学习方向');
        return;
      }
      // 先清空选中 id，等待转盘完成动画后再填充
      this.spinning = true;
      this.selectedId = null;
      await this.$nextTick();
      this.selectedId = this.randomCategory().id;
    },
    startSpin(categoryId) {
      this.spinning = true;
      this.selectedId = null;
      this.$nextTick(() => {
        this.selectedId = categoryId;
      });
    },
    handleSpinEnd(categoryId) {
      const target = this.categories.find((item) => item.id === categoryId);
      if (target) {
        this.$notify({
          title: '抽取结果',
          // 使用模板字符串展示结果
          message: `本次学习方向：${target.label}`,
          type: 'success'
        });
      }
      this.selectCategory(categoryId);
      this.spinning = false;
    },
    randomCategory() {
      const index = Math.floor(Math.random() * this.categories.length);
      return this.categories[index];
    },
    handleAddCategory() {
      this.$prompt('请输入新增学习方向的名称', '新增方向', {
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
      this.updateCategory(payload);
      await this.saveCategory(payload);
      this.$message.success('已保存学习资源');
      if (payload.selected) {
        this.selectCategory(payload.id);
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
    gap: 32px;
  }
}

.turntable {
  flex: none;
}

.stats {
  flex: 1;
  width: 100%;
}
</style>

