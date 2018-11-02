import { $Toast, $Message } from "../../dist/base/index";
let app = getApp();
let { axios, api } = app;
Page({
  data: {
    logoUrl: "",
    address: "",
    username: "",
    pointCount: 0,
    isSign: true,
    canInvite: false,
    inviteTip: "",
    // 剩余的邀请次数
    inviteCount: 0
  },
  onLoad() {
    this.setUserInfo();
  },
  onShow() {
    console.log("user show");
    this.getMypoint();
    this.getMyAddPoint();
  },
  getMypoint() {
    let url = api.user.getPoint();
    axios.get({ url }).then(res => {
      let { data } = res;
      this.setData({ pointCount: data.point });
    });
  },
  getMyAddPoint() {
    let url = api.game.myAddPoint();
    axios.get({ url }).then(res => {
      let {
        data: { sign, invite }
      } = res;
      this.setSignCount(sign);
      this.setInviteCount(invite);
    });
  },
  setUserInfo() {
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    if (userInfo) {
      this.setData({
        logoUrl: userInfo.avatarUrl,
        username: userInfo.nickName,
        address: [userInfo.province, userInfo.city].join(" ")
      });
    }
  },
  setSignCount(count) {
    let isSign = count === 0;
    this.setData({
      isSign
    });
  },
  setInviteCount(count) {
    let inviteTip;
    let canInvite = count !== 0;
    this.setData({ canInvite });
    if (canInvite) {
      inviteTip = `还有${count}次转发机会`;
    } else {
      inviteTip = `你已经用完今天的转发次数了`;
    }
    this.setData({ inviteTip });
  },
  // 分享收益
  invite() {
    this.addPoint("invite").then(res => {
      let { data } = res;
      console.log("sign res:", data);
      if (data.code) {
        $Toast({
          icon: "error",
          content: data.message
        });
      } else {
        $Toast({
          icon: "success",
          content: `成功增加代币${data.point}枚`
        });
        // 通过后端处理
        // this.getMypoint();
        // 前端直接处理
        // 1. point+1
        // 2. signCount-1
        this.setData({
          pointCount: this.data.pointCount + data.point
        });
        this.setInviteCount(this.data.inviteCount - 1);
      }
    });
  },
  // 签到
  sign() {
    this.addPoint("sign").then(res => {
      let { data } = res;
      console.log("sign res:", data);
      if (data.code) {
        $Toast({
          icon: "error",
          content: data.message
        });
      } else {
        $Toast({
          icon: "success",
          content: `成功增加代币${data.point}枚`
        });
        // 通过后端处理
        // this.getMypoint();
        // 前端直接处理
        // 1. point+1
        // 2. signCount-1
        this.setData({
          pointCount: this.data.pointCount + data.point
        });
        this.setSignCount(0);
      }
    });
  },
  /**
   * 增加点击数
   */
  addPoint(type) {
    let url = api.game.addPoint();
    let data = {
      type
    };
    return axios.post({ url, data });
  },
  onShareAppMessage(res) {
    let orgin = {
      title: "颜值图鉴",
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
          this.invite();
          $Toast({
            icon: "success",
            content: "分享成功"
          });
        }
      });
    }
    return orgin;
  }
});
