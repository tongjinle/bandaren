import { $Toast, $Message } from "../../dist/base/index";
let app = getApp();
let { axios, api } = app;
Page({
  data: {
    pageIndex: 0,
    galleryList: [],
    // 模式
    // list 或者 detail
    mode: "list",
    detail: undefined
  },
  onLoad(options) {
    console.log(options);
    let index = wx.getStorageSync("galleryPageIndex") || 0;
    this.setPageIndex(index);
    this.fetchGallery();
  },
  onPullDownRefresh() {
    console.log("hi world");
    this.fetchGallery();
  },

  setPageIndex(index) {
    this.setData({ pageIndex: index });
    wx.getStorageSync("galleryPageIndex", index);
  },

  fetchGallery(index) {
    let data = [
      {
        id: Math.floor(Math.random() * 1e8) + "",
        type: "pic",
        title: "帅哥",
        count: 100,
        logoUrl:
          "https://api.puman.xyz/static/images/1/超凶/1F048D0787EF9BD64FDBCCAD34F0EE16.jpg",
        resource: [
          "https://api.puman.xyz/static/images/1/超凶/1F048D0787EF9BD64FDBCCAD34F0EE16.jpg",
          "https://api.puman.xyz/static/images/1/超凶/2DACC2DE732B1435B77522B330397D8C.jpg",
          "https://api.puman.xyz/static/images/1/超凶/74AB4DAF7743D485A7A93CC71BB03AF2.jpg"
        ]
      },
      {
        id: Math.floor(Math.random() * 1e8) + "",
        type: "video",
        title: "可爱的小姐姐颜值要逆天了呀",
        count: 120,
        logoUrl:
          "https://api.puman.xyz/static/images/1/超凶/74AB4DAF7743D485A7A93CC71BB03AF2.jpg",
        resource: ["http://172.20.10.3:1216/1.mp4"]
      }
    ];
    let galleryList = [...this.data.galleryList, ...data];
    this.setData({ galleryList });
  },

  showDetail(e, d) {
    console.log("show detail", e);
    let id = e.detail.id;
    let data = this.data.galleryList.find(n => n.id === id);
    if (data) {
      this.setData({
        detail: data,
        mode: "detail"
      });
    }
  },
  hideDetail() {
    this.setData({
      mode: "list"
    });
  },
  onCloseDetail() {
    console.log("onCloseDetail");
    this.setData({
      mode: "list"
    });
  }
});
