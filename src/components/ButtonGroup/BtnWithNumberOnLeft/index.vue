<template>
  <div>
    <span id="buttonSpanId" class="button-span-class">
      <div
        v-for="row in defaultShowRowCount"
        :key="row"
        class="row-class"
      >
        <span
          v-for="column in defaultShowColumnCount"
          :key="column.toString() + row.toString()"
          :style="getColumnStyle(column)"
        >
          <alone-button
            v-if="row <= dyadicArray.length && column <= dyadicArray[row - 1].length"
            :number="dyadicArray[row - 1][column - 1][numberField]"
            :label="dyadicArray[row - 1][column - 1][labelField]"
            :is-checked="isChecked(row, column)"
            :width="width"
            :height="height"
            :label-font-size="labelFontSize"
            :number-font-size="numberFontSize"
            @on-click="onClick(row, column)"
          />
        </span>
      </div>
    </span>
    <el-popover
      v-if="isShow"
      placement="right"
      trigger="click"
      popper-class="more-popover"
    >
      <div>
        <span
          v-for="(item, index) in options"
          :key="index"
          :style="getColumnStyle((index + 1) % 4)"
        >
          <alone-button
            :number="item[numberField]"
            :label="item[labelField]"
            :is-checked="isChecked2(index)"
            :width="width"
            :height="height"
            :label-font-size="labelFontSize"
            :number-font-size="numberFontSize"
            @on-click="onClick2(index)"
          />
          <br v-if="(index + 1) % 4 === 0">
        </span>
      </div>
      <div
        v-if="options.length > defaultShowColumnCount * defaultShowRowCount"
        slot="reference"
        class="btn-wrap"
        :style="moreButtonStyle"
      >
        <i class="el-icon-arrow-right next" />
      </div>
    </el-popover>
  </div>
</template>

<script>
import AloneButton from './AloneButton'
export default {
  name: 'MultiRowAndColumn',
  components: {
    AloneButton
  },
  model: {
    prop: 'data',
    event: 'change'
  },
  props: {
    // 已选中的数据
    data: {
      type: Array,
      default() { return [] }
    },
    // 全部选项
    options: {
      type: Array,
      default() {
        return []
      }
    },
    // 默认显示的行数
    defaultShowRowCount: {
      type: Number,
      default: 2
    },
    // 默认显示的列数
    defaultShowColumnCount: {
      type: Number,
      default: 2
    },
    width: {
      type: [Number, String],
      default: '160'
    },
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
    // 数字对应的字段名
    numberField: {
      type: String,
      default: 'number'
    },
    // 文字对应的字段名
    labelField: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      dyadicArray: [],
      scrollHeight: 0,
      isShow: true
    }
  },
  computed: {
    moreButtonStyle() {
      const height = this.scrollHeight
      const style = `height: ${height - 4}px;`
      return style
    }
  },
  watch: {
    options: {
      handler(val) {
        this.createDyadicArray(val)
        this.isShow = false
        this.$nextTick(() => {
          this.scrollHeight = document.getElementById('buttonSpanId').scrollHeight
          this.isShow = true
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getColumnStyle(column) {
      const ml = column === 1 ? 0 : 5
      const style = `margin-left: ${ml}px;`
      return style
    },
    // 创建二维数组
    createDyadicArray(options) {
      this.dyadicArray = []
      let index = 0
      for (let i = 0; i < this.defaultShowRowCount; i++) {
        if (index === options.length) break
        this.dyadicArray.push([])
        for (let j = 0; j < this.defaultShowColumnCount; j++) {
          if (index === options.length) break
          this.dyadicArray[i].push(options[index])
          index++
        }
      }
    },
    /**
     * 按钮点击事件
     * @param row 行数
     * @param column 列数
     */
    onClick(row, column) {
      const object = Object.assign({}, this.dyadicArray[row - 1][column - 1])
      const isExistId = Object.prototype.hasOwnProperty.call(object, 'id')
      const index = this.data.findIndex(item => {
        return isExistId ? item.id === object.id : JSON.stringify(item) === JSON.stringify(object)
      })
      if (index === -1) {
        this.data.push(object)
      } else {
        this.data.splice(index, 1)
      }
    },
    /**
     * 判断按钮是否被选中
     * @param row 行数
     * @param column 列数
     * @return {boolean} true： 被选中了；false： 未选中
     */
    isChecked(row, column) {
      const object = this.dyadicArray[row - 1][column - 1]
      const isExistId = Object.prototype.hasOwnProperty.call(object, 'id')
      const bo = this.data.some(item => {
        return isExistId ? item.id === object.id : JSON.stringify(item) === JSON.stringify(object)
      })
      return bo
    },
    /**
     * 按钮点击事件
     * @param index 点击的按钮的索引
     */
    onClick2(index) {
      const isExistId = Object.prototype.hasOwnProperty.call(this.options[index], 'id')
      const i = this.data.findIndex(item => {
        return isExistId ? item.id === this.options[index].id : JSON.stringify(item) === JSON.stringify(this.options[index])
      })
      if (i === -1) {
        this.data.push(Object.assign({}, this.options[index]))
      } else {
        this.data.splice(i, 1)
      }
    },
    /**
     * 判断按钮是否被选中
     * @param index 索引
     * @return {boolean} true： 被选中了；false： 未选中
     */
    isChecked2(index) {
      const isExistId = Object.prototype.hasOwnProperty.call(this.options[index], 'id')
      const bo = this.data.some(item => {
        return isExistId ? item.id === this.options[index].id : JSON.stringify(item) === JSON.stringify(this.options[index])
      })
      return bo
    }
  }
}
</script>

<style lang="scss" scoped>
  .row-class{
    text-align: center;
    width: fit-content;
  }
  .button-span-class{
    display: inline-block;
    padding: 0 10px;
  }
  .btn-wrap{
    color: #526796;
    background-color: #1B3289;
    display:inline-block;
    vertical-align: top;
    position:relative;
    width: 20px;
    margin-left: -5px;
    cursor: pointer;
    border-radius: 2px;
    &:hover{
      background-color: #18317F;
    }
    .next{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      font-size: 14px;
      font-weight: 700;
      color: #506F90;
    }
  }
  .more-popover.el-popover{
    background-color: #0E1E5B;
    border:solid 1px #0F77EF;
    overflow-y: auto;
    max-height: 400px;
    .popper__arrow{
      display: none;
    }
  }
</style>
