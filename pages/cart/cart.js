// pages/cart/cart.js
import util from '../../utils/util.js';
import api from '../../config/api.js';
import user from '../../services/user.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../libs/regenerator-runtime';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoods: [],
    cartTotal: {
      goodsCount: 0,
      goodsAmount: 0.00,
      checkedGoodsCount: 0,
      checkedGoodsAmount: 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  // 获取购物车列表
  async getCartList() {
    const { cartList: cartGoods, cartTotal } = await util.request(api.CartList);
    this.setData({ 
      cartGoods,
      cartTotal,
      checkedAllStatus: this.isAllChecked(cartGoods)
    });
  },
  // 是否全选
  isAllChecked(cartGoods) {
    return (cartGoods || this.data.cartGoods).every(item => item.checked);
  },
  // 勾选商品
  async checkedItem(event) {
    const { itemIndex } = event.target.dataset;
    const { isEditCart } = this.data;
    if (isEditCart) {
      // 编辑状态
      const { cartGoods } = this.data;      
      const tmpCartData = cartGoods.map(item => item);
      let item = tmpCartData[itemIndex];
      item.checked = !item.checked;
      this.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: this.isAllChecked(cartGoods),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      })
    } else {
      const {
        product_id: productIds,
        checked
      } = this.data.cartGoods[itemIndex];
      const { cartList: cartGoods, cartTotal } = await util.request(api.CartChecked, {
        productIds, isChecked: checked ? 0 : 1
      }, 'POST');
      this.setData({
        cartGoods,
        cartTotal, 
        checkedAllStatus: this.isAllChecked(cartGoods)
      })
    }
  },
  // 获取勾选商品的数量
  getCheckedGoodsCount() {
    const { cartGoods } = this.data;
    return cartGoods
      .filter(item => item.checked)
      .reduce((preResult, item) => preResult + item.number, 0);
  },
  // 全选
  async checkedAll() {
    const { isEditCart } = this.data;
    const checkedAllStatus = this.isAllChecked();
    if (isEditCart) {
      const tmpCartData = this.data.cartGoods.map(item => {
        item.checked = !checkedAllStatus;
        return item;
      });
      this.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: !checkedAllStatus,
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      })
    } else {
      const productIds = this.data.cartGoods.map(item => item.product_id).join(',');
      const {
        cartList: cartGoods, cartTotal
      } = await util.request(api.CartChecked, { 
        productIds, 
        isChecked: checkedAllStatus ? 0 : 1
      }, 'POST');
      this.setData({
        cartGoods, 
        cartTotal,
        checkedAllStatus: this.isAllChecked(cartGoods)
      });
    }
  },
  // 编辑购物车
  editCart() {
    const { isEditCart } = this.data;
    if (isEditCart) {
      this.getCartList();
      this.setData({ isEditCart: !isEditCart });
    } else {
      const { cartGoods } = this.data;      
      this.setData({
        editCartList: cartGoods,
        cartGoods: cartGoods.map((item) => (item.checked = false,item)),
        isEditCart: !isEditCart,
        checkedAllStatus: this.isAllChecked(),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      })
    }
  },
  // 更新购物车
  updateCart(productId, goodsId, number, id) {
    util.request(api.CartUpdate, { productId, goodsId, number, id }, 'POST');
  },
  // 减少商品数量
  cutNumber(event) {
    const { itemIndex } = event.target.dataset;
    const { cartGoods } = this.data;
    const cartItem = cartGoods[itemIndex];
    if (cartItem.number > 1) {
      cartItem.number = cartItem.number - 1;    
      this.setData({ cartGoods });
      const { product_id, goods_id, number, id } = cartItem;
      this.updateCart(product_id, goods_id, number, id);
    }
  },
  // 增加商品数量
  addNumber(event) {
    const { itemIndex } = event.target.dataset;
    const { cartGoods } = this.data;
    const cartItem = cartGoods[itemIndex];
    cartItem.number = cartItem.number + 1;
    this.setData({ cartGoods });
    const { product_id, goods_id, number, id } = cartItem;
    this.updateCart(product_id, goods_id, number, id);
  },
  // 切换到确认订单页
  async checkoutOrder() {
    try {
      // 判断是否有登录
      await user.checkLogin();
      const { cartGoods } = this.data;
      const checkedGoods = cartGoods.filter(item => item.checked);
      if (checkedGoods.length) {
        wx.navigateTo({
          url: '../shopping/checkout/checkout'
        });
      }
    } catch(e) {
      util.showErrorToast('请先登录');
    }
  },
  // 删除所选商品
  async deleteCart() {
    let productIds = this.data.cartGoods.filter(item => item.checked).map(item => item.product_id);
    if (!productIds.length) {
      return false;
    }
    productIds = productIds.join(',');
    const { cartList, cartTotal } = await util.request(api.CartDelete, { productIds }, 'POST');
    const cartGoods = cartList.map(item => (item.checked = false, item));
    this.setData({
      cartGoods,
      cartTotal,
      checkedAllStatus: this.isAllChecked(cartGoods)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.getCartList();
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