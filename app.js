import Axios from "./common/utils/Axios.js";
import api from "./common/api/index.js";
import wait from "./common/utils/wait.js";
import * as keys from "./common/keys/index";

let axios = Axios.getInstance();
App({
  onLaunch: function() {
    wx.hideShareMenu();

    // 每次进入小程序 都删除一个token
    wx.removeStorage({
      key: keys.token(),
      success() {
        // _axios = Axios.getInstance();
      }
    });
  },
  getAxios() {
    return this._axios;
  },
  axios,
  api,
  wait,
  globalData: {
    userInfo: null
  }
});
