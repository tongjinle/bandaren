import Axiso from "./common/utils/Axios.js";
import api from "./common/api/index.js";
import wait from "./common/utils/wait.js";
const axios = Axiso.getInstance();
App({
  onLaunch: function() {
    wx.hideShareMenu();
  },
  axios,
  api,
  wait,
  globalData: {
    userInfo: null
  }
});
