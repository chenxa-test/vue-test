<template>
  <div>
    <date-picker
      v-model="time"
      class="date-picker-class"
    />
    <timeline-controller
      v-model="time"
      class="margin-bottom-class"
    />

    <!--    <time-label-->
    <!--      v-model="time"-->
    <!--      class="margin-bottom-class"-->
    <!--    />-->
    <div class="time-wrap">
      <day-select
        v-model="time"
        class="margin-bottom-class"
      />
      <time-picker
        v-model="time"
      />
    </div>
  </div>
</template>

<script>
// import TimeScale from './TimeScale'
// import TimeLabel from './TimeLabel'
import DaySelect from './DaySelect'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import TimelineController from './TimelineController'
export default {
  name: 'DatetimePicker',
  components: {
    // TimeScale,
    // TimeLabel,
    DaySelect,
    DatePicker,
    TimePicker,
    TimelineController
  },
  data() {
    return {
      time: new Date()
    }
  },
  mounted() {
    this.time = new Date()
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .margin-bottom-class{
    margin-bottom: 5px;
  }
  .time-label-class{
    color: #00CEFF;
    font-size: 24px;
  }
  .date-picker-class{
    float: right;
    height: 0px;
    margin-top: 3px;
    margin-right: 3px;
  }
  .time-wrap{
    background:rgba(20,41,111,1);
    border-radius:2px;
  }
</style>
