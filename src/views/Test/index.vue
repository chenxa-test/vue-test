<template>
  <div>
    <multilevel-table
      :table-data="tables.tableData"
      :table-header="tables.tableHeader"
      :table-tools="[]"
    ></multilevel-table>
  </div>
</template>

<script>
import MultilevelTable from '@/components/Table/MultilevelTable'
import { table } from './config'
export default {
  name: 'Index',
  components: {
    MultilevelTable
  },
  data () {
    return {
      tables: { ...table }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
