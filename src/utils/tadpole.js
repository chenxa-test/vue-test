/** ===============================================
 *
 * 创建人：<a href="mailto:xiezy@eastcom-sw.com">Izzy.X</a><br>
 * 创建时间：2019/8/12 23:22
 * 创建说明：数据模型转换
 *
 * 修改人：
 * 修改时间：
 * 修改说明：
 *
 * @version 1.0.0
 * Copyright (c) 2019, Eastcom Technologies Co. Ltd.(杭州东方通信软件技术有限公司广州分公司). All Rights Reserved.
 *
 * This file contains proprietary information of Eastcom Technologies Co. Ltd. Copying or
 * reproduction without prior written approval is prohibited.
 =============================================== **/
import _mapValues from 'lodash/mapValues'
import _set from 'lodash/set'
import _get from 'lodash/get'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'
import _isArray from 'lodash/isArray'
import _isDate from 'lodash/isDate'
import _isBoolean from 'lodash/isBoolean'

class Model {
  constructor(options = {}) {
    this._attributes = {
      ...options
    }
  }

  /**
   * 根据初始定义的模型，解析，映射赋值
   * 将后台模型转为前台模型
   * @param {*} data
   * @returns {Model}
   */
  parse(data = {}) {
    _mapValues(this._attributes, (attribute, key) => {
      const path = attribute.property
      const distValue = _get(data, path)
      /*
      const type = new attribute.type()
      const unit = attribute.unit
      if (distValue) {
        distValue = this.compose(
          distValue,
          type,
          unit
        )
      }
      */
      const value =
        distValue || this.getDefaultValue(attribute.value, attribute.type)
      this.set(key, value)
    })
    return this
  }

  /**
   * 反向映射数据
   * 将前端模型转为后端模型
   * @param {*} data 需要转化的数据
   * @returns {Model|any}
   */
  traverse(data = {}) {
    if (!data) return this
    const object = Object.create(null)
    _mapValues(this._attributes, (attribute, key) => {
      const path = attribute.property
      // const unit = attribute.unit
      // const type = new attribute.type()
      const sourceValue = data[key]
      if (sourceValue) {
        // const value = this.discompose(sourceValue, unit, key, type)
        _set(object, path, sourceValue)
      }
    })
    return object
  }

  /**
 * 设置属性值
 * @param {*} key
 * @param {*} value
 */
  set(key, value) {
    this[key] = value
  }

  /**
 * 获取属性值
 * @param {*} key
 * @param {*} value
 */
  get(key, value) {
    return this[key]
  }

  /**
 * 获取默认值
 * @param {*} value
 * @param {*} type
 */
  getDefaultValue(value, type) {
    if (!value) {
      return this.setDefaultValue(type)
    } else {
      return value
    }
  }

  /**
 * 设置默认值
 * @param {*} Type
 */
  setDefaultValue(Type) {
    let value = ''
    const type = new Type()
    if (_isNumber(type)) {
      value = 0
    } else if (_isString(type)) {
      value = ''
    } else if (_isArray(type)) {
      value = []
    } else if (_isBoolean(type)) {
      value = true
    } else if (_isDate(type)) {
      value = Date.now()
    }

    return value
  }
}

export default Model
