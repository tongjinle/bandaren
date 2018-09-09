export default class UserPanel {
  constructor(arg){
    this.imgList = arg.photoList;
    this.total = arg.count;
    this.username = arg.username;
    this.userId = arg.userId;
    this.getHeaderImg();
  }
  
  getHeaderImg(){
    if(Array.isArray(this.imgList)){
      this.headerImg = this.imgList[0];
    }
  }
}