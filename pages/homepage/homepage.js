// pages/homepage/homepage.js
let app = getApp();
let { axios, api } = app;
import { handleDict } from "../../common/utils/utils.js";
import { $Toast, $Message } from "../../dist/base/index";
import UserPanel from "../../common/new/UserPanel.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    times: 10,
    gameList: [],
    current: 0,
    // 比赛的规则
    rule: {
      // 比赛开始时间
      beginTime: -1,
      // 比赛结束时间
      endTime: -1,
      // 比赛描述
      desc: "",
      // 照片打开的热度临界值
      hotIntervalList: [],
      // 每日签到的最大次数
      signCount: -1,
      // 每日邀请的最大次数
      inviteCount: -1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    setTimeout(() => {
      this.getMypoint();
      this.getCurrentNo()
        .then(index => {
          this.idx = index;
          this.getReward(index);
          this.getUpvote(index);
          return this.getGameList(index);
        })
        .then(res => {
          this.setGameList(res);
        });
    }, 20);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let orgin = {
      title: "颜值圈",
      path: "/pages/homepage/homepage"
    };
    if (res.from === "button") {
      let {
        target: {
          dataset: { img }
        }
      } = res;
      orgin = Object.assign({}, orgin, {
        imageUrl: img,
        success: res => {
          this.addPoint("invite");
          $Toast({
            icon: "success",
            content: "分享成功"
          });
        }
      });
    }
    return orgin;
  },
  /**
   * 获取当前游戏轮次
   */
  getCurrentNo: function() {
    let url = api.game.current();
    return axios.get({ url }).then(res => {
      let {
        data: { index }
      } = res;
      if (index > -1) {
        return Promise.resolve(index);
      }
      this.setData({
        isEmpty: true
      });
      // return $Toast({
      //   content: '暂无活动',
      //   icon: 'warning',
      //   duration: 3,
      //   mask: true
      // });
    });
  },
  /**
   * 获取当前游戏列表
   */
  getGameList: function(index = 0) {
    let url = api.game.list();
    let data = {
      index
    };
    return axios.get({ url, data }).then(res => {
      let {
        data: { list }
      } = res;
      return Promise.resolve(list);
    });
  },
  /**
   * 设置当前列表
   */
  setGameList: function(list = []) {
    let gameList = list.map(el => new UserPanel(el));
    this.setData({ gameList });
  },
  /**
   * 点赞
   */
  upvote: function(e) {
    let {
      currentTarget: {
        dataset: { userid }
      }
    } = e;
    let url = api.game.upvote();
    let data = {
      type: "point",
      cast: 1,
      userId: userid
    };
    axios.post({ url, data }).then(res => {
      // 点赞成功后刷新数据
      this.getUpvote(this.idx);
      this.getGameList(this.idx).then(res => {
        this.setGameList(res);
      });
    });
  },
  /**
   * 获得myUpvote信息
   */
  getUpvote: function(index = 0) {
    let url = api.user.getUpvote();
    let data = { index };
    axios.get({ url, data }).then(res => {
      let {
        data: { upvoteList }
      } = res;
      this.setData({
        userDict: handleDict(upvoteList, "userId")
      });
    });
  },
  /**
   * 获得当前点数
   */
  getMypoint: function() {
    let url = api.user.getPoint();
    axios.get({ url }).then(res => {
      console.log(res);
    });
  },
  getReward: function(index) {
    let url = api.game.reward();
    let data = { index };
    axios.get({ url, data }).then(res => {
      if (res.code) {
        $Toast({
          icon: "error",
          content: res.message
        });
      } else {
        console.log("getReward", res.data);
        this.setData({ rule: res.data });
      }
    });
  },
  // 签到
  sign: function() {
    this.addPoint("sign").then(res => {
      let { data } = res;
      console.log("sign res:", data);
      if (data.code) {
        $Toast({
          icon: "error",
          content: data.message
        });
      } else {
      }
      // 通过后端处理
      // this.getMypoint();
      // 前端直接处理
      let current = this.data.times;
      this.setData({
        times: current + 1
      });
    });
  },
  /**
   * 增加点击数
   */
  addPoint: function(type) {
    let url = api.game.addPoint();
    let data = {
      cast: 1,
      type
    };
    return axios.post({ url, data });
  }
});
