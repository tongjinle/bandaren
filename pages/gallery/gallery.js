import { $Toast, $Message } from "../../dist/base/index";
let app = getApp();
let { axios, api } = app;
Page({
  data: {},
  onLoad() {},
  onPullDownRefresh() {
    console.log("hi world");
  }
});
