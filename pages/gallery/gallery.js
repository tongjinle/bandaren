import { $Toast, $Message } from "../../dist/base/index";
let app = getApp();
let { axios, api } = app;
Page({
  data: {
    pageIndex: 0,
    pageSize: 2,
    galleryList: [],
    // 模式
    // list 或者 detail
    mode: "list",
    detail: undefined,
    isPullLock: false
  },
  onLoad() {
    this.fetchGallery(this.data.pageIndex);
  },
  onPullDownRefresh() {
    let index = this.data.pageIndex++;
    this.fetchGallery(index);
  },

  fetchGallery(index) {
    // 锁定下拉
    if (this.data.isPullLock) {
      return;
    }

    this.setData({ isPullLock: true });
    axios
      .get({
        url: api.game.gallery(),
        data: {
          pageIndex: index,
          pageSize: this.data.pageSize
        }
      })
      .then(res => {
        wx.stopPullDownRefresh();

        let data = res.data;
        let list = data.list;

        // 格式化list中date为文本
        // eg: 时间戳 => 2017-9-8
        list.forEach(n => {
          n.dateText = this.formatDate(n.date);
        });
        console.log(data);
        let galleryList = [...this.data.galleryList, ...list];
        this.setData({ galleryList });

        // 后续处理
        // 解锁下拉
        this.setData({ isPullLock: false });
        // 如果确实获取了新数据,那么pageIndex+1
        if (list && list.length) {
          this.setData({ pageIndex: index + 1 });
        }
      });
  },

  // 增加一个浏览量
  galleryCount(id) {
    axios.post({
      url: api.game.galleryCount(),
      data: {
        id
      }
    });
  },

  showDetail(e) {
    console.log("show detail", e);
    let id = e.detail.id;
    let data = this.data.galleryList.find(n => n.id === id);
    if (data) {
      this.setData({
        detail: data,
        mode: "detail"
      });

      // 浏览量
      this.galleryCount(id);
      let list = this.data.galleryList;
      list.forEach(n => {
        if (n.id === id) {
          n.count++;
        }
      });
      this.setData({
        galleryList: list
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
  },
  formatDate(date) {
    let d = new Date(date);
    return [d.getFullYear(), d.getMonth() - 0 + 1, d.getDate()].join("-");
  }
});
