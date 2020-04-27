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
      this.$set(this.tableData, 'sortProp', sort)
      this.tableData.currentPage = 1
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
    }
  }
}
