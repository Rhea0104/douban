// pages/myComment/myComment.js
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
    name: "",
    list: []
  },
  submit() {
    //1.上传9张图片
    // wx.showLoading({
    //   title: "评论中",
    // })
    //console.log(this.data.content+"_"+this.data.score)
    //2.上传图片到云函数
    //3.创建promise数组
    let promiseArr = []
    //4.创建循环9次
    for (let i = 0; i < this.data.images.length; i++) {
      //5.创建promise push数组中
      promiseArr.push(new Promise((reslove, reject) => {
        //5.1获取当前上传图片
        var item = this.data.images[i]
        //5.2创建正则表达式拆分文件后缀 .jpg .png
        let suffix = /\.\w+$/.exec(item)[0]
        //5.3上传图片 将data中图片上传云存储
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,  //上传至与云端路径
          filePath: item, //小程序临时路径
          success: res => {
            console.log(res.fileID)
            //5.4上传成功 将当前云存储fileID保存数组
            var ids = this.data.fileIds.concat(res.fileID)
            this.setData({
              fileIds: ids,
            })
            //5.5追加任务列表
            reslove()
          },
          //5.6失败显示出错信息
          fail: err => {
            console.log(err)
          }
        })
      }))
    }
    //6.一次性将图片 fileID保存集合中(集合一张图片)
    Promise.all(promiseArr).then(res => {
      //6.1添加数据
      db.collection("comment").add({
        data: {
          content: this.data.content,  //评论内容
          score: this.data.score,      //评论分数
          movieid: this.data.movieid,  //电影id
          fileIds: this.data.fileIds,   //上传图片id
          time: new Date().toLocaleDateString(),      //评论时间
          name: app.globalData.name
        }
      }).then(res => {
        wx.showToast({  //显示提示框
          title: '评价成功'
        })
      }).catch(err => {
        wx.showToast({
          title: '评价失败',
        })
      })
    })
  },
  uploadImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        const tempFiles = res.tempFilePaths;
        //预览 将用户选中图片保存
        this.setData({
          images: tempFiles
        })
      },
    })
  },
  onScoreChange(e) {
    //获取用户评分内容
    // console.log(e.detail)
    this.setData({
      score: e.detail
    })
  },
  onContentChange(e) {
    //获取用户输入框中的内容
    // console.log(e.detail)
    this.setData({
      content: e.detail
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