<template>
  <div>
    <span id="divId" class="div-class">
      <span
        v-for="(item, index) in options"
        :key="index"
      >
        <alone-button
          v-if="index < defaultShowCount"
          :label="item[labelField]"
          :label-font-size="labelFontSize"
          :width="width"
          :height="height"
          :is-checked="isChecked(index)"
          :style="getSpanStyle(index)"
          @on-click="onClick(index)"
        />
      </span>
    </span>
    <el-popover
      v-if="isShow"
      placement="bottom"
      trigger="click"
      popper-class="more-popover"
    >
      <div>
        <span
          v-for="(item, index) in options"
          :key="index"
          :style="getSpanStyle(index % showCount)"
        >
          <alone-button
            :label="item[labelField]"
            :is-checked="isChecked(index)"
            :width="width"
            :height="height"
            :label-font-size="labelFontSize"
            @on-click="onClick(index)"
          />
          <br v-if="(index + 1) % showCount === 0">
        </span>
      </div>
      <div
        v-if="options.length > defaultShowCount"
        slot="reference"
        class="btn-wrap"
        :style="moreButtonStyle"
      >
        <i class="fas fa-angle-double-down next" />
      </div>
    </el-popover>
  </div>
</template>

<script>
import AloneButton from './AloneButton'
export default {
  name: 'BtnWithIconOnLeft',
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
    // 默认显示的个数
    defaultShowCount: {
      type: Number,
      default: 3
    },
    width: {
      type: [Number, String],
      default: '200'
    },
    height: {
      type: [Number, String],
      default: '30'
    },
    // 文字字体大小
    labelFontSize: {
      type: [Number, String],
      default: '15'
    },
    // 文字对应的字段名
    labelField: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      scrollHeight: 0,
      showCount: 4,
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
        this.isShow = false
        this.$nextTick(() => {
          this.scrollHeight = document.getElementById('divId').scrollHeight
          this.isShow = true
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    /* 测试使用，测试完后请删除 */
    for (let i = 1; i < 100; i++) {
      this.options.push({
        id: i,
        number: i,
        label: 'NFV-DSP-HNGZ-00A-HW-02-TRU-04' + i
      })
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 按钮点击事件
     * @param index 点击的按钮的索引
     */
    onClick(index) {
      const isExistId = this.options[index].hasOwnProperty('id')
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
    isChecked(index) {
      const isExistId = this.options[index].hasOwnProperty('id')
      const bo = this.data.some(item => {
        return isExistId ? item.id === this.options[index].id : JSON.stringify(item) === JSON.stringify(this.options[index])
      })
      return bo
    },
    getSpanStyle(index) {
      const ml = index === 0 ? 0 : 5
      const style = `margin-left: ${ml}px;`
      return style
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-wrap{
    color: #526796;
    background-color: #1B3289;
    display:inline-block;
    vertical-align: top;
    position:relative;
    width: 20px;
    margin-left: 3px;
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
      color: #56699D;
    }
  }
  .div-class{
    display: inline-block;
    text-align: center;
    width: fit-content;
  }
</style>
