// pages/ucenter/order/order.js
import util from '../../../utils/util.js';
import api from '../../../config/api.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../../libs/regenerator-runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },
  /**
   * 获取订单列表
   */
  async getOrderList() {
    const { data: orderList } = await util.request(api.OrderList);
    this.setData({ orderList });
  },
  /**
   * 跳转到付款页面
   */
  payOrder() {
    wx.redirectTo({
      url: '/pages/pay/pay'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
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