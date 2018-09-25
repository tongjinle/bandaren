// components/list/list.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: "String",
      value:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1536084698098&di=610e31b70ae90e59dd54b6de1e532171&imgtype=0&src=http%3A%2F%2Fimg2.woyaogexing.com%2F2017%2F06%2F19%2Fcd5b5de090ef8ae2%2521400x400_big.jpg"
    },
    mine: {
      type: "Number",
      value: 20
    },
    count: {
      type: "Number",
      value: 521
    },
    username: {
      type: "String",
      value: "加油!威基基"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
});
