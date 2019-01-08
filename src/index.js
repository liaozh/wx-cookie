/*
 * @Author: lzh
 * @Date: 2018-12-28 09:17:48
 * @LastEditors: lzh
 * @LastEditTime: 2019-01-05 15:49:56
 * @Description: 微信小程序支持cookie
 */

import WxCookie from './WxCookie'
/**
 * @description: 小程序支持cookie
 * @param {Object} wx 小程序对象
 * @param {Funciton} wx.request 小程序请求数据方法
 */
const wxCookie = (function (wx, request) {
  // 创建操作cookie实例
  const wxCookie = new WxCookie()
  /**
   * @description: 代理函数
   * @param {Object} options 配置项
   */
  function requestProx (options) {
    // 默认配置 默认开启cookie
    options.cookie = options.cookie === undefined || !!options.cookie
    options.dataType = options.dataType || 'json'

    if (options.cookie) {
      const domain = options.url.split('/')[2]
      const path = options.url.split(domain).pop()
      // 获取cookies 在header带上
      const cookies = wxCookie.getRequestCookie(domain, path)
      options.header = options.header || {}
      options.header['Cookie'] = cookies
      options.header['X-Requested-With'] = 'XMLHttpRequest'
      if (options.dataType === 'json') {
        options.header['Accept'] = 'application/json, text/plain, */*'
      }
      const successCallBack = options.success
      options.success = function (res) {
        // 设置cookie 下一次请求带上
        let cookies = res.header['Set-Cookie'] || res.header['set-cookie'] || ''
        wxCookie.setRequestCookie(cookies, domain)
        successCallBack && successCallBack(res)
      }
      // 使用wx.request发送请求
      request(options)
    }
  }
  // 使用Object.defineProperty 劫持wx.request方法
  try {
    Object.defineProperty(wx, 'request', {
      value: requestProx
    })
    Object.defineProperty(wx, 'requestWithCookie', {
      value: requestProx
    })
  } catch (error) {
    throw Error('初始化失败,该方法无效...')
  }
  // 支持设置别名
  wxCookie.config = function (options = {requestAlias: 'wxCookie'}) {
    Object.defineProperties(wx, options.requestAlias, requestProx)
  }
  return wxCookie
})(wx, wx.request)

export default wxCookie
