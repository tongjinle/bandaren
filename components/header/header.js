// components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: { 
    times:{
      type:Number,
      value:0
    },
    imgUrl:{
      type:String,
      value:'',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    signIn:function(){
      this.triggerEvent('signIn');
    },
    share:function(){
      console.log(223);
    }
  } 
})
