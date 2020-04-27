<template>
  <div>
    <el-table-column
      :prop="item.prop"
      :label="item.label"
      :min-width="item.minWidth"
      :formatter="item.formatter || ((row,col,val) => val === null?'-':val )"
      align="center"
      :show-overflow-tooltip="item.showOverflowTooltip"
      :sortable="!!item.sortable?'custom':null"
    >
      <span v-if="item.children && item.children.length > 0">
        <table-column
          v-for="(n, index) in item.children"
          :key="index"
          :item="n"
        />
      </span>
    </el-table-column>
  </div>
</template>

<script>
import tableMethods from './tableMethods'
export default {
  name: 'TableColumn',
  mixins: [tableMethods],
  props: {
    item: {
      type: Object,
      default () { return {} }
    }
  }
}
</script>

<style scoped>

</style>
