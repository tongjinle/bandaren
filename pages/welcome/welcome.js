// components/list/list.js
import * as keys from "../../common/keys/index";

let app = getApp();
let { axios, api, wait } = app;
Page({
  data: {
    canTap: true,
    isShow: false,
    imgUrl: "../../assert/images/welcome.jpg"
  },
  onReady() {
    console.log("welcome ready");
    wx.getStorage({
      key: keys.hasUserInfo(),
      complete: res => {
        let data = res.data;
        console.log(data);
        if (data !== "1") {
          this.setData({ isShow: true });
          return;
        }

        // 直接跳转
        this.switchTab();
      }
    });
  },

  /**
   * 组件的方法列表
   */
  onGotUserInfo(e) {
    if (!this.data.canTap) {
      return;
    }

    this.setData({ canTap: false });
    let info = e.detail.userInfo;

    // 设置信息
    axios
      .post({
        url: api.common.setUserInfo(),
        data: {
          username: info.nickName,
          province: info.province,
          city: info.city,
          gender: info.gender,
          logoUrl: info.avatarUrl
        }
      })
      .then(res => {
        console.log(res.data);
        wx.setStorage({ key: keys.hasUserInfo(), data: "1" });
        wx.setStorage({
          key: keys.userInfo(),
          data: info,
          success: () => {
            this.switchTab();
          }
        });
      })
      .catch(() => {
        this.setData({ canTap: true });
      });
  },

  switchTab() {
    console.log("switchTab");
    wx.switchTab({ url: "/pages/homepage/homepage" });
  }
});
