<template>
  <div class="turntable-wrapper">
    <div class="wheel-container">
      <div
        class="wheel"
        ref="wheel"
        :style="wheelStyle"
        :class="{ spinning: isSpinning }"
        @transitionend="handleTransitionEnd"
      >
        <div class="wheel-label" v-for="segment in segments" :key="segment.id" :style="segment.labelStyle">
          <span>{{ segment.label }}</span>
        </div>
        <div class="wheel-center">
          <span>学习</span>
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
  '#F759AB'
];

const clampChannel = (value) => Math.max(0, Math.min(255, value));

const mixColor = (hex, amount) => {
  const normalized = hex.replace('#', '');
  const num = parseInt(normalized, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const adjust = (channel) =>
    amount >= 0
      ? clampChannel(channel + (255 - channel) * amount)
      : clampChannel(channel * (1 + amount));
  const nr = adjust(r);
  const ng = adjust(g);
  const nb = adjust(b);
  const toHex = (channel) => channel.toString(16).padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
};

export default {
  name: 'Turntable',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    spinning: {
      type: Boolean,
      default: false
    },
    selectedId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      rotation: 0,
      isSpinning: false,
      spinDuration: 4000
    };
  },
  computed: {
    segmentAngle() {
      if (!this.categories.length) {
        return 0;
      }
      return 360 / this.categories.length;
    },
    segments() {
      return this.categories.map((category, index) => {
        const start = this.segmentAngle * index;
        const baseColor = `${palette[index % palette.length]}`;
        const highlight = mixColor(baseColor, 0.35);
        const shadow = mixColor(baseColor, -0.25);
        const labelRotate = -(start + this.segmentAngle / 2);
        return {
          ...category,
          baseColor,
          highlight,
          shadow,
          labelStyle: {
            transform: `rotate(${labelRotate}deg)`
          }
        };
      });
    },
    wheelStyle() {
      const gradient = this.segments
        .map((segment, index) => {
          const startDeg = this.segmentAngle * index;
          const midDeg = startDeg + this.segmentAngle / 2;
          const endDeg =
            index === this.segments.length - 1 && this.segments.length > 1
              ? 360
              : this.segmentAngle * (index + 1);
          return `${segment.highlight} ${startDeg}deg ${midDeg}deg, ${segment.shadow} ${midDeg}deg ${endDeg}deg`;
        })
        .join(', ');

      return {
        backgroundImage: this.segments.length
          ? `conic-gradient(from -90deg, ${gradient})`
          : 'radial-gradient(circle at center, #dfe7ff, #a8bbff)',
        transform: `translate(-50%, -50%) rotate(${this.rotation}deg)`,
        transitionDuration: `${this.isSpinning ? this.spinDuration : 0}ms`
      };
    }
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
      }
    }
  },
  methods: {
    /**
     * 让转盘旋转到目标方向
     * @param {string} categoryId 目标方向 id
     */
    spinToCategory(categoryId) {
      const index = this.categories.findIndex((item) => item.id === categoryId);
      if (index === -1) {
        return;
      }
      const baseRotation = 360 * (5 + Math.floor(Math.random() * 3));
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
    handleTransitionEnd(event) {
      if (event.target !== event.currentTarget || !this.isSpinning) {
        return;
      }
      // 动画完成后向父组件抛出最终结果
      this.isSpinning = false;
      this.$emit('spin-end', this.selectedId);
    }
  }
};
</script>

<style lang="less" scoped>
.turntable-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}

.wheel-container {
  position: relative;
  width: 360px;
  height: 360px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.85), rgba(210, 225, 255, 0.55));
  border-radius: 50%;
  box-shadow: 0 25px 50px rgba(31, 56, 88, 0.2);
}

.wheel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 16px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    inset 0 0 20px rgba(255, 255, 255, 0.9),
    0 18px 40px rgba(31, 56, 88, 0.25);
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.24, 0.78, 0.4, 0.96);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

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
  }
}

.wheel-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  width: 48%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  pointer-events: none;

  span {
    display: inline-block;
    width: 100%;
    transform: translateY(-140px);
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
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
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff7a45, #ffbb66);
  border-radius: 50%;
  box-shadow:
    0 10px 20px rgba(255, 122, 69, 0.4),
    inset 0 6px 10px rgba(255, 255, 255, 0.45);

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

