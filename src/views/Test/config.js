const tools = [
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
    name: 'import',
    icon: 'el-icon-upload',
    displayName: '导入',
    url: '/dt-resource/v1/resource/bigServiceType/excel/increase'
  },
  {
    name: 'export',
    icon: 'el-icon-download',
    displayName: '导出',
    url: '/dt-resource/v1/resource/bigServiceType/excel/export'
  },
  {
    name: 'templateDownload',
    icon: 'el-icon-document',
    displayName: '模板下载',
    url: '/dt-resource/v1/resource/bigServiceType/excel/download'
  }
]
// 特定数据格式化
const _detailDataFormatter = function(row, column) {
  let retVal = ''
  const property = column.property
  switch (property) {
    case 'enabled':
      retVal = (row.enabled != null && row.enabled) ? '是' : '否'
      break
  }
  return retVal
}
export const formData = {
  name: {
    type: 'input',
    label: '名称'
  },
  code: {
    type: 'input',
    label: '编码'
  }
}
export const table = {
  tableRemote: {
    url: '/dt-resource/v1/resource/bigServiceType/query',
    method: 'post'
  },
  tableHeader: [
    {
      label: '名称',
      prop: 'name'
    },
    {
      label: '编码',
      prop: 'code',
      children: [
        { label: '编码1', prop: 'code1' },
        { label: '编码2', prop: 'code2' },
        { label: '编码3', prop: 'code3' }
      ]
    },
    {
      label: '是否启用',
      prop: 'enabled',
      formatter: _detailDataFormatter
    },
    {
      label: '备注',
      prop: 'remarks'
    }
  ],
  tableTools: tools,
  tableData: {
    isHighlightCurrentRow: true,
    isShowSelection: true,
    isIndex: true,
    border: true,
    content: [
      { name: 'name1', code1: 'code1', code2: 'code2', code3: 'code3' },
      { name: 'name1', code1: 'code1', code2: 'code2', code3: 'code3' },
      { name: 'name1', code1: 'code1', code2: 'code2', code3: 'code3' },
      { name: 'name1', code1: 'code1', code2: 'code2', code3: 'code3' }
    ],
    pageSize: 10,
    currentPage: 1,
    total: 0
  }
}
export const dialogData = {
  id: {
    type: 'input',
    label: 'id',
    isShow: false
  },
  name: {
    type: 'input',
    label: '名称',
    rules: [{ required: true, message: '请输入名称', trigger: 'blur' }]
  },
  code: {
    type: 'input',
    label: '编码',
    rules: [{ required: true, message: '请输入编码', trigger: 'blur' }]
  },
  enabled: {
    type: 'select',
    label: '是否启用',
    options: [{ name: '是', value: true }, { name: '否', value: false }],
    rules: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
  },
  remarks: {
    type: 'input',
    label: '备注'
  }
}
