// pages/goods/goods.js
import util from '../../utils/util.js';
import api from '../../config/api.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../libs/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    // 规格页是否显示
    isSpecPageShown: false,
    cartGoodsCount: 0,
    userHasCollect: 0,
    relatedGoods: [],
    number: 1,
    noCollectImage: '/static/images/icon_collect.png',
    hasCollectImage: '/static/images/icon_collect_checked.png',
    gobackImage: '/static/images/detail_back.png'
  },

  async getGoodsInfo() {
    const { id } = this.data;
    const {
      info: goods,
      gallery,
      attribute,
      issue: issueList,
      comment,
      brand,
      specificationList,
      productList,
      userHasCollect
    } = await util.request(api.GoodsDetail, { id });
    this.setData({
      goods,
      gallery,
      attribute,
      issueList,
      comment,
      brand,
      specificationList,
      productList,
      userHasCollect
    });

    // 获取当前商品相关商品列表
    this.getGoodsRelated();
  },
  async getGoodsRelated() {
    const { id } = this.data;
    const { goodsList: relatedGoods } = await util.request(api.GoodsRelated, { id });
    this.setData({ relatedGoods });
  },
  // 切换规格数量页
  switchSpecPop() {
    this.setData({
      isSpecPageShown: !this.data.isSpecPageShown,
    })
  },
  // 添加或取消收藏
  async collectOrNot() {
    const { type } = await util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, 'POST');
    this.setData({
      userHasCollect: type === 'add' ? 1 : 0
    });
  },
  // 数量加一
  addNumber() {
    this.setData({
      number: this.data.number + 1
    });
  },
  // 数量减一
  cutNumber() {
    this.setData({
      number: this.data.number - 1 || 1
    });
  },
  // 添加商品到购物车
  async addToCart() {
    // 不是在选择规格页点击加入购物车，会先跳转到规格页让用户选择数量
    if (!this.data.isSpecPageShown) {
      this.setData({ isSpecPageShown: true });
      return;
    }
    // TODO 提示选择完整规格

    // TODO 根据选中的规格，判断是否有对应的SKU信息

    // TODO 验证库存

    // 添加到购物车
    const { goods, number, productList } = this.data;
    const { cartTotal } = await util.request(api.CartAdd, { goodsId: goods.id, number, productId: productList[0].id }, 'POST');
    wx.showToast({
      title: '添加成功'
    });
    // 关闭规格页
    this.switchSpecPop();
    this.setData({
      cartGoodsCount: cartTotal.goodsCount
    })
  },
  openCartPage() {
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options为页面跳转带来的参数
    this.setData({
      id: parseInt(options.id)
    });
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then((data) => {
      this.setData({
        cartGoodsCount: data.cartTotal.goodsCount
      });
    })
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