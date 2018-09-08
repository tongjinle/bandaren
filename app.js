import Axiso from './common/utils/Axios.js';
import api from './common/api/index.js';
const axios = Axiso.getInstance();
App({
  onLaunch: function() {
  },
  axios,
  api,
  globalData: {
    userInfo: null
  }
});