/**
 * 用户相关服务
 */

import util from '../utils/util.js';
import api from '../config/api.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../libs/regenerator-runtime';

/**
 * 调用微信登录
 */
const loginByWeixin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
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