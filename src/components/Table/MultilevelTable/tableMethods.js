import request from '@/utils/request'

export default {
  methods: {
    cellClick: function(row, column) {
      this.$emit('cellClick', row, column)
    },
    rowDbClick: function(row) {
      this.$emit('rowDbClick', row)
    },
    handleSelectionChange(val) {
      this.selectionItems = val
      this.$emit('selectionChange', val)
    },
    select(selection, row) {
      this.selectionItems = row
      this.$emit('select', selection, row)
    },
    selectAll(selection) {
      this.$emit('selectAll', selection)
    },
    currentChange(val) {
      this.$refs.table.toggleRowSelection(val) //  选中当前选择
      this.$emit('currentChange', val)
    },
    sortChange(data) {
      let sort = ''
      if (data.order === 'ascending') {
        sort = data.prop
      } else if (data.order === 'descending') {
        sort = '-' + data.prop
      }
      this.$set(this.tables.tableData, 'sortProp', sort)
      this.tables.tableData.currentPage = 1
      this.$emit('query')
    },
    ifShowAction(row, term) {
      const prop = term.prop
      const value = term.value
      if (row[prop] === value) {
        return false
      }
      return true
    },
    handleBtn: function(name, params) {
      this.$emit(name, params)
    },
    formatLabel(row, formatter) {
      const key = Object.keys(formatter)[0]
      const value = formatter[key]
      const label = row[key]
      if (label === null || label === '') {
        return label
      }
      for (const item in value) {
        if (item === label || parseInt(item) === label) {
          return value[item]
        }
      }
    },
    handleSizeChange: function(val) {
      this.tables.tableData.pageSize = val
      this.tables.tableData.currentPage = 1
      this.$emit('query')
    },
    handleCurrentChange: function(val) {
      this.tables.tableData.currentPage = val
      this.$emit('query')
    },
    query: function(params = {}) {
      let _params = { page: this.tables.tableData.currentPage, limit: this.tables.tableData.pageSize, param: params }
      if (this.tables.isListTable) {
        _params = params
      }
      if (!this.tables.tableRemote || !this.tables.tableRemote.url) {
        return
      }
      this.remote(_params).then(res => {
        if (this.tables.isListTable) {
          this.tables.tableData.content = res.data
        } else {
          this.tables.tableData.content = res.data.content
          if (Object.prototype.hasOwnProperty.call(this.tables.tableData, 'total')) {
            this.tables.tableData.total = parseInt(res.data.totalElements)
          }
          this.tables.tableLoading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    remote: function(params) {
      if (this.tables.tableRemote.params && JSON.stringify(this.tables.tableRemote.params) !== '{}') {
        params = this.tables.tableRemote.params
      }
      return request({
        url: this.tables.tableRemote.url,
        method: this.tables.tableRemote.method,
        data: params
      })
    }
  }
}
