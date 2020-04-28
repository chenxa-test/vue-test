<template>
  <div>
    <el-form
      ref="form"
      v-model="form"
      label-width="120px"
    >
      <el-form-item label="名称：">
        <el-input
          v-model="form.name"
          @change="nameChange"
        />
      </el-form-item>
    </el-form>
    <el-button @click="getExcelData">读取文件</el-button>
  </div>
</template>

<script>
import { form } from '@/views/DataConvert/index-model'
import excelUtil from '@/utils/excel-util'
export default {
  name: 'Index',
  data() {
    return {
      form: {},
      excelData: []
    }
  },
  created() {
    this.dataConvert()
  },
  methods: {
    dataConvert() {
      const temp = {
        testName: 123,
        itemName2: 'test'
      }
      this.form = form.parse(temp)
      console.log(this.form)
      console.log(form.traverse(this.form))
    },
    nameChange(val) {
      console.log('name:', val)
      console.log(form.traverse(this.form))
    },
    getExcelData() {
      excelUtil.getExcelDataByFileName('form-model.xlsx').then(res => {
        this.excelData = res
      }).catch(e => {
        this.$notify.error(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
