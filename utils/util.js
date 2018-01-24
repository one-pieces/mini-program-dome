const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的request
 */
const request = (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        'X-You-Token': wx.getStorageSync('token')
      },
      success(res) {
        console.log('success');
        if (res.statusCode === 200) {
          // 处理未登录
          if (res.data.errno === 401) {
            console.log('快去登录');
          } else {
            const { data, errmsg, errno } = res.data;
            if (errno === 0) {
              resolve(data);
            } else {
              console.log(errmsg);
              wx.showToast({
                image: '/static/images/icon_error.png',
                title: errmsg,
                mask: true
              });
              reject(errmsg);
            }
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail(err) {
        reject(err);
        console.log('failed');
      }
    })
  });
}

/**
 * Promise封装微信会话
 */
const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: function(res) { resolve(true); },
      fail: function(res) { reject(false); },
      complete: function(res) {},
    });
  })
}

/**
 * Promise封装微信登录
 */
const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('login info', res);
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(res) { reject(res); },
      complete: function(res) {},
    })
  })
}

/**
 * 获取微信用户，返回Promise
 */
const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      withCredentials: true,
      lang: '',
      success: function(res) { 
        console.log('user info', res);
        resolve(res);
      },
      fail: function(res) { reject(res); },
      complete: function(res) {},
    });
  });
}

/**
 * 跳转到指定页面
 */
const redirect = (url) => {
  if (url) {
    wx.redirectTo({ url });
    return;
  }
  wx.redirectTo({ url: '/pages/auth/login/login' });  
}

/**
 * 错误弹框
 */
const showErrorToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: '',
    image: '/static/images/icon_error.png',
    duration: 0,
    mask: true,
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  });
}

export default {
  formatTime,
  request,
  checkSession,
  login,
  getUserInfo,
  redirectTo,
  showErrorToast
}
