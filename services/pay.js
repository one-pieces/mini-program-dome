/**
 * 微信支付相关服务
 */

import util from '../utils/util.js';
import api from '../config/api.js';
require('../libs/regenerator-runtime.js');

/**
 * 发起微信支付请求
 */
const payOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    const {
      // package在严格模式为保留字，因此不能定义为变量
      timeStamp, nonceStr, package: myPackage, signType, paySign
    } = await util.request(api.PayPrepayId, { orderId });
    wx.requestPayment({
      timeStamp,
      nonceStr,
      package: myPackage,
      signType,
      paySign,
      success: function(res) { resolve(res); },
      fail: function(res) { reject(res); },
      complete: function(res) { reject(res); },
    });
  })
}

export default {
  payOrder
}