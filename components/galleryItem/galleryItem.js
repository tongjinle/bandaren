// components/list/list.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: {
      type: "String",
      value: ""
    },
    // 浏览量
    count: {
      type: "Number",
      value: 0
    },
    // 类型
    // 'pic'|'video'
    type: {
      type: "String",
      value: ""
    },
    // logo
    logoUrl: {
      type: "String",
      value: ""
    },
    // 资源
    // 一般来说,video就1个
    resource: {
      type: "Array",
      value: []
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
