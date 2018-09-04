const { host, port } = require("../config/index");
const prefix = `https://${host}`;

export function test(cb) {
  return wx.request({
    url: prefix + "/test",
    success: cb
  });
}

export function getToken(code, cb) {
  wx.request({
    url: prefix + "/getToken",
    data: { code },
    success: res => {
      cb(res.data);
    }
  });
}

class UserRueset {
  constructor() {}

  setToken(token) {
    this.token = token;
  }

  get(params) {
    params = Object.assign(params, { method: "GET" });
    return this._request(params);
  }

  post(params) {
    params = Object.assign(params, { method: "POST" });
    return this._request(params);
  }

  _request(params) {
    let token = this.token;
    if (undefined === token) {
      return Promise.reject(new Errow("invalid token"));
    }

    let { url, data, method } = params;
    return new Promise((resolve, reject) => {
      wx.request({
        url: prefix + url,
        data,
        header: { token },
        success: ({ data }) => {
          // 如果有code,表示发生了错误
          if (data.code) {
            reject(data);
          } else {
            resolve(data);
          }
        },
        fail: () => {
          let err = new Error("request fail");
          reject(err);
        }
      });
    });
  }
}

export let userRequest = new UserRueset();
