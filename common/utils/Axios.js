import api from "../api/index";
const app = getApp();
const ErrToken = 800;
export default class Axios {
  constructor(arg) {}

  static getInstance(arg) {
    if (!Axios.instance) {
      Axios.instance = new Axios(arg);

      let token = wx.getStorageSync("token");
      let expires = wx.getStorageSync("expires");
      console.log(expires, Date.now());
      if (!token || (expires && expires < Date.now())) {
        Axios.instance.login();
      }
    }
    return Axios.instance;
  }

  post(options) {
    let { header, data, url } = this.__handleRequest(options);
    return this.__handleHttpRequest(url, data, header, "POST");
  }

  get(options) {
    let { header, data, url } = this.__handleRequest(options);
    return this.__handleHttpRequest(url, data, header, "GET");
  }

  __handleRequest(options) {
    let { url, data, noStore } = options;
    if (!url) {
      throw Error("url is necessary");
    }
    let token = wx.getStorageSync("token");
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
              console.log("尝试获取一次新的token");
              console.log("step1", args);
              return this.login().then(() => {
                console.log("step2", args);
                let { header, data, url } = this.__handleRequest({
                  url: args.url,
                  data: args.data
                });
                console.log("url...", url);
                return this.__handleHttpRequest(url, data, header, method);
              });
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
          this.get({ url, data, noStore: true }).then(res => {
            let { token, expires } = res.data;
            wx.setStorageSync("token", token);
            wx.setStorageSync("expires", expires);
            resolve();
          });
        }
      });
    });
  }
}
