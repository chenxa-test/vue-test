<template>
  <div>
    <el-button class="button-class" icon="el-icon-caret-left" @click="backward" />
    <span class="time-label-class"> 数据时间 {{ timeLabel }} </span>
    <el-button v-if="canForward" class="button-class" icon="el-icon-caret-right" @click="forward" />
    <el-button v-if="canForward" class="button-class go-now-class" icon="el-icon-download" @click="goNow" />
    <!--    el-icon-download-->
  </div>
</template>

<script>
export default {
  name: 'TimelineController',
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
    isShow: {
      type: Boolean,
      default: true
    },
    // 时间粒度（单位：m）
    granularity: {
      type: [Number, String],
      default: 15
    },
    // 是否限制不能选择未来时间，默认true，不能选择未来时间
    isRestrict: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  computed: {
    timeLabel() {
      if (!this.time) {
        return '00:00'
      }
      const date = new Date(this.time)
      const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${hours}:${min}`
    },
    canForward() {
      return new Date(this.time).getTime() <
        Math.floor(new Date().getTime() / (this.granularity * 60 * 1000)) * (this.granularity * 60 * 1000)
    }
  },
  methods: {
    setTime(newTime) {
      if (this.time instanceof String) {
        const date = new Date(newTime)
        newTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Date) {
        newTime = new Date(newTime)
      }
      this.$emit('change', newTime)
    },
    // 上一粒度
    backward() {
      const date = new Date(this.time)
      date.setTime(date.getTime() - this.granularity * 60 * 1000)
      this.setTime(date.getTime())
    },
    // 下一粒度
    forward() {
      const date = new Date(this.time)
      date.setTime(date.getTime() + this.granularity * 60 * 1000)
      this.setTime(date.getTime())
    },
    goNow() {
      this.setTime(new Date().getTime())
    }
  }
}
</script>

<style lang="scss" scoped>
  .time-label-class{
    color: #00CEFF;
    font-size: 24px;
  }
  .button-class{
    background-color: #0E256B;
    color: #1B72E4;
    border: 0;
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
    font-size: 25px;
  }
  .go-now-class{
    transform: rotate(-90deg)
  }
</style>
