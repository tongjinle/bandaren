// pages/homepage/homepage.js
let app = getApp();
let { axios,api} = app;
import { $Toast } from '../../dist/base/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    times:10,
    list:[{
      imgList: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
      username:"童金乐",
      headerImg:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536084698098&di=610e31b70ae90e59dd54b6de1e532171&imgtype=0&src=http%3A%2F%2Fimg2.woyaogexing.com%2F2017%2F06%2F19%2Fcd5b5de090ef8ae2%2521400x400_big.jpg",
      total:222,
      mine:12
    },{
      imgList: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
      username:"张晶杰",
      headerImg:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536084698098&di=610e31b70ae90e59dd54b6de1e532171&imgtype=0&src=http%3A%2F%2Fimg2.woyaogexing.com%2F2017%2F06%2F19%2Fcd5b5de090ef8ae2%2521400x400_big.jpg",
      total:221,
      mine:66
    },{
      imgList: ['http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'],
      username:"加油吧",
      headerImg:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536084698098&di=610e31b70ae90e59dd54b6de1e532171&imgtype=0&src=http%3A%2F%2Fimg2.woyaogexing.com%2F2017%2F06%2F19%2Fcd5b5de090ef8ae2%2521400x400_big.jpg",
      total:231,
      mine:23
    }],
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.getCurrentNo().then(res => {
        return this.getGameList(res)
      }).then(res=>{
        console.log(res);
      })
    },20)
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
  
  },
  getCurrentNo:function(){
    let url = api.game.current();
    return axios.get({url}).then(res=>{
      let { data:{index}} = res;
      if( index>-1 ){
        return Promise.resolve(index);
      }
      this.setData({
        isEmpty:true
      })
      // return $Toast({
      //   content: '暂无活动',
      //   icon: 'warning',
      //   duration: 3,
      //   mask: true
      // });
    })
  },
  getGameList:function(index=0){
    let url = api.game.list();
    let data = {
      index
    }
    return axios.get({url,data}).then(res=>{
      let { data:{ list } } = res;
      return Promise.resolve(list);
    })
  }
})