import api from "../api/index";
import * as keys from "../../common/keys/index";

const app = getApp();
const ErrToken = 800;
export default class Axios {
  constructor(arg) {}

  static getInstance(arg) {
    if (!Axios.instance) {
      Axios.instance = new Axios(arg);

      // let token = wx.getStorageSync("token");
      // let expires = wx.getStorageSync("expires");
      // console.log(expires, Date.now());
      // if (!token || (expires && expires < Date.now())) {
      //   Axios.instance.login();
      // }
    }
    return Axios.instance;
  }

  post(options) {
    return this.__handleRequest(options).then(({ header, data, url }) => {
      return this.__handleHttpRequest(url, data, header, "POST");
    });
  }

  get(options) {
    return this.__handleRequest(options).then(({ header, data, url }) => {
      return this.__handleHttpRequest(url, data, header, "GET");
    });
  }

  __handleRequest(options) {
    let { url, data, noStore } = options;
    if (!url) {
      throw Error("url is necessary");
    }
    // let token = wx.getStorageSync("token");
    let token;
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: keys.token(),
        complete: res => {
          token = res.data;
          resolve(res.data);
          console.log("getStorage.token", token);
        }
      });
    })
      .then(token => {
        console.log("getStorage.token in then", token);
        if (!token) {
          return this.login();
        }
        return token;
      })
      .then(token => {
        // 异步设置token
        wx.setStorage({
          key: keys.token(),
          data: token
        });

        return {
          header: { token },
          url,
          data
        };
      });

    let header = { token };
    this.store = { url, data };
    data = typeof data === "string" ? JSON.parse(data) : data;
    data = Object.assign({}, data);
    return { header, data, url };
  }

  __handleHttpRequest(url, data, header, method = "GET") {
    let args = [url, data, header];
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        header,
        success: res => {
          // TODO
          // 判断token失效的时候
          let code = res.data.code;
          if (code) {
            if (ErrToken === code) {
              console.log(res.data);
            }
          } else {
            resolve(res);
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  }

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          let { code } = res;
          console.log({ code });
          let url = api.user.getToken();
          let data = { code };
          wx.request({
            url,
            data,
            success: res => {
              let { token, expires } = res.data;
              wx.setStorage({ key: keys.token(), data: token });
              wx.setStorage({ key: keys.expires(), data: expires });
              resolve(token);
            }
          });
        }
      });
    });
  }
}
