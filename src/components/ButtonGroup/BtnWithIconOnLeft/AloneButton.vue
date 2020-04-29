<template>
  <span class="button-span-class" :style="buttonStyle()" @click="onClick">
    <span :style="labelStyle()">
      <i v-if="isChecked" class="el-icon-check i-class" />
      {{ label }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'AloneButton',
  props: {
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
    }
  },
  methods: {
    buttonStyle() {
      const background = this.isChecked ? '#0088DE' : '#13297A'
      const color = this.isChecked ? '#ffffff' : '#3172E0'
      const style = `width: ${this.width}px;height: ${this.height}px;line-height:${this.height}px;background: ${background};
      color: ${color};`
      return style
    },
    onClick() {
      this.$emit('on-click')
    },
    labelStyle() {
      const style = `font-size: ${this.labelFontSize}px;`
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-span-class{
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space:nowrap;
    background-size: cover;
    padding: 0 15px 0 30px;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .i-class{
    margin-right: 5px;
    position: absolute;
    left: 10px;
    top: 8px;
  }
</style>
