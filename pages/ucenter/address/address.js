// pages/ucenter/address/address.js
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
   * 增加或修改地址
   */
  addressAddOrUpdate(event) {
    const { addressId } = event.currentTarget.dataset;
    console.log(event);
    wx.navigateTo({
      url: `/pages/ucenter/addressAdd/addressAdd?id=${addressId}`
    })
  },
  /**
   * 删除地址
   */
  deleteAddress(event) {
    console.log(event);
    wx.showModal({
      title: '',
      content: '确定要删除该地址？',
      success: async (res) => {
        if (res.confirm) {
          const { addressId: id } = event.target.dataset;
          await util.requset(api.AddressDelete, { id }, 'POST');
          this.getAddressList();
        }
      }
    })
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