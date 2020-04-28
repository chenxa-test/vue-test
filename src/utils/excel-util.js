import xlsx from 'xlsx'
import Axios from 'axios'
export default {
  /**
   * 读取Excel表格的数据
   * @param filePath 文件路径，包括后缀名
   * @return {Promise<unknown>}
   */
  getExcelDataByFilePath(filePath) {
    return new Promise((resolve, reject) => {
      // 读取二进制excel文件
      Axios.get(filePath, { responseType: 'arraybuffer' }).then(res => {
        const data = new Uint8Array(res.data)
        const workbook = xlsx.read(data, { type: 'array' })
        const sheetName1 = workbook.SheetNames[0]
        const content = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName1]) // 生成json表格内容
        resolve(content)
      }).catch(e => {
        reject(e)
      })
    })
  },
  /**
   * 读取public/Excel文件夹下的Excel表格数据
   * @param fileName 文件名，可以不包含后缀名
   * @return {Promise<unknown>}
   */
  getExcelDataByFileName(fileName) {
    return new Promise((resolve, reject) => {
      if (_.isEmpty(fileName)) reject(new Error('文件名是空的！'))
      let filePath = '/Excel/' + fileName
      if (fileName.indexOf('.') === -1) {
        const fileStatus = this.getFileStatus(filePath + '.xlsx')
        filePath = fileStatus === 200 ? filePath + '.xlsx' : filePath + '.xls'
      }
      this.getExcelDataByFilePath(filePath).then(res => {
        resolve(res)
      }).catch(e => {
        reject(e)
      })
    })
  },
  /**
   * 获取文件的状态码 （200： 文件存在；404：文件不存在；其他的状态码为发生错误）
   * @param url 文件路径,包含后缀名
   * @return{number} 状态码
   */
  getFileStatus(url) {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', url, false)
    xmlHttp.send()
    return xmlHttp.status
  }
}
