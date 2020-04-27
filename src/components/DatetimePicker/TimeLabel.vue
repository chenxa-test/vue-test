<template>
  <div>
    <span class="time-label-class"> {{ timeLabel }} </span>
    <span v-if="isShow" class="button-group-class">
      <span class="span-class" @click="up">上一粒度</span>
      <span class="span-class" @click="down">下一粒度</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'TimeLabel',
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
      return `${hours}:${min}`
    }
  },
  methods: {
    // 上一粒度
    up() {
      let date = new Date(this.time)
      let timeStamp = date.getTime() - (this.granularity * 60 * 1000)
      if (this.time instanceof String) {
        date = new Date(timeStamp)
        timeStamp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Date) {
        timeStamp = new Date(timeStamp)
      }
      this.$emit('change', timeStamp)
    },
    // 下一粒度
    down() {
      let date = new Date(this.time)
      let timeStamp = date.getTime() + (this.granularity * 60 * 1000)
      if (this.isRestrict) { // 限制不能选未来时间
        if (timeStamp > new Date().getTime()) {
          this.$message.warning('不能选未来时间！')
          return
        }
      }
      if (this.time instanceof String) {
        date = new Date(timeStamp)
        timeStamp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Date) {
        timeStamp = new Date(timeStamp)
      }
      this.$emit('change', timeStamp)
    }
  }
}
</script>

<style lang="scss" scoped>
  .time-label-class{
    color: #00CEFF;
    font-size: 24px;
  }
  .button-group-class{
    .span-class{
      width: 40px;
      height: 20px;
      background-color: #0E256B;
      color: #1B72E4;
      margin: 0px 5px 0px 0px;
      padding: 0px 5px 5px 5px;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
