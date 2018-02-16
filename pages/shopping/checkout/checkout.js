// pages/shopping/checkout/checkout.js
import util from '../../../utils/util.js';
import api from '../../../config/api.js';
import pay from '../../../services/pay.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../../libs/regenerator-runtime';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, // 快递费
    couponPrice: 0.00, //优惠券价格
    orderTotalPrice: 0.00, // 订单总价
    actualPrice: 0.00, // 实际需要支付的总价
    addressId: 0,
    couponId: 0
  },
  /**
   * 获取checkout页面信息
   */
  async getCheckoutInfo() {
    const { addressId, couponId } = this.data;
    const {
      checkedGoodsList,
      checkedAddress,
      actualPrice,
      checkedCoupon,
      couponList,
      couponPrice,
      freightPrice,
      goodsTotalPrice,
      orderTotalPrice
    } = await util.request(api.CartCheckout, { addressId, couponId });
    this.setData({
      checkedGoodsList,
      checkedAddress,
      actualPrice,
      checkedCoupon,
      couponList,
      couponPrice,
      freightPrice,
      goodsTotalPrice,
      orderTotalPrice
    });
  },
  /**
   * 跳转到选择地址页
   */
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address'
    });
  },
  /**
   * 跳转到新增地址页
   */
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd'
    });
  },
  /**
   * 确认下单
   */
  async submitOrder() {
    const { addressId, couponId } = this.data;
    if (addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    try {
      const { id: orderId } = (await util.request(api.OrderSubmit, { addressId, couponId }, 'POST')).orderInfo;
      try {
        await pay.payOrder(parseInt(orderId));
        wx.redirectTo({
          url: `/pages/payResult/payResult?status=1&orderId=${orderId}`
        });
      } catch (e) {
        wx.redirectTo({
          url: `/pages/payResult/payResult?status=0&orderId=${orderId}`
        });
      }
    } catch(e) {
      util.showErrorToast('下单失败');
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const addressId = wx.getStorageSync('addressId');
      addressId && this.setData({ addressId });

      const couponId = wx.getStorageSync('couponId');
      couponId && this.setData({ couponId });
    } catch(e) {
      console.log('Shopping checkout getting addressId fails');
    }
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
    this.getCheckoutInfo();
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