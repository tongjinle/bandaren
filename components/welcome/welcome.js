// components/list/list.js
let app = getApp();
let { axios, api, wait } = app;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    imgUrl: "../../assert/images/welcome.jpg"
  },
  ready() {
    console.log("welcome ready");
    let isShow = wx.getStorageSync("hasUserInfo") !== "1";
    this.setData({ isShow });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(e) {
      console.log(e);
      // this.triggerEvent("onGotUserInfo", e.detail.userInfo);
      // console.log(e);
      let info = e.detail.userInfo;
      wx.setStorageSync("hasUserInfo", "1");
      wx.setStorageSync("userInfo", JSON.stringify(info));
      this.setData({ isShow: false });

      // 设置信息
      axios.post({
        url: api.common.setUserInfo(),
        data: {
          username: info.nickName,
          province: info.province,
          city: info.city,
          gender: info.gender,
          logoUrl: info.avatarUrl
        }
      });
    }
  }
});
