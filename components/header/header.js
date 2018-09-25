// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    times: {
      type: Number,
      value: 0
    },
    imgUrl: {
      type: String,
      value: ""
    },
    signCount: {
      type: Number,
      value: 0
    },
    inviteCount: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    noticed: wx.getStorageSync("noticed.header")
  },

  /**
   * 组件的方法列表
   */
  methods: {
    signIn: function() {
      this.triggerEvent("signIn");
    },
    share: function() {
      // 打开分享页
    },
    closeNotice: function() {
      console.log("header:close notice ");
      wx.setStorageSync("noticed.header", true);
    }
  }
});
