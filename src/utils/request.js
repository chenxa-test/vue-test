/** ===============================================
 *
 * 创建说明：封装ajax(axios)，添加request response 拦截器
 *
 * 修改人：
 * 修改时间：
 * 修改说明：
 =============================================== **/
import axios from 'axios'
import { Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth' // todo
import QS from 'qs'
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_BASE_API : location.protocol + '//' + location.host + '/', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout (unit: ms)
})
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      if (!(Cookies.get('secure.token.key') || Cookies.get('logon.cookie.username'))) {
        config.headers.Authorization = 'Bearer ' + getToken()
      }// 让每个请求携带token-- 请根据实际情况自行修改
      if (!config.headers['Content-type']) { // 指定content-type 则跳过
        config.headers['Content-type'] = 'application/json; charset=utf-8'
      } else if (config.headers['Content-type'] === 'application/x-www-form-urlencoded') {
        // 如果为表单提交并且为post请求
        // 进行数据转换
        if (config.method === 'post') {
          config.data = QS.stringify({
            ...config.data
          })
        }
      }
      if (config.method === 'delete') {
        config.paramsSerializer = function(params) {
          return QS.stringify(params, { arrayFormat: 'repeat' })
        }
      }
      if (config.method === 'get') {
        config.paramsSerializer = function(params) {
          if (params.onlyCode) {
            delete params.onlyCode
            return QS.stringify(params, { arrayFormat: 'repeat' })
          }
          return QS.stringify(params)
        }
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    // Promise.reject(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  response => {
    /**
     * success为false 表示错误，code 错误码确定错误信息
     */
    const status = response.status
    const res = response.data
    const code = res.code
    if (!(status && status === 200 || code && code === 200)) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.message || 'error')
    } else {
      const data = response.data
      if (data instanceof Blob && window.navigator.msSaveBlob) { // 文件下载接口，且是IE以及IE内核的浏览器
        const contentDisposition = response.headers['content-disposition']
        const arr = contentDisposition.split(';')
        const str = arr.find(item => {
          return item.indexOf('filename=') > -1
        })
        let fileName = ''
        if (str) {
          fileName = str.split('filename=')[1]
        }
        if (fileName) {
          window.navigator.msSaveBlob(data, fileName)
        }
        return null
      }
      if (response.headers['content-type']) {
        return response.headers['content-type'].indexOf('application/octet-stream') > -1 ? response : response.data
      } else {
        return response
      }
    }

    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    /*
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } */
  },
  error => {
    console.log('err', error) // for debug
    const res = error.response
    console.log(res.status)
    if (res.status === 401) {
      store.dispatch('user/fedLogOut').then(() => { location.reload() })
      Notification.error({
        title: '401',
        message: res.config.url + ' 禁止访问'
      })
    } else if (res.status === 403) {
      message(res.status + '： ' + res.data.msg, 'error')
    } else if (res.status === 404) {
      Notification.error({
        title: '404',
        message: res.config.url + ' 接口不存在'
      })
      // message(res.status + '： ' + '找不到对应的接口', 'error')
    } else if (res.status === 400) {
      message(res.status + '： ' + res.data.error_description, 'error')
    } else if (res.status === 202) {
      this.$router.push({ path: '/' })
    } else if (res.status === 503) { // 服务异常
      message(res.status + '： ' + res.data, 'error')
    } else {
      message(res.status + '： ' + res.data.msg, 'error')
    }
    return Promise.reject(error)
  }
)

function message(text, type) {
  Message({
    message: text,
    type: type,
    duration: 5 * 1000,
    customClass: 'element-msg'
  })
}
export default service
