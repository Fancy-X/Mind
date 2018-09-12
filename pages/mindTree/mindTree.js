//index.js
//获取应用实例
const app = getApp()
var curX,
	curY,
	lanH,
	lanW,
	lanT

Page({
  data: {
    heart: [
	   {
	    touchX: "14rpx",
		touchY: "66rpx",
		trunkShow: true
      },
      {
	    touchX: "178rpx",
		touchY: "126rpx",
        trunkShow: true
      },
      {
	    touchX: "336rpx",
		touchY: "196rpx",
        trunkShow: true
      },
      {
        touchX: "496rpx",
		touchY: "94rpx",
        trunkShow: true
      },
      {
	    touchX: "632rpx",
		touchY: "188rpx",
        trunkShow: true
      }
    ],
    url: [
      {
        id: 111,
        name: '咸鱼一条'
      },
      {
        id: 222,
        name: '咸鱼两条'
      },
      {
          id: 333,
        name: '咸鱼三条'
      },
      {
          id: 444,
        name: '咸鱼四条'
      },
      {
          id: 555,
        name: '咸鱼五条'
      },
    ],
    animationData: {
    	basket: 'scaleSmall',
	    music: 'stop'
    },
    maskShow: true
  },
  onLoad() {
  	let $this = this

    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.loop = true
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46'
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
	    this.setData({
		    'animationData.music': ''
	    })
    })
    this.audio = innerAudioContext

    setTimeout(function () {
	    $this.setData({
		    maskShow: false
	    })
    },2000)

    wx.createSelectorQuery().select('.basket').fields({ size: true,rect: true }, function (res) {
        lanH = res.height
        lanW = res.width
        lanT = res.top
    }).exec()
  },
  startTap(e) {
      switch (e.currentTarget.id) {
          case '0':
	          this.setData({
                  'heart[0].trunkShow': false,
		          'animationData.basket': 'scaleBig'
	          })
              break;
	      case '1':
		      this.setData({
			      'heart[1].trunkShow': false,
			      'animationData.basket': 'scaleBig'
		      })
		      break;
	      case '2':
		      this.setData({
			      'heart[2].trunkShow': false,
			      'animationData.basket': 'scaleBig'
		      })
		      break;
	      case '3':
		      this.setData({
			      'heart[3].trunkShow': false,
			      'animationData.basket': 'scaleBig'
		      })
		      break;
	      case '4':
		      this.setData({
			      'heart[4].trunkShow': false,
			      'animationData.basket': 'scaleBig'
		      })
		      break;
          default:
	          console.log("error");
      }
  },
  moveTap(e) {
      curX = e.detail.x
      curY = e.detail.y
  },
  endTap(e) {
	  if (curX > (app.screenWidth / 2 - 1.2 * lanW / 2) && curX < (app.screenWidth / 2 + 1.2 * lanW / 2)
          && curY > lanT - lanH * 0.1 && curY < lanT + lanH * 1.1) {
          let id = 0
          this.data.url.forEach((item,index)=>{
              if(index == e.currentTarget.id) {
                  id = item.id
              }
          })
          wx.navigateTo({
              url: `../mindContent/mindContent?id=${id}`
          })
      }else {
          this.setData({
	          'animationData.basket': 'scaleSmall',
              heart: this.data.heart,
              'heart[0].trunkShow': true,
              'heart[1].trunkShow': true,
              'heart[2].trunkShow': true,
              'heart[3].trunkShow': true,
              'heart[4].trunkShow': true
          })
      }
  },
	musicPause() {
  	    if (!this.data.animationData.music) {
	        this.audio.pause()
	        this.setData({
		        'animationData.music': 'stop'
	        })
	        console.log("暂停");
        } else {
	        this.audio.play()
	        console.log("继续");
        }

	},
	onPullDownRefresh() {
		let $this = this
	    setTimeout(function () {
		    $this.setData({
			    'animationData.basket': 'scaleSmall',
			    heart: $this.data.heart,
			    'heart[0].trunkShow': true,
			    'heart[1].trunkShow': true,
			    'heart[2].trunkShow': true,
			    'heart[3].trunkShow': true,
			    'heart[4].trunkShow': true
		    })
		    wx.stopPullDownRefresh()
	    },1000)
	},
	toSend() {
		wx.navigateTo({
			url: `../mindSend/mindSend`
		})
	}
})
