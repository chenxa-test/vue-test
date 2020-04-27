<template>
  <div>
    <el-table
      ref="table"
      v-loading="tableLoading"
      :border="tableData.border"
      :data="tableData.content"
      :max-height="tableData.maxHeight ? tableData.maxHeight : null"
      :highlight-current-row="!!tableData.isHighlightCurrentRow"
      :height="tableData.total ? null : (tableData.height ? tableData.height : null)"
      size="mini"
      fit
      row-key="id"
      :tree-props="tableData.treeProps ||{children: 'children', hasChildren: 'hasChildren'}"
      header-background-color="#f2f0fe"
      :span-method="tableData.spanMethod?tableData.spanMethod:null"
      @cell-click="cellClick"
      @row-dblclick="rowDbClick"
      @selection-change="handleSelectionChange"
      @select="select"
      @select-all="selectAll"
      @current-change="currentChange"
      @sort-change="sortChange"
    >
      <el-table-column
        v-if="tableData.isShowSelection && tableHeader.length > 0"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        v-if="tableData.isIndex"
        type="index"
        label="序号"
        width="50"
      ></el-table-column>
      <template v-for="(item, index) in tableHeader">
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
          :item="item"
          :key="index"
          style="display: none; height: auto;width: auto"
        />
      </template>
    </el-table>
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
    btnLoading: {
      type: Function, default () { }
    },
    tableTitle: {
      type: String,
      default: '查询结果'
    },
    tableTools: {
      type: Array,
      default: function () {
        return [
          {
            name: 'createDialog',
            icon: 'el-icon-circle-plus',
            displayName: '新增'
          },
          {
            name: 'editorDialog',
            icon: 'el-icon-edit',
            displayName: '编辑'
          },
          {
            name: 'delete',
            icon: 'el-icon-remove',
            displayName: '删除'
          },
          {
            name: 'batchDelete',
            icon: 'el-icon-delete',
            displayName: '批量删除'
          },
          {
            name: 'import',
            icon: 'el-icon-upload',
            displayName: '导入'
          },
          {
            name: 'export',
            icon: 'el-icon-download',
            displayName: '导出'
          },
          {
            name: 'templateDownload',
            icon: 'el-icon-document',
            displayName: '模板下载'
          }
        ]
      }
    },
    tableHeader: {
      type: Array,
      default: function () {
        return []
      }
    },
    tableData: {
      type: Object,
      default: () => {
        return { }
      }
    },
    tableLoading: {
      type: Boolean,
      default: false,
      require: true
    }
  }
}
</script>

<style scoped>

</style>
