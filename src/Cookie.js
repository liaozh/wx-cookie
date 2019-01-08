/*
 * @Author: lzh
 * @Date: 2018-12-29 16:42:58
 * @LastEditors: lzh
 * @LastEditTime: 2019-01-05 20:52:16
 * @Description: Cookie类
 */
import setCookie from 'set-cookie-parser'

/**
 * @description: Cookie类
 */
class Cookie {
  constructor (item) {
    this.name = item.name
    this.value = item.value || ''
    this.domain = item.domain || ''
    this.path = item.path || '/'
    this.expires = item.expires ? new Date(item.expires) : null
    this.maxAge = item.maxAge ? parseInt(item.maxAge) : null
    this.httpOnly = !!item.httpOnly
    // 记录时间
    this.dataTime = item.dateTime ? new Date(item.dateTime) : new Date()
  }
  /**
   * @description: 将cookie字符串设置为对象
   * @param {String} cookies 字符串
   * @return:
   */
  set (cookies = '') {
    let cookie = setCookie.parse(cookies)[0]
    if (cookie) {
      Object.assign(this, cookie)
      // 更新设置时间
      this.dateTime = new Date()
    }
    return this
  }
  /**
   * @description: 判断cookie是否过期
   * @return: boolean
   */
  isExpired () {
    // maxAge 为 0，无效
    if (this.maxAge === 0) {
      return true
    }
    // 存活秒数超出 maxAge，无效
    if (this.maxAge > 0) {
      let seconds = (Date.now() - this.dateTime.getTime()) / 1000
      return seconds > this.maxAge
    }
    // expires 小于当前时间，无效
    if (this.expires && this.expires < new Date()) {
      return true
    }
    return false
  }
}
export default Cookie
