// pages/homepage/homepage.js
let app = getApp();
let { axios, api, wait } = app;
import { $Toast, $Message } from "../../dist/base/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: false,
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    // 当前比赛的序号
    currentIndex: -1,
    // point点数
    times: 10,
    // 当前比赛的list信息
    gameList: [],
    // list对应的swiper的当前展开页,默认是第一张
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
    },
    // 还可以签到的次数
    signCount: 0,
    // 还可以转发的次数
    inviteCount: 0,
    // 当前用户的热度贡献数组
    upvoteList: []
  },
  onShow() {
    this.getMypoint();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let check = () => {
      return true;
      let token = wx.getStorageSync("token");
      console.log({ token });
      return !!token;
    };
    let next = () => {
      // this.getMypoint();
      this.getCurrentNo().then(index => {
        this.currentIndex = index;
        if (index !== -1) {
          this.getReward(this.currentIndex)
            .then(() => {
              this.getMyAddPoint();
              this.getUpvote(this.currentIndex);
              return this.getGameList(this.currentIndex);
            })
            .then(res => {
              this.setGameList(res);
            });
        } else {
          this.setData({
            isEmpty: true
          });
        }
      });
    };
    wait(check, next);
  },

  /**
   * 获取当前游戏轮次
   */
  getCurrentNo() {
    let url = api.game.current();
    return axios.get({ url }).then(res => {
      let {
        data: { index }
      } = res;
      return Promise.resolve(index);

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
  getGameList(index = 0) {
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
  setGameList(list = []) {
    let gameList = list
      .map(el => {
        let rst = el;
        rst.logo = el.photoList[0];
        rst.hotNeed = this._getHotNeed(
          rst.count,
          this.data.rule.hotIntervalList
        );
        return rst;
      })
      .sort((a, b) => {
        return b.count - a.count;
      });
    this.setData({ gameList });
  },
  // 打榜点数的总和
  // 为了提高性能,会把多次的打榜点数求和,并且一次性发出去
  _upvoteCast: 0,
  _lazyHandle: undefined,
  _times: -1,
  // upvote锁
  _upvoteLock: false,
  // 计算是否需要刷新
  _hotNeed: 0,

  lazyUpvote(e) {
    const lazyInterval = 1000;
    let userId = e.currentTarget.dataset.userId;
    if (this._upvoteLock) {
      console.error("lock");
      return;
    }

    // 初始化this._times
    if (this._times == -1) {
      this._times = this.data.times;
      let currentCount = this.data.gameList.find(n => n.userId == userId).count;
      let hotIntervalList = this.data.rule.hotIntervalList;
      let hotNeed = this._getHotNeed(currentCount, hotIntervalList);
      this._hotNeed = hotNeed;
    }
    if (this._times > 0) {
      this._times--;
      this._upvoteCast++;

      {
        let times = this._times;
        let gameList = this.data.gameList.map(n => {
          let obj = { ...n };
          if (obj.userId === userId) {
            obj.count++;
            obj.hotNeed = this._getHotNeed(
              obj.count,
              this.data.rule.hotIntervalList
            );
          }
          return obj;
        });
        this.setData({ times, gameList });
      }

      console.error("clearTimeout");

      clearTimeout(this._lazyHandle);
    } else {
      return;
    }

    // try to upvote
    this._lazyHandle = setTimeout(() => {
      this._upvoteLock = true;
      console.error("locked", this._upvoteCast);
      this.upvote(userId, "point", this._upvoteCast).then(() => {
        this._upvoteCast = 0;
        this._times = -1;
        this._upvoteLock = false;
        this._hotNeed = 0;
        console.error("unlocked");
      });
    }, lazyInterval);
  },

  /**
   * 点赞
   */
  upvote(userId, type, cast) {
    let url = api.game.upvote();
    let data = {
      type,
      cast,
      userId
    };

    return axios.post({ url, data }).then(res => {
      if (res.code) {
        $Toast({ icon: "error", message: res.message });
      } else {
        // 点赞成功后刷新数据(前端来负责刷新)
        // 遇到热度的临界值,则开启弹窗,后台再次更新数据
        let hotNeed = this._hotNeed;
        if (hotNeed !== -1 && hotNeed <= cast) {
          // 弹窗
          $Toast({
            icon: "success",
            content: "恭喜成功打开了一个新的照片"
          });
          // 后台刷新
          this.getUpvote(this.currentIndex);
          this.getGameList(this.currentIndex).then(res => {
            this.setGameList(res);
          });
        }
      }
      return Promise.resolve();
    });
  },
  /**
   * 获得myUpvote信息
   */
  getUpvote(index = 0) {
    let url = api.user.getUpvote();
    let data = { index };
    axios.get({ url, data }).then(res => {
      let {
        data: { upvoteList }
      } = res;
      this.setData({
        upvoteList
      });
    });
  },
  /**
   * 获得当前点数
   */
  getMypoint() {
    let url = api.user.getPoint();
    axios.get({ url }).then(res => {
      let { data } = res;
      this.setData({ times: data.point });
    });
  },
  // 获取当前比赛的信息
  getReward(index) {
    let url = api.game.reward();
    let data = { index };
    return axios.get({ url, data }).then(res => {
      if (res.code) {
        $Toast({
          icon: "error",
          content: res.message
        });
      } else {
        console.log("getReward", res.data);
        this.setData({ rule: res.data.rule });
      }
      return Promise.resolve();
    });
  },

  // 获取用户当前addPoint的状态(addPoint是有限制的,sign每天1次,invite每天10次,具体数字由后端决定)
  getMyAddPoint() {
    let url = api.game.myAddPoint();
    axios.get({ url }).then(res => {
      let {
        data: { sign, invite }
      } = res;
      this.setData({
        signCount: sign,
        inviteCount: invite
      });
    });
  },
  _getHotNeed(hot, hotIntervalList) {
    if (
      !hotIntervalList ||
      !hotIntervalList.length ||
      hot >= hotIntervalList[hotIntervalList.length - 1]
    ) {
      return -1;
    }
    var interval = 0;
    for (var i = 0; i < hotIntervalList.length; i++) {
      if (hot < hotIntervalList[i]) {
        interval = hotIntervalList[i];
        break;
      }
    }
    return interval - hot;
  }
});
