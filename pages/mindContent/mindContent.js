//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
	msg: {
		id: 123,
		username: '咸鱼一条',
		content: '是这样的啦嘎嘎嘎大是大非啊噶奥奥奥所多发所多发所阿斯蒂芬撒旦法撒旦法是大是大非阿斯顿发水电费sad发',
		comeOn: 123
	},
    comeOnIcon: '/images/comeon.png'
  },
  onLoad() {

  },
  changeIcon() {
  	if (this.data.comeOnIcon == '/images/comeon.png') {
  		this.setData({
		    comeOnIcon: '/images/comeon2.png',
		    'msg.comeOn': this.data.msg.comeOn + 1
	    })
    }else {
	    this.setData({
		    comeOnIcon: '/images/comeon.png',
		    'msg.comeOn': this.data.msg.comeOn - 1
	    })
    }
  }
})
