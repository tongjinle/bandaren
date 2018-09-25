Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    goto({ detail }) {
      let index = detail.key;
      let urls = ["../homepage/homepage", "../abc/abc"];
      let url = urls[index];
      console.log(detail, url);
      wx.navigateTo({
        url
      });
    }
  }
});
