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
            resolve(res.data);
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

export default {
  formatTime,
  request
}
