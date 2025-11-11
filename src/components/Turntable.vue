<template>
  <div class="turntable-wrapper">
    <div class="wheel-header">
      <div class="wheel-title">
        <span>{{ title }}</span>
        <small v-if="subtitle">{{ subtitle }}</small>
      </div>
      <el-button
        type="primary"
        size="mini"
        round
        :disabled="disabled || !categories.length || isSpinning"
        :loading="isSpinning"
        @click="$emit('spin-request')"
      >
        {{ spinLabel }}
      </el-button>
    </div>
    <div class="wheel-container" :class="{ 'is-empty': !categories.length }">
      <div
        class="wheel"
        ref="wheel"
        :style="wheelStyle"
        :class="{ spinning: isSpinning }"
        @transitionend="handleTransitionEnd"
      >
        <template v-if="categories.length">
          <div class="wheel-label" v-for="segment in segments" :key="segment.id" :style="segment.labelStyle">
            <span :style="segment.badgeStyle">{{ segment.label }}</span>
          </div>
        </template>
        <div v-else class="wheel-placeholder">暂无数据</div>
        <div class="wheel-center">
          <span>{{ centerLabel }}</span>
        </div>
      </div>
      <div class="pointer">
        <i class="el-icon-caret-top" />
      </div>
    </div>
  </div>
</template>

<script>
// 预设转盘颜色，保证各个模块色彩区分明显
const palette = [
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399',
  '#36CFC9',
  '#B37FEB',
  '#FF9C6E',
  '#5C7CFA',
  '#13C2C2',
  '#F759AB',
];

const clampChannel = value => Math.max(0, Math.min(255, value));

const mixColor = (hex, amount) => {
  const normalized = hex.replace('#', '');
  const num = parseInt(normalized, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const adjust = channel => {
    return amount >= 0 ? clampChannel(channel + (255 - channel) * amount) : clampChannel(channel * (1 + amount));
  };
  const nr = adjust(r);
  const ng = adjust(g);
  const nb = adjust(b);
  const toHex = channel => channel.toString(16).padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
};

export default {
  name: 'Turntable',
  props: {
    title: {
      type: String,
      default: '学习转盘',
    },
    subtitle: {
      type: String,
      default: '',
    },
    categories: {
      type: Array,
      default: () => [],
    },
    spinning: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: String,
      default: null,
    },
    centerLabel: {
      type: String,
      default: '学习',
    },
    spinLabel: {
      type: String,
      default: '点击开始',
    },
  },
  data() {
    return {
      rotation: 0, // 转盘旋转角度
      isSpinning: false, // 是否正在旋转
      spinDuration: 4000, // 旋转动画持续时间（毫秒）
    };
  },
  computed: {
    /**
     * 计算每个扇区的角度
     * @returns {number} 扇区角度（度）
     */
    segmentAngle() {
      if (!this.categories || !this.categories.length) {
        return 0;
      }
      return 360 / this.categories.length;
    },
    /**
     * 计算转盘扇区数据
     * 为每个分类生成颜色、样式等信息
     * @returns {Array} 扇区数据数组
     */
    segments() {
      // 确保 categories 存在且是数组
      if (!this.categories || !Array.isArray(this.categories) || this.categories.length === 0) {
        return [];
      }
      return this.categories.map((category, index) => {
        // 计算扇区起始角度
        const start = this.segmentAngle * index;
        // 从调色板获取基础颜色
        const baseColor = `${palette[index % palette.length]}`;
        // 计算高光和阴影颜色
        const highlight = mixColor(baseColor, 0.35);
        const shadow = mixColor(baseColor, -0.25);
        // 计算标签旋转角度（使标签文字水平显示）
        const labelRotate = -(start + this.segmentAngle / 2);
        // 生成标签背景渐变
        const badgeBackground = `linear-gradient(140deg, ${mixColor(baseColor, -0.15)}, ${mixColor(baseColor, 0.35)})`;
        const textColor = '#ffffff';
        const borderColor = mixColor(baseColor, 0.5);
        return {
          ...category,
          baseColor,
          highlight,
          shadow,
          labelStyle: {
            transform: `rotate(${labelRotate}deg)`,
            '--segment-color': baseColor,
          },
          badgeStyle: {
            background: badgeBackground,
            color: textColor,
            boxShadow: `0 10px 24px ${mixColor(shadow, 0.35)}66`,
            borderColor,
          },
        };
      });
    },
    /**
     * 转盘样式计算属性
     * 确保始终返回有效的背景样式，避免背景消失
     * 关键：即使数据加载过程中 categories 为空，也返回默认背景，避免透明
     */
    wheelStyle() {
      // 默认背景色（蓝色渐变），确保即使数据加载时也有背景
      const defaultBackground = 'radial-gradient(circle at center, #dfe7ff, #a8bbff)';

      // 基础样式对象，确保背景始终存在
      const baseStyle = {
        backgroundColor: '#dfe7ff', // 备用背景色，确保背景始终可见
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transform: `translate(-50%, -50%) rotate(${this.rotation}deg)`,
        transitionDuration: `${this.isSpinning ? this.spinDuration : 0}ms`,
      };

      // 如果没有分类数据，使用默认背景
      if (
        !this.categories ||
        !Array.isArray(this.categories) ||
        !this.categories.length ||
        !this.segments ||
        !Array.isArray(this.segments) ||
        !this.segments.length
      ) {
        return {
          ...baseStyle,
          backgroundImage: defaultBackground,
          backgroundBlendMode: 'normal',
        };
      }

      try {
        // 计算每个扇区的渐变
        const gradient = this.segments
          .map((segment, index) => {
            const startDeg = this.segmentAngle * index;
            const midDeg = startDeg + this.segmentAngle / 2;
            const endDeg =
              index === this.segments.length - 1 && this.segments.length > 1 ? 360 : this.segmentAngle * (index + 1);
            return `${segment.highlight} ${startDeg}deg ${midDeg}deg, ${segment.shadow} ${midDeg}deg ${endDeg}deg`;
          })
          .join(', ');

        // 计算分隔线宽度
        const separatorWidth = Math.max(this.segmentAngle * 0.04, 1.5);

        // 创建分隔线渐变
        const separators = `repeating-conic-gradient(from -90deg, transparent 0deg ${Math.max(
          this.segmentAngle - separatorWidth,
          0
        )}deg, rgba(255, 255, 255, 0.55) ${Math.max(this.segmentAngle - separatorWidth, 0)}deg ${
          this.segmentAngle
        }deg)`;

        // 高光叠加层
        const highlightOverlay = `radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.45), transparent 60%)`;

        // 基础渐变（圆锥渐变）
        const baseGradient = `conic-gradient(from -90deg, ${gradient})`;

        // 组合所有背景层
        const backgroundImage = [highlightOverlay, separators, baseGradient].join(', ');

        return {
          ...baseStyle,
          backgroundImage,
          backgroundBlendMode: 'screen, normal, normal',
        };
      } catch (error) {
        // 如果计算失败，使用默认背景
        console.warn('转盘样式计算失败，使用默认背景:', error);
        return {
          ...baseStyle,
          backgroundImage: defaultBackground,
          backgroundBlendMode: 'normal',
        };
      }
    },
  },
  watch: {
    selectedId: {
      immediate: false,
      handler(newVal) {
        if (!newVal) {
          return;
        }
        // 当外部更新选中方向时，触发转盘旋转到对应扇区
        this.spinToCategory(newVal);
      },
    },
  },
  methods: {
    /**
     * 让转盘旋转到目标方向
     * @param {string} categoryId - 目标方向 ID
     */
    spinToCategory(categoryId) {
      const index = this.categories.findIndex(item => item.id === categoryId);
      if (index === -1) {
        return;
      }
      // 计算旋转角度：多圈旋转 + 目标扇区角度
      const baseRotation = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 圈
      const finalRotation = baseRotation + index * this.segmentAngle + this.segmentAngle / 2;
      this.isSpinning = false;
      this.$nextTick(() => {
        if (this.$refs.wheel) {
          // 强制重绘以重置动画
          void this.$refs.wheel.offsetWidth;
        }
        this.isSpinning = true;
        this.rotation = finalRotation;
        this.$emit('update:selectedId', categoryId);
      });
    },
    /**
     * 处理转盘旋转动画结束事件
     * @param {Event} event - 过渡结束事件
     */
    handleTransitionEnd(event) {
      if (event.target !== event.currentTarget || !this.isSpinning) {
        return;
      }
      // 动画完成后向父组件抛出最终结果
      this.isSpinning = false;
      this.$emit('spin-end', this.selectedId);
    },
  },
};
</script>

<style lang="less" scoped>
.turntable-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.wheel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 440px;
  padding: 0 12px;

  .wheel-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: 700;
    font-size: 18px;
    color: #303133;

    small {
      font-size: 12px;
      font-weight: 500;
      color: #909399;
    }
  }
}

.wheel-container {
  position: relative;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.9), rgba(210, 225, 255, 0.45));
  border-radius: 50%;
  box-shadow: 0 32px 60px rgba(31, 56, 88, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.wheel-container.is-empty {
  background: linear-gradient(145deg, #f6f8ff, #ffffff);
}

.wheel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 18px solid rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.9), 0 24px 54px rgba(31, 56, 88, 0.28);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.24, 0.78, 0.4, 0.96);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  /* 
   * 关键：设置默认背景色和背景图，确保即使内联样式未加载时也有背景
   * 这可以防止在数据加载过程中背景消失
   * 注意：内联样式（:style）会覆盖这些样式，但这里作为备用保障
   */
  background-color: #dfe7ff;
  background-image: radial-gradient(circle at center, #dfe7ff, #a8bbff);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    top: -10%;
    left: -10%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), transparent 60%);
    pointer-events: none;
    z-index: 1;
  }
}

.wheel-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  width: 52%;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
  pointer-events: none;

  span {
    display: inline-block;
    max-width: 180px;
    padding: 6px 14px;
    border-radius: 999px;
    transform: translateY(-162px);
    backdrop-filter: blur(2px);
    border: 2px solid rgba(255, 255, 255, 0.75);
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    font-weight: 700;
    transition: transform 0.3s ease;
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.45), 0 8px 16px rgba(0, 0, 0, 0.12);
    filter: saturate(1.1);
  }
}

.wheel-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #909399;
  font-weight: 600;
  letter-spacing: 1px;
  pointer-events: none;
}

.wheel-center {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #8aa2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 6px 12px rgba(255, 255, 255, 0.2);
  border: 6px solid rgba(255, 255, 255, 0.6);
}

.pointer {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 54px;
  height: 54px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff7a45, #ffbb66);
  border-radius: 50%;
  box-shadow: 0 10px 20px rgba(255, 122, 69, 0.4), inset 0 6px 10px rgba(255, 255, 255, 0.45);

  &::after {
    content: '';
    position: absolute;
    bottom: -18px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 18px solid #ff9269;
    filter: drop-shadow(0 4px 6px rgba(255, 122, 69, 0.35));
  }

  i {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    color: #ffffff;
    font-size: 24px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}
</style>
