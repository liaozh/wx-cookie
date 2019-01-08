/*
 * @Author: lzh
 * @Date: 2018-12-29 15:11:50
 * @LastEditors: lzh
 * @LastEditTime: 2019-01-08 18:51:55
 * @Description: cookie操作类
 */

import setCookie from 'set-cookie-parser'
import Cookie from './Cookie'
/**
 * @description: cookie操作类
 */
class WxCookie {
  constructor () {
    //   存储名字
    this.storageName = '__wxCookies__'
    // 本地cookies
    this.localCookies =  this.getLocalCookies()
  }
  /**
       * @description: 获取cookies
       * @param {String} domain 域名
       * @param {String} path 路径
       * @return:
       */
  getRequestCookie (domain, path) {
    let cookies =  this.getLocalCookies()
    let str = ''
    for (let item of cookies) {
      if (item.domain === domain && item.path === path) {
        str += `${item.name}=${item.value}; `
      }
    }
    return str
  }
  /**
       * @description: 保存cookies
       * @param {String} cookies 字符串
       * @return:
       */
  setRequestCookie (cookies, domain) {
    // 将字符串转换成 [{},{}]
    let parsedCookies = setCookie.parse(setCookie.splitCookiesString(cookies))
    const cookieArray = parsedCookies.map((item) => {
      if (!item.domain) item.domain = domain
      return new Cookie(item)
    })
    this.setCookiesToStorage(cookieArray)
  }
  /**
       * @description: 存储cookie 数组到storage
       * @param {Array}  cookieArray 对象数组
       * @return:
       */
  setCookiesToStorage (cookieArray) {
    let cookies = []
    for (let i = 0; i < this.localCookies.length; i++) {
      for (let j = 0; j < cookieArray.length; j++) {
        if (this.localCookies[i].name === cookieArray[j].name) {
          cookieArray.splice(j, 1)
        }
      }
    }
    cookies = this.localCookies.concat(cookieArray)
    // 保存到本地存储
    wx.setStorageSync(this.storageName, cookies)
  }
  /**
   * @description: 获取本地存储的cookies
   */
  getLocalCookies () {
    let cookies = wx.getStorageSync(this.storageName) || []
    let mapCookies = cookies.map(item => {
      return new Cookie(item)
    })
    // 把过期的cookie删除掉
    for (let i = 0; i < mapCookies.length; i++) {
      if (mapCookies[i].isExpired()) {
        mapCookies[i].splice(i, 1)
      }
    }
    return mapCookies
  }
}
export default WxCookie
