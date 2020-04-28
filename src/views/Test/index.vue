<template>
  <div>
    <multilevel-table
      :tables="tables"
    />
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
  data() {
    return {
      tables: { ...table }
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
