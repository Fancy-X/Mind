//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  	msg: '',
    username: ''
  },
  onLoad() {

  },
  setMsg(e) {
	  this.setData({
		  msg: e.detail.value
	  })
  },
  setUsername(e) {
	  this.setData({
		  username: e.detail.value
	  })
  },
  send() {
	  console.log(this.data);
  }
})
