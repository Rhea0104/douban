// pages/comment/comment.js
const db = wx.cloud.database()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieid: 0,  //电影id
    detail: {},  //电影详细信息
    content: "", //评论初始值
    score: 5,     //初始值5,
    images: [],    //保存用户选中图片
    fileIds: [],   //保存
    name:"",
    list: []
  },
  jumpMyComment(){
    wx.navigateTo({
      url: "/pages/myComment/myComment?id="+this.data.movieid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.接收电影列表传递参数id并且保存data
    console.log(options.id)
    this.setData({
      movieid: options.id
    })
    //2.提示数据加载框
    wx.showLoading({
      title: "加载中"
    })
    //3.调用云函数，将电影id传递给云函数
    wx.cloud.callFunction({
      name: "getDetail",          //云函数名称
      data: { movieid: options.id }  //参数
    }).then(res => {
      //4.获取云函数返回的数据 并且保存data
      // console.log(res.result)
      //4.1将字符串转 js obj
      var obj = JSON.parse(res.result)
      console.log(obj)
      //4.2保存data
      this.setData({
        detail: obj
      })
      //5.隐藏加载框
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  loadMore() {
    db.collection("comment").where({
      movieid:this.data.movieid
    }).get().then(result => {
      console.log(result)
      var list = result.data
      list.reverse()
      this.setData({
        list: list
      })
    }).catch(err => {
      console.log(err)
    })
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
    this.loadMore()
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
    this.loadMore()
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