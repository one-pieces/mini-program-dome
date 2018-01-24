/**
 * 用户相关服务
 */

import util from '../utils/util.js';
import api from '../config/api.js';
require('../libs/regenerator-runtime.js');

/**
 * 调用微信登录
 */
const loginByWeixin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { code } = await util.login();
      const userInfo = await util.getUserInfo();
      const res = await util.request(api.AuthLoginByWeixin, { code, userInfo }, 'POST');
      wx.setStorageSync('userInfo', res.userInfo);
      wx.setStorageSync('token', res.token);
      resolve(res);
    } catch(err) {
      reject(err);
    }
  });
}

/**
 * 判断用户是否登录
 */
const checkLogin = () => {
  return new Promise((resolve, reject) => {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  })
}

export default {
  loginByWeixin,
  checkLogin
}