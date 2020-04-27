<template>
  <div>
    <span v-for="day in dayList" :key="day" class="day-class" :style="setDayStyle(day)" @click="selectDay(day)">
      {{ day | format }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'DaySelect',
  filters: {
    format(num) {
      return num < 10 ? '0' + num : num
    }
  },
  model: {
    prop: 'time',
    event: 'change'
  },
  props: {
    time: {
      type: [Number, String, Date],
      default() {
        return new Date()
      }
    },
    // 日期的高度，不能带单位
    height: {
      type: [Number, String],
      default: 30
    },
    // 日期之间的间隔, 不能带单位
    spacing: {
      type: [Number, String],
      default: 5
    },
    // 日期的宽度，不能带单位.不传宽度时，默认铺面组件
    width: {
      type: [Number, String],
      default: ''
    },
    // 是否限制不能选择未来时间，默认true，不能选择未来时间
    isRestrict: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentTime: null,
      templateWidth: 0, // 组件的宽度
      selectedDay: 0
    }
  },
  computed: {
    dayList() {
      const dayList = []
      if (!this.currentTime) {
        return dayList
      }
      const time = new Date(this.currentTime)
      const month = time.getMonth() + 1
      time.setMonth(month)
      time.setDate(0)
      const days = time.getDate()
      for (let i = 1; i <= days; i++) {
        dayList.push(i)
      }
      return dayList
    }
  },
  watch: {
    time: {
      handler(val) {
        if (!val) {
          this.$emit('change', new Date())
          return
        }
        this.currentTime = new Date(val)
        this.selectedDay = this.currentTime.getDate()
      },
      immediate: true
    }
  },
  mounted() {
    this.templateWidth = this.$el.offsetWidth
    window.onresize = () => {
      this.templateWidth = this.$el.offsetWidth
    }
  },
  methods: {
    setDayStyle(day) {
      const marginLeft = day === 1 ? 0 : this.spacing
      const remainWidth = this.templateWidth - Number(this.spacing) * (this.dayList.length - 1)
      const width = this.width || (remainWidth / this.dayList.length)
      const backgroundColor = day === this.selectedDay ? '#495EF9' : '#0E256B'
      const color = day === this.selectedDay ? '#FFFFFF' : '#1B72E4'
      const style = `margin-left: ${marginLeft}px;width: ${width}px;height: ${this.height}px;line-height:${this.height}px;
      background-color: ${backgroundColor};color: ${color};`
      return style
    },
    selectDay(day) {
      if (this.isRestrict) { // 限制日期不能选到未来时间
        const paramTime = new Date(this.time)
        const newDate = new Date()
        if (paramTime.getFullYear() === newDate.getFullYear() && paramTime.getMonth() === newDate.getMonth()) {
          if (day > newDate.getDate()) {
            this.$message.warning('不能选未来时间！')
            return
          }
        }
      }
      this.selectedDay = day
      this.currentTime.setDate(day)
      let time = null
      if (this.time instanceof String) {
        time = this.currentTime.getFullYear() + '-' + (this.currentTime.getMonth() + 1) + '-' + this.currentTime.getDate() +
          ' ' + this.currentTime.getHours() + ':' + this.currentTime.getMinutes()
      } else if (this.time instanceof Number) {
        time = this.currentTime.getTime()
      }
      this.$emit('change', time || this.currentTime)
    }
  }
}
</script>

<style lang="scss" scoped>
  .day-class{
    cursor: pointer;
    user-select: none;
    display:inline-block;
    text-align: center;
  }
</style>
