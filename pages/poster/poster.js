import { $Toast, $Message } from "../../dist/base/index";
let app = getApp();
let { axios, api } = app;
Page({
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    reward: {
      // 奖品的照片列表
      photoList: [],
      // 奖品描述
      desc: "",
      // 奖品的价值
      value: 0
    },
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
  onLoad() {
    console.log("onload");
    this.getCurrentNo().then(index => {
      this.currentIndex = index;
      return this.getReward(this.currentIndex);
    });
  },
  getCurrentNo() {
    let url = api.game.current();
    return axios.get({ url }).then(res => {
      let {
        data: { index }
      } = res;
      if (index > -1) {
        return Promise.resolve(index);
      }
    });
  },
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
        this.setData({ rule: res.data.rule, reward: res.data.reward });
      }
      return Promise.resolve();
    });
  }
});
