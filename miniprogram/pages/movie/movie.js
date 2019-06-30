// pages/movie/movie.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movielist: [],
  },
  onClickLeft(){
    wx.navigateTo({
      url: "/pages/address/address"
    })
  },
  jumpComment: function (e) {
    //获取电影id
    var id = e.target.dataset.movieid
    //跳转 保存并且跳转
    wx.navigateTo({
      url: "/pages/comment/comment?id=" + id,
    })
  },
  loadMore() {
    //1.调用云函数 movielist
    wx.cloud.callFunction({
      name: "movielist",   //云函数名称
      data: {
        start: this.data.movielist.length,
        count: 10
      }
    }).then(res => {
      //console.log(res)
      //将字符串转为js对象
      var obj = JSON.parse(res.result)
      //电影列表
      console.log(obj.subjects)
      this.setData({
        movielist: this.data.movielist.concat(obj.subjects)
      })
    }).catch(err => {
      console.log(err)
    })

    //2.将云函数返回的电影列表保存
    //3.显示当前组件
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
    this.loadMore()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ city: app.globalData.address })
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
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})