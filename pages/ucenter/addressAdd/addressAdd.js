// pages/ucenter/addressAdd/addressAdd.js
import api from '../../../config/api.js';
import util from '../../../utils/util.js';
// 在微信小程序使用async,await需要引入regeneratorRuntime变量，具体请看https://ninghao.net/blog/5508
import regeneratorRuntime from '../../../libs/regenerator-runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRegionString: '',
    multiIndex: [],
    multiArray: [[], [], []],
    address: {
      id: 0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '',
      full_region: '',
      name: '',
      mobile: '',
      is_default: 0
    },
    addressId: 0,
    selectRegionDone: false
  },
  /**
   * 输入手机号响应事件
   */
  bindinputMobile(event) {
    const { address } = this.data;
    address.mobile = event.detail.value;
    this.setData({ address });
  },
  /**
   * 输入姓名响应事件
   */
  bindinputName(event) {
    const { address } = this.data;
    address.name = event.detail.value;
    this.setData({ address });
  },
  /**
   * 输入地址响应事件
   */
  bindinputAddress(event) {
    const { address } = this.data;
    address.address = event.detail.value;
    this.setData({ address });
  },
  /**
   * 设为默认响应事件
   */
  bindIsDefault(event) {
    const { address } = this.data;
    address.is_default = !address.is_default;
    this.setData({ address });
  },
  /**
   * 获取地址详情
   */
  async getAddressDetail() {
    const { addressId: id } = this.data;
    const address = await util.request(api.AddressDetail, { id });
    this.setData({ address });
  },
  /**
   * 打开省市区选择器
   */
  async openRegionPicker() {
    // 初始化省市区选择器
    let { multiArray, multiIndex } = this.data;
    multiIndex = [0, 0, 0];
    multiArray[0] = await util.request(api.RegionList, { parentId: 1 });
    multiArray[1] = await util.request(api.RegionList, { parentId: multiArray[0][0].id });
    multiArray[2] = await util.request(api.RegionList, { parentId: multiArray[1][0].id });
    this.setData({ multiArray, multiIndex });
  },
  /**
   * 省市区选择器值改变
   */
  bindMultiPickerChange(e) {
    const { multiArray, multiIndex, address } = this.data;
    console.log('picker发送选择改变，携带值为', e.detail.value, multiArray);
    this.setData({
      multiIndex: e.detail.value,
      address: Object.assign(address, {
        full_region: [
          multiArray[0][multiIndex[0]],
          multiArray[1][multiIndex[1]],
          multiArray[2][multiIndex[2]]
        ].map(item => item.name).join('')
      })
    });
  },
  /**
   * 省市区选择器列改变
   */
  async bindMultiPickerColumnChange(e) {
    const { column, value } = e.detail;
    console.log('修改的列为', column, '，值为', value);
    const { multiArray, multiIndex } = this.data;
    const selectItem = multiArray[column][value];
    multiIndex[column] = value;
    switch (column) {
      case 0:
        multiArray[1] = await util.request(api.RegionList, { parentId: selectItem.id });
        multiArray[2] = await util.request(api.RegionList, { parentId: multiArray[1][0].id });
        multiIndex[1] = 0;
        multiIndex[2] = 0;
        break;
      case 1:
        multiArray[2] = await util.request(api.RegionList, { parentId: selectItem.id });
        multiIndex[2] = 0;
        break;
    }
    this.setData({
      multiArray, multiIndex
    });
  },
  /**
   * 取消地址编辑
   */
  cancel() {
    wx.navigateBack();
  },
  /**
   * 确认保存地址
   */
  async confirm() {
    const { multiArray, multiIndex, address } = this.data;
    // 检验地址合法性
    if (address.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    if (address.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }
    if (address.full_region == '') {
      util.showErrorToast('请输入省市区');
      return false;
    }
    if (address.address == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    const province = multiArray[0][multiIndex[0]];
    const city = multiArray[1][multiIndex[1]];
    const district = multiArray[2][multiIndex[2]];
    address.province_id = province.id;
    address.district_id = district.id;
    address.city_id = city.id;

    await util.request(api.AddressSave, address, 'POST');
    wx.showToast({
      title: '保存成功'
    });
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id: addressId } = options;
    if (addressId) {
      this.setData({ addressId });
      this.getAddressDetail();
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