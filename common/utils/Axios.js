import api from "../api/index";
const app = getApp();
export default class Axios {
  constructor(arg) {}

  static getInstance(arg) {
    if (!Axios.instance) {
      Axios.instance = new Axios(arg);

      wx.removeStorageSync("token");
      Axios.instance.login();
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
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data,
        method,
        header,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  }

  login() {
    wx.login({
      success: res => {
        let { code } = res;
        let url = api.user.getToken();
        let data = { code };
        this.get({ url, data, noStore: true }).then(res => {
          let { token } = res.data;
          wx.setStorageSync("token", token);
        });
      }
    });
  }
}
