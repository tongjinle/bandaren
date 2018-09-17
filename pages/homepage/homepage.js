// pages/homepage/homepage.js
let app = getApp();
let { axios, api } = app;
import { CODE } from '../../common/config/index.js';
import { handleDict, handleChangeDict} from '../../common/utils/utils.js';
import { $Toast, $Message } from '../../dist/base/index';
import UserPanel from '../../common/new/UserPanel.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    gameList: [],
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => {
      this.getMypoint();
      this.getCurrentNo().then(res => {
        this.idx = res;
        this.getUpvote(res);
        return this.getGameList(res)
      }).then(res => {
        this.setGameList(res);
      })
    }, 20)
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
  onShareAppMessage: function (res) {
    let orgin = {
      title: '颜值圈',
      path: '/pages/homepage/homepage',
    }
    if (res.from === 'button') {
      let { target: { dataset: { img } } } = res;
      orgin = Object.assign({}, orgin, {
        imageUrl: img, success: res => {
          this.addPoint('invite');
          $Toast({
            icon: 'success',
            content: '分享成功'
          })
        }
      });
    }
    return orgin;
  },
  /**
   * 获取当前游戏轮次
   */
  getCurrentNo: function () {
    let url = api.game.current();
    return axios.get({ url }).then(res => {
      let { data: { index } } = res;
      if (index > -1) {
        return Promise.resolve(index);
      }
      this.setData({
        isEmpty: true
      })
      // return $Toast({
      //   content: '暂无活动',
      //   icon: 'warning',
      //   duration: 3,
      //   mask: true
      // });
    })
  },
  /**
   * 获取当前游戏列表
   */
  getGameList: function (index = 0) {
    let url = api.game.list();
    let data = {
      index
    }
    return axios.get({ url, data }).then(res => {
      let { data: { list } } = res;
      return Promise.resolve(list);
    })
  },
  /**
   * 设置当前列表
   */
  setGameList: function (list = []) {
    let gameList = list.map(el => new UserPanel(el));
    this.setData({ gameList });
  },
  /**
   * 点赞
   */
  upvote: function (e) {
    this.chooseType().then(type => {
      let { currentTarget: { dataset: { userid } } } = e;
      let url = api.game.upvote();
      let data = {
        type,
        cast: 1,
        userId: userid,
      }
      if(this.data[type]<=0){
        return $Toast({
          type:'warning',
          content:`${type}不足`
        })
      }
      axios.post({ url, data }).then(res => {
        let { code } = res.data;
        if (!code) {
          // 前端处理
          let userDict = handleChangeDict(this.data.userDict,userid);
          let gameList = this.data.gameList.map(el=>{
            if(el.userId === userid){
              let curTotal = el.total;
              return Object.assign({},el,{total:curTotal+1});
            }else{
              return el
            }
          })
          this.setData({
            userDict,
            gameList,
            [type]: this.data[type] - 1
          })
        }
        if (code === CODE.NO_USER) {
          // 打榜者不存在处理方式
          $Toast({
            type: 'error',
            content: res.data.message,
          });
        }
      })
    });
  },
  /**
   * 获得myUpvote信息
   */
  getUpvote: function (index = 0) {
    let url = api.user.getUpvote();
    let data = { index };
    axios.get({ url, data }).then(res => {
      let { data: { upvoteList } } = res;
      this.setData({
        userDict: handleDict(upvoteList, 'userId')
      })
    })
  },
  /**
   * 获得当前点数
   */
  getMypoint: function () {
    let url = api.user.getPoint();
    axios.get({ url }).then(res => {
      let {data:{ point,coin }} = res;
      this.setData({
        point,coin
      })
    })
  },
  sign: function () {
    $Toast({
      icon: 'success',
      content: '签到成功'
    })
    this.addPoint('sign');
  },
  /**
   * 增加点击数
   */
  addPoint: function (type = 'sign') {
    let url = api.game.addPoint();
    let data = {
      cast: 1,
      type,
    }
    axios.post({ url, data }).then(res => {
      let { data: { point,coin } } = res;
      let currentPoint = this.data.point;
      let currentCoin = this.data.coin;
      this.setData({
        point: currentPoint + point,
        coin: currentCoin + coin
      })
    })
  },
  /**
   * chooseType
   */
  chooseType: function () {
    return new Promise(resolve => {
      let itemList = ['point', 'coin']
      wx.showActionSheet({
        itemList,
        success: function (res) {
          let { tapIndex } = res;
          resolve(itemList[tapIndex]);
        }
      })
    })
  }
})