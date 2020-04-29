<template>
  <span id="spanId" class="button-span-class" :style="buttonStyle()" @click="onClick">
    <span class="number-span-class" :style="numberStyle()">{{ number }}</span>
    <span class="label-span-class" :style="labelStyle()">{{ label }}</span>
  </span>
</template>

<script>
export default {
  name: 'AloneButton',
  props: {
    number: {
      type: [Number, String],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    // 按钮的宽度
    width: {
      type: [Number, String],
      default: '160'
    },
    // 按钮的高度
    height: {
      type: [Number, String],
      default: '40'
    },
    // 数字字体大小
    numberFontSize: {
      type: [Number, String],
      default: '23'
    },
    // 文字字体大小
    labelFontSize: {
      type: [Number, String],
      default: '15'
    },
    // 是否被选中
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedBg: require('@/assets/images/selected.png')
    }
  },
  methods: {
    buttonStyle() {
      const background = this.isChecked ? 'url(' + this.selectedBg + ')' + ' center/100%' : '#13297A'
      const color = this.isChecked ? '#ffffff' : '#3172E0'
      const style = `width: ${this.width}px;height: ${this.height}px;line-height:${this.height}px;background: ${background};
      color: ${color};`
      return style
    },
    onClick() {
      this.$emit('on-click')
    },
    numberStyle() {
      const style = `font-size: ${this.numberFontSize}px`
      return style
    },
    labelStyle() {
      const style = `font-size: ${this.labelFontSize}px`
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-span-class{
    cursor: pointer;
    padding: 0 10px;
    user-select: none;
    display: inline-block;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space:nowrap;
    background-size: cover;
  }
  .number-span-class{
  }
  .label-span-class{
    margin-left: 10px;
  }
</style>
