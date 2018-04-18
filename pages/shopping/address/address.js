// pages/shopping/address/address.js
import util from '../../../utils/util.js';
import api from '../../../config/api.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../../libs/regenerator-runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },
  /**
   * 获取地址列表
   */
  async getAddressList() {
    const addressList = await util.request(api.AddressList);
    this.setData({ addressList });
  },
  /**
   * 跳转至地址修改页
   */
  gotoAddressEdit(event) {
    const { addressId } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/shopping/addressAdd/addressAdd?id=${addressId}`
    });
  },
  /**
   * 选中地址
   */
  selectAddress(event) {
    try {
      const { addressId } = event.currentTarget.dataset;
      wx.setStorageSync('shopping.addressId', addressId);
    } catch(e) {
      console.log('shopping address error: ', e);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
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