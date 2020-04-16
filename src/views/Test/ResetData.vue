<template>
  <div>
    <el-form :model="form" label-width="100px">
      <el-form-item label="测试">
        <el-input v-model="form.test"></el-input>
      </el-form-item>
      <el-button @click="resetData">重置</el-button>
      <el-button @click="showTest">显示</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ResetData',
  data () {
    return {
      form: {
        test: ''
      }
    }
  },
  methods: {
    resetData () {
      Object.assign(this.$data, this.$options.data.call(this)) // 恢复初始化数据
    },
    showTest () {
      this.$notify.success('success：' + this.form.test)
    }
  }
}
</script>

<style scoped>

</style>
