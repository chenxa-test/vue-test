<template>
  <!--  background-color: #0066c5;-->
  <div style="height: 50px;">
    <div style="background-color: #0066c5; width: 100%; height: 40px;" />
    <div id="container" style="width: 100%; height: 50px; position: relative; top: -46px" />
  </div>
</template>

<script>
import echarts from 'echarts'
const _timelineData = []
for (let i = 0; i < 96; i++) {
  const hh = Math.floor((i * 15) / 60)
  const mm = (i * 15) % 60
  const value = (hh < 10 ? ['0', hh].join('') : hh) + ':' + (mm < 10 ? ['0', mm].join('') : mm)
  _timelineData.push({
    value: value,
    symbolSize: mm === 0 ? (hh % 2 === 0 ? [6, 13] : [4, 21]) : [6, 13],
    itemStyle: {
      color: '#479cea',
      borderWidth: mm === 0 ? (hh % 2 === 0 ? 4 : 4) : 5,
      borderColor: '#0066c5',
      shadowBlur: 0
    },
    time: { hours: hh, minutes: mm },
    tooltip: {
      formatter: function(params) {
        return value
      }
    }
  })
}

export default {
  name: 'TimePicker',
  model: {
    // 组件对外提供的双向绑定接口
    prop: 'time',
    event: 'change'
  },
  props: {
    // 外界输入的时间
    time: {
      type: [Number, String, Date],
      default() {
        return new Date()
      }
    }
  },
  // 组件内部变量
  data: function() {
    return {
      myChart: {},
      currentIndex: 0
    }
  },
  watch: {
    time: {
      handler(val) {
        this.setPickerByTime(val.getTime())
      },
      immediate: true
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('container'))

    const option = {
      baseOption: {
        timeline: {
          currentIndex: this.currentIndex,
          left: 'center',
          width: '100%',
          axisType: 'category',
          realtime: false, // 拖动圆点的时候，是否实时更新视图。
          loop: false,
          data: _timelineData,
          label: {
            interval: 7,
            color: '#06effc',
            formatter: function(s) {
              return s
            }
          },
          lineStyle: {
            show: false
          },
          symbol: 'rect',
          checkpointStyle: {
            symbol: 'rect',
            symbolSize: [5, 45],
            symbolOffset: ['50%', '50%'],
            color: 'rgba(6,239,252)',
            borderWidth: 5,
            borderColor: 'rgb(0,206,255,0.3)',
            tooltip: {}
          },
          controlStyle: {
            showPlayBtn: false
          },
          emphasis: {
            label: {
              color: '#59fafc',
              fontSize: 13,
              padding: [1, 0, 0, 0]
            },
            itemStyle: {
              color: '#59fafc',
              symbolSize: 30,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            checkpointStyle: {
              // symbolSize: [8, 45],
              color: 'rgb(252,71,51)'
            }
          }
        },
        tooltip: {}
      }
    }

    this.myChart.setOption(option)
    this.myChart.on('timelinechanged', (param) => this.onPickerChange(param.currentIndex, 'timelinechanged'))
  },
  methods: {
    onPickerChange(currentIndex, event) {
      // console.log(this.currentIndex, currentIndex, event)
      if (this.currentIndex === currentIndex) {
        const option0 = this.myChart.getOption()
        option0.timeline[0].currentIndex = currentIndex === 0 ? 1 : currentIndex - 1
        this.myChart.setOption(option0)
        this.currentIndex = option0.timeline[0].currentIndex = currentIndex
        this.myChart.setOption(option0)
        return
      }

      this.currentIndex = currentIndex
      let time = null

      let date = new Date()
      const propTime = new Date(this.time)
      date.setFullYear(propTime.getFullYear())
      date.setMonth(propTime.getMonth())
      date.setDate(propTime.getDate())
      date.setHours(_timelineData[currentIndex].time.hours)
      date.setMinutes(_timelineData[currentIndex].time.minutes)
      date.setSeconds(0)
      date.setMilliseconds(0)

      // 与当前时间对比，如果超过当前时间，则=当前时间
      if (date.getTime() > new Date().getTime()) {
        // 时间修改到与当前时间一致
        date = new Date()
        this.$message.warning('不可以滑动到未来时刻！')
      }
      if (this.time instanceof String) {
        time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
          ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Number) {
        time = date.getTime()
      }
      this.setPickerByTime(date.getTime())
      this.$emit('change', time || date)
    },
    setPickerByTime(time0) {
      let dateTime = new Date(time0)

      // 与当前时间对比，如果超过当前时间，则=当前时间
      if (dateTime.getTime() > new Date().getTime()) {
        // 时间修改到与当前时间一致
        dateTime = new Date()
        this.$message.warning('不可以滑动到未来时刻！')
      }
      // 如果不为15分钟整数倍，则取前一个15分钟
      const currentIndex = Math.floor((dateTime.getHours() * 60 + dateTime.getMinutes()) / 15)
      dateTime.setHours(Math.floor(currentIndex / 4))
      dateTime.setMinutes(15 * (currentIndex % 4))
      dateTime.setSeconds(0)
      dateTime.setMilliseconds(0)

      if (this.myChart.dispatchAction && this.currentIndex !== currentIndex) {
        this.myChart.dispatchAction({
          type: 'timelineChange',
          currentIndex: currentIndex
        })
        this.currentIndex = currentIndex
      }
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
    left: 0;
    bottom: 0;
    width: 100%;
    user-select: none;
  }
  .slider-container {
    width: 4px;
    margin-top: -30px;
  }
</style>
