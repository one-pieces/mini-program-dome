// pages/ucenter/index/index.js
import user from '../../../services/user.js';
import util from '../../../utils/util.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../../libs/regenerator-runtime';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    menuItems: [{
      url: '/pages/ucenter/order/order',
      iconClass: 'order',
      label: '我的订单'
    }, {
      url: '/pages/ucenter/collect/collect',
      iconClass: 'address',
      label: '我的收藏'
    }, {
      url: '/pages/ucenter/address/address',
      iconClass: 'address',
      label: '地址管理'
    }]
  },
  /**
   * 登录
   */
  async goLogin() {
    try {
      const { userInfo, token } = await user.loginByWeixin();
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
      this.setData({ userInfo });
    } catch(err) {
      console.log('goLogin fail, ', err);
      util.showErrorToast(err);
    }
  },
  /**
   * 跳转到某个页面
   */
  navigatorTo(event) {
    const { token } = app.globalData;
    if (!token) {
      util.showErrorToast('点击头像登录');
      return;
    }
    const { url } = event.currentTarget.dataset;
    wx.navigateTo({ url });
  },
  /**
   * 登出用户
   */
  exitLogin() {
    wx.showModal({
      title: '',
      content: '退出登录？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('app globalData', app.globalData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');

    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})