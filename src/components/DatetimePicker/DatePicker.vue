<template>
  <div>
    <el-date-picker
      v-model="value"
      type="month"
      size="mini"
      placeholder="选择年月"
      :clearable="false"
      :picker-options="pickerOptions"
      @change="dateChange"
    />
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
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
    // 是否限制不能选择未来时间，默认true，不能选择未来时间
    isRestrict: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      value: null,
      pickerOptions: {
        disabledDate: (time) => {
          if (this.isRestrict) {
            return new Date(time) >= new Date()
          }
          return false
        }
      }

    }
  },
  watch: {
    time: {
      handler(val) {
        this.value = val ? new Date(val) : null
      },
      immediate: true
    }
  },
  methods: {
    dateChange(date) {
      let time = null
      const propTime = new Date(this.time)
      date.setHours(propTime.getHours())
      date.setMinutes(propTime.getMinutes())
      if (this.time instanceof String) {
        time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
          ' ' + date.getHours() + ':' + date.getMinutes()
      } else if (this.time instanceof Number) {
        time = date.getTime()
      }
      this.$emit('change', time || date)
    }
  }
}
</script>

<style scoped>
  .el-date-editor >>> .el-input__inner{
    border:solid 1px #0066C5;
    background-color: #0e256b;
    color: #fff;
  }
</style>
