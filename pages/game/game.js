const app = getApp();
Page({
  data: {
    pointCount: 100,
    items: [100, 200],
    // 当前展开的index
    hotIndex: -1,
    list: []
  },
  onLoad() {
    console.log(app.globalData);

    let list = [
      {
        userId: "mm1",
        username: "mm1",
        count: 10000,
        photoList: ["../../images/star.png", "../../images/star.png"]
      }
    ];
    this.setData({ list });
  },
  inviteFirend() {
    console.log("invite firend");
  }
});
