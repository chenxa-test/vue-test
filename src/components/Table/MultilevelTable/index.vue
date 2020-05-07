<template>
  <div>
    <el-table
      ref="table"
      v-loading="tables.tableLoading"
      :border="tables.tableData.border"
      :data="tables.tableData.content"
      :max-height="tables.tableData.maxHeight"
      :highlight-current-row="!!tables.tableData.isHighlightCurrentRow"
      :height="tables.tableData.total ? null : tables.tableData.height"
      size="mini"
      fit
      row-key="id"
      :tree-props="tables.tableData.treeProps ||{children: 'children', hasChildren: 'hasChildren'}"
      header-background-color="#f2f0fe"
      :span-method="tables.tableData.spanMethod"
      @cell-click="cellClick"
      @row-dblclick="rowDbClick"
      @selection-change="handleSelectionChange"
      @select="select"
      @select-all="selectAll"
      @current-change="currentChange"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="tables.tableData.isShowSelection && tables.tableHeader.length > 0"
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="tables.tableData.isIndex"
        type="index"
        label="序号"
        width="55"
        align="center"
      />
      <template v-for="(item, index) in tables.tableHeader">
        <el-table-column
          v-if="item.prop === 'operator'"
          :key="index"
          :label="item.label"
          :min-width="item.minWidth"
          :fixed="item.fixed ? item.fixed : null"
          align="center"
        >
          <template slot-scope="scope">
            <template v-if="item.actions.length > 3">
              <template v-for="(n,i) in item.actions">
                <el-tooltip
                  v-if="!n['showAction'] || ifShowAction(scope.row,n['showAction'])"
                  :key="i"
                  effect="light"
                  :content="n['formatterLabel'] ? formatLabel(scope.row,n['formatterLabel']) : n.label"
                  placement="top"
                >
                  <el-button
                    :loading="btnLoading(scope.row) ? true : false"
                    :type=" n.type || 'text'"
                    :icon="n.icon"
                    circle
                    :size="n.size || 'mini'"
                    @click="handleBtn(n.action, scope.row)"
                  />
                </el-tooltip>
              </template>
            </template>
            <template v-else>
              <template v-for="(n,i) in item.actions">
                <el-button
                  v-if="!n['showAction'] || ifShowAction(scope.row,n['showAction'])"
                  :key="i"
                  size="mini"
                  :loading="btnLoading(scope.row) ? true : false"
                  :icon="n.icon"
                  :disabled="item.isOperate == undefined ? (typeof n.isOperate == 'function' ? n.isOperate(scope.row) : false) : item.isOperate(scope.row) == false"
                  :type=" n.type || 'text'"
                  @click="handleBtn(n.action, scope.row)"
                >
                  <span :style="item.style?item.style:''">
                    {{ n.formatterLabel ? formatLabel(scope.row,n.formatterLabel) : (typeof(n.formatter) == 'function' ? n.formatter(scope.row, n.label) : n.label) }}
                  </span>
                </el-button>
              </template>
            </template>
          </template>
        </el-table-column>
        <table-column
          v-else
          :key="index"
          :item="item"
        />
      </template>
    </el-table>
    <div v-if="!tables.isListTable && tables.tableData.total > 0" class="pagination-wp">
      <el-pagination
        class="pagination-el"
        :current-page="tables.tableData.currentPage"
        :page-sizes="[10, 50, 100, 150]"
        :page-size="tables.tableData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        background
        :pager-count="5"
        :total="tables.tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import tableMethods from './tableMethods'
import TableColumn from './TableColumn'
export default {
  name: 'MultilevelTable',
  components: {
    TableColumn
  },
  mixins: [tableMethods],
  props: {
    tables: {
      type: Object,
      default: () => {
        return {}
      }
    },
    btnLoading: {
      type: Function, default() { }
    },
    tableTitle: {
      type: String,
      default: '查询结果'
    }
  },
  data() {
    return {
      selectionItems: [],
      tools: this.$lodash.cloneDeep(this.tables.tableTools || [])
    }
  },
  watch: {
    selectionItems: {
      handler(newValue, oldValue) {
        // todo: 优化一下
        if (this.$lodash.isEmpty(newValue)) {
          this.tools = this.tools.map(n => {
            if (n.name === 'delete' || n.name === 'batchDelete' || n.name === 'editorDialog' || n.name === 'batchExport') {
              n.disabled = true
            }
            return n
          })
        } else {
          this.tools = this.tools.map(n => {
            if (n.name === 'delete' || n.name === 'batchDelete' || n.name === 'batchExport') {
              n.disabled = false
            }
            if (newValue.length === 1 && n.name === 'editorDialog') {
              n.disabled = false
            }
            if (newValue.length !== 1 && n.name === 'editorDialog') {
              n.disabled = true
            }
            return n
          })
        }
      },
      immediate: true
    }
  },
  created() {
    this.query(this.tables.queryDefaultParams)
  }
}
</script>

<style scoped>

</style>
