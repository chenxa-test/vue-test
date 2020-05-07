<template>
  <el-table-column
    :prop="item.prop"
    :label="item.label"
    :min-width="item.minWidth"
    :formatter="item.formatter || ((row,col,val) => val === null?'-':val )"
    align="center"
    :show-overflow-tooltip="item.showOverflowTooltip"
    :sortable="!!item.sortable?'custom':null"
  >
    <template v-if="item.children && item.children.length > 0">
      <table-column
        v-for="(n, index) in item.children"
        :key="index"
        :item="n"
      />
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'TableColumn',
  props: {
    item: {
      type: Object,
      default() { return {} }
    }
  }
}
</script>

<style scoped>

</style>
