// pages/ucenter/addressAdd/addressAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    openSelectRegion: false,
    selectRegionList: [{
      id: 0, name: '省份', parent_id: 1, type: 1
    }, {
      id: 0, name: '城市', parent_id: 1, type: 2
    }, {
      id: 0, name: '区县', parent_id: 1, type: 3
    }],
    regionType: 1,
    regionList: [],
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
   * 设置区域选择状态
   */
  setRegionDoneStatus() {
    const { selectRegionList } = this.data;
    const selectRegionDone = selectRegionList.every(item => item.id !== 0);
    this.setData({ selectRegionDone });
  },
  /**
   * 选择区域
   */
  chooseRegion() {
    this.setData({
      oepnSelectRegion: !this.data.openSelectRegion
    });
    // 设置区域选择数据
    const { address } = this.data;
    // if (add)
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