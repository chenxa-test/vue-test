<template>
  <span id="spanId" class="button-span-class" :style="buttonStyle()" @click="onClick">
    <div class="flex-wrap">
      <div class="number-span-class" :style="numberStyle()">{{ number }}</div>
      <div class="label-span-class" :style="labelStyle()">{{ label }}</div>
    </div>
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
      default: '70'
    },
    // 按钮的高度
    height: {
      type: [Number, String],
      default: '70'
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
      selectedBg: require('@/assets/images/selected-square.png')
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
    user-select: none;
    display: inline-block;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space:nowrap;
    padding: 0 10px;
  }
  .flex-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    flex-direction: column;
  }
  .number-span-class{
    font-family:DIN Alternate;
    font-weight:bold;
    line-height:32px;
    display: block;
  }
  .label-span-class{
    font-family:PingFang SC;
    font-weight:400;
    line-height:32px;
    opacity:0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space:nowrap;
    width: 100%;
  }
</style>
