<template>
  <div id="divId" class="main-container" @mousemove="mouseMoving">
    <div class="upper-container" :style="bgStyle">
      <div class="temperature-graduation">
        <span v-for="(item, index) in timeList" :key="index">
          <div v-if="item.isShow" :style="getScaleStyle(item.value, index)">
            <span class="temperature-element-number">{{ item.label }}</span><br>
            <i :style="getLineStyle(item.value)" />
          </div>
        </span>
      </div>
    </div>
    <div class="slider-container" :style="sliderStyle">
      <div id="sliderButton" :style="sliderButtonStyle" />
    </div>
  </div>
</template>

<script>
const sliderMinX = 0
const coldGradient = {
  start: '#0066C5',
  end: '#0066C5'
}
const showTimeEnum = {
  0: '00:00',
  120: '02:00',
  240: '04:00',
  360: '06:00',
  480: '08:00',
  600: '10:00',
  720: '12:00',
  840: '14:00',
  960: '16:00',
  1080: '18:00',
  1200: '20:00',
  1320: '22:00',
  1440: '24:00'
}
export default {
  name: 'TimeScale',
  model: {
    prop: 'time',
    event: 'change'
  },
  props: {
    // 时间粒度（单位：m）
    granularity: {
      type: [Number, String],
      default: 15
    },
    // 时间
    time: {
      type: [Number, String, Date],
      default() {
        return new Date().getTime()
      }
    },
    // 刻度靠左的距离(不可以带单位)
    scaleMarginLeft: {
      type: [Number, String],
      default: '10'
    },
    // 刻度靠右的距离(不可以带单位)
    scaleMarginRight: {
      type: [Number, String],
      default: '30'
    },
    // 是否限制不能滑动到未来时间，默认true，不能滑动到未来时间
    isRestrict: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      timeList: [],
      dragging: false,
      initialMouseX: 0,
      sliderX: 0,
      initialSliderX: 0,
      gradientStart: coldGradient.start,
      gradientEnd: coldGradient.end,
      width: 0,
      actualTime: new Date(),
      interval: null
    }
  },
  computed: {
    // 刻度条可滑动的总长度
    sliderMaxX() {
      const width = this.templateWidth - this.scaleWidth - Number(this.scaleMarginRight) - Number(this.scaleMarginLeft)
      return width
    },
    templateWidth() {
      return this.width
    },
    sliderStyle() {
      return `transform: translate3d(${this.sliderX}px, 0, 0);`
    },
    bgStyle() {
      return `background: linear-gradient(to bottom right, ${this.gradientStart}, ${this.gradientEnd});`
    },
    // 一个单位的宽度
    gap() {
      if (this.timeList.length < 2) {
        return 0
      }
      const dotCount = (this.timeList[1].value - this.timeList[0].value) * (this.timeList.length - 1) // 刻度的总数
      const gap = this.sliderMaxX / dotCount
      return gap
    },
    // 当前值
    currentTime() {
      if (this.timeList.length === 0) return 0
      const tempRangeStart = this.timeList[0].value
      return Math.round(this.sliderX / this.gap + tempRangeStart)
    },
    // 一个粒度的宽度
    scaleWidth() {
      const showTimeList = this.timeList.filter(item => item.isShow)
      return (this.templateWidth - Number(this.scaleMarginLeft) - Number(this.scaleMarginRight)) / (showTimeList.length)
    },
    // 刻度的样式
    scaleClass() {
      return `text-align: center;display: inline-block;width: ${this.scaleWidth}px;opacity: 0.7;`
    },
    // 滑块的样式
    sliderButtonStyle() {
      const width = 5
      const left = this.scaleWidth / 2 + Number(this.scaleMarginLeft)
      return `position: absolute;left: ${left}px;width: ${width}px;height: 30px;background-color: #13E5FA;cursor: grab;`
    }
  },
  watch: {
    time: {
      handler(val) {
        this.$nextTick(() => {
          if (this.dragging) return // 因为滑块移动时（this.dragging = true），组件绑定的值会改变，为了能有更好的滑动效果，故不需要运行下面的代码，
          this.sliderX = 0
          if (!val) return
          const date = new Date(val)
          const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          const timeStamp = new Date(dateStr).getTime() // 年月日的时间戳
          const dateStr2 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
          const timeStamp2 = new Date(dateStr2).getTime() // 父组件传过来的时间的时间戳,不包含秒和毫秒
          const difference = timeStamp2 - timeStamp
          if (difference < 0) return
          this.$nextTick(() => {
            const num = Math.floor((difference / 1000 / 60 - this.timeList[0].value) / this.granularity) // 下舍入
            this.sliderX = this.scaleWidth * num
            if ((difference / 1000 / 60 - this.timeList[0].value) % this.granularity !== 0) { // 防止死循环
              this.onEmit()
            }
          })
        })
      },
      immediate: true
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  mounted() {
    const sliderButton = document.getElementById('sliderButton')
    if (sliderButton) {
      // 鼠标左键按下事件
      sliderButton.addEventListener('mousedown', e => {
        this.startDrag(e)
      })
    }
    const divId = document.getElementById('divId')
    if (divId) {
      // 鼠标左键松开事件
      divId.addEventListener('mouseup', () => {
        this.stopDrag()
      })
      // 鼠标指针离开被选元素时触发
      divId.addEventListener('mouseleave', () => {
        this.stopDrag()
      })
    }
    this.width = this.$el.offsetWidth
    window.onresize = () => {
      this.width = this.$el.offsetWidth
    }
  },
  created() {
    this.setTimeList()
    this.interval = setInterval(() => {
      this.actualTime = new Date()
      if (this.actualTime.getSeconds() === 0) {
        // 重新设置定时器
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.actualTime = new Date()
        }, 1000 * 60)
      }
    }, 1000)
  },
  methods: {
    startDrag(e) {
      this.dragging = true
      this.initialMouseX = e.pageX
      this.initialSliderX = this.sliderX
    },
    stopDrag() {
      this.dragging = false
      this.$nextTick(() => {
        const num = Math.round((this.currentTime - this.timeList[0].value) / this.granularity)
        this.sliderX = this.scaleWidth * num
        this.onEmit()
      })
    },
    mouseMoving(e) {
      if (this.dragging) {
        const restricting = this.restricting()
        if (restricting) return
        const dragAmount = e.pageX - this.initialMouseX
        const targetX = this.initialSliderX + dragAmount
        this.sliderX = Math.max(Math.min(targetX, this.sliderMaxX), sliderMinX)
        this.onEmit()
        this.dragging = this.currentTime !== this.timeList.length - 1 // 滑块滑动到最后面时，禁止再滑动
      }
    },
    // 使滑块所移到的刻度往上凸的样式
    tempElementStyle(tempNumber) {
      const nearDistance = 3
      const liftDistance = 12

      const diff = Math.abs(this.currentTime - tempNumber)
      const distY = (diff / nearDistance) - 1
      const elementY = Math.min(distY * liftDistance, 0)
      return `transform: translate3d(0, ${elementY}px, 0)`
    },
    setTimeList() {
      this.timeList = []
      const min = (24 * 60)
      // 需要显示的刻度
      for (let i = 0; i <= min; i++) {
        const label = showTimeEnum[i] || ''
        this.timeList.push({
          value: i,
          label: label,
          isShow: i % this.granularity === 0
        })
      }
    },
    onEmit() {
      let date = new Date(this.time)
      const dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      const timeStamp = new Date(dateStr).getTime() // 年月日的时间戳
      const timeStamp2 = this.currentTime * 60 * 1000
      let time = timeStamp + timeStamp2
      if (this.time instanceof String) {
        date = new Date(time)
        time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Date) {
        time = new Date(time)
      }
      this.$emit('change', time)
    },
    getScaleStyle(value, index) {
      let style = this.scaleClass
      if (index === 0) {
        style += `margin-left: ${this.scaleMarginLeft}px;`
      } else if (index === this.timeList.length - 1) {
        style += `margin-right: ${this.scaleMarginRight}px;`
      }
      return style
    },
    getLineStyle(value) {
      let height = 10
      let width = 1
      if (showTimeEnum[value]) {
        height = 18
        width = 2
      }
      let background = '#CCCCCC'
      if (value === Math.round(this.currentTime)) {
        background = 'transparent'
      }
      const style = `display: inline-block;width: ${width}px;height: ${height}px;background: ${background};vertical-align: middle;`
      return style
    },
    /**
     * 判断是否限制滑动到未来时刻
     * @return {boolean} true：限制；false：不限制
     */
    restricting() {
      if (this.isRestrict) { // 限制不能滑动到未来时间
        const currentTime = new Date(this.time)
        currentTime.setHours(0, 0, 0, 0)
        const temp = new Date().setHours(0, 0, 0, 0)
        if (currentTime.getTime() !== temp) {
          return false
        }
        const date = new Date()
        const timeStamp = date.getTime()
        date.setHours(0, 0)
        const timeStamp2 = date.getTime()
        const difference = timeStamp - timeStamp2
        if (difference <= this.currentTime * 60 * 1000) {
          const num = Math.floor((difference / 1000 / 60 - this.timeList[0].value) / this.granularity) // 下舍入
          this.sliderX = this.scaleWidth * num
          if ((difference / 1000 / 60 - this.timeList[0].value) % this.granularity !== 0) { // 防止死循环
            this.onEmit()
          }
          this.dragging = false
          this.$message.warning('不可以滑动到未来时刻！')
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 1fr;
    height: 55px;
  }
  .upper-container {
    position: relative;
    background: #0066C5;
  }
  .lower-container {
    background-color: #0066C5;
  }
  .temperature-text {
    position: relative;
    bottom: 40px;
    font-size: 30px;
    margin-top: 40px;
    margin-bottom: 20px;
    width: 100%;
    text-align: left;
    user-select: none;
  }
  .temperature-element-number {
    color: #00CEFF;
  }
  .temperature-graduation {
    /*position: absolute;*/
    left: 0px;
    bottom: 0px;
    width: 100%;
    user-select: none;
  }
  .slider-container {
    width: 4px;
    margin-top: -30px;
  }
</style>
