/** ===============================================
 * 创建说明：配置识别vue项目中的@等等路径别名解析的方法
 *
 * 修改人：
 * 修改时间：
 * 修改说明：
 =============================================== **/

'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      _c: resolve('src/components')
    }
  }
}
