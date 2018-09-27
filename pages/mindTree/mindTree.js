//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api')
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
		msg: [],
		page: 1,
		animationData: {
			basket: '',
			musicRotate: '',
			musicStop: '',
			musicBg: 'stop'
		},
		maskShow: true,
	},
	onLoad() {
		let $this = this
		wx.showLoading({
			title: '正在加载'
		})
		const innerAudioContext = wx.createInnerAudioContext()
		innerAudioContext.loop = true
		innerAudioContext.autoplay = true
		innerAudioContext.src = `${api.url}/audio/mind.mp3`
		innerAudioContext.onPlay(() => {
			console.log('开始播放')
			this.setData({
				'animationData.musicRotate': 'rotate',
				'animationData.musicBg': ''
			})
		})
		app.audio = innerAudioContext

		api.getMsg().then(res => {
			if (!res.status) {
				wx.hideLoading()
				$this.setData({
					msg: res.data,
					page: res.page
				})
			} else {
				console.log(res.data + res.msg);
			}
		})

		setTimeout(function () {
			$this.setData({
				maskShow: false
			})
		}, 1500)

		wx.createSelectorQuery().select('.basket').fields({size: true, rect: true}, function (res) {
			lanH = res.height
			lanW = res.width
			lanT = res.top
		}).exec()
	},
	onShow() {
		if (app.globalData.refreshStatus) {
			this.setData({
				page: app.globalData.refreshPage
			}, function () {
				wx.startPullDownRefresh({
					complete: function () {
						app.globalData.refreshStatus = false
					}
				})
			})
		}
		if (!app.audio.paused && this.data.animationData.musicRotate) {  //监听后台切换事件
			app.audio.play()
		}
	},
	startTap(e) {
		var o = {'animationData.basket': 'scaleBig'}
		o[`heart[${e.currentTarget.id}].trunkShow`] = false
		this.setData(o)
	},
	moveTap(e) {
		curX = e.detail.x
		curY = e.detail.y
	},
	endTap(e) {
		let screenWidth = app.globalData.screenWidth
		if (curX > (screenWidth / 2 - 1.2 * lanW / 2) && curX < (screenWidth / 2 + 0.1 * lanW)
			&& curY > lanT - lanH * 0.1 && curY < lanT + lanH * 0.6) {
			let id
			this.data.msg.forEach((item, index) => {
				if (index == e.currentTarget.id) {
					id = item._id
				}
			})
			if (id) {
				wx.navigateTo({
					url: `../mindContent/mindContent?id=${id}&playstatus=${this.data.animationData.musicRotate}`
				})
			} else {
				wx.showToast({
					title: '此心仍待有缘人！',
					icon: 'none'
				})
			}

		} else {
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
	prev() {
		let $this = this
		let page = this.data.page - 1

		if (page == 0) {
			wx.showToast({
				title: '已是第一页',
				icon: 'none'
			})
		} else {
			wx.showLoading({
				title: '正在加载'
			})
			api.getMsg(page).then(res => {
				if (!res.status) {
					wx.hideLoading()
					$this.setData({
						msg: res.data,
						page: res.page,
						'animationData.basket': 'scaleSmall',
						heart: $this.data.heart,
						'heart[0].trunkShow': true,
						'heart[1].trunkShow': true,
						'heart[2].trunkShow': true,
						'heart[3].trunkShow': true,
						'heart[4].trunkShow': true
					})
				} else {
					console.log(res.data + res.msg);
					wx.hideLoading();
					wx.showToast({
						title: '加载失败',
						icon: 'none'
					})
				}
			})
		}
	},
	next() {
		let $this = this
		let page = this.data.page + 1
		wx.showLoading({
			title: '正在加载'
		})
		api.getMsg(page).then(res => {
			if (!res.status) {
				wx.hideLoading()
				if (res.data.length) {
					$this.setData({
						msg: res.data,
						page: res.page,
						'animationData.basket': 'scaleSmall',
						heart: $this.data.heart,
						'heart[0].trunkShow': true,
						'heart[1].trunkShow': true,
						'heart[2].trunkShow': true,
						'heart[3].trunkShow': true,
						'heart[4].trunkShow': true
					})
				} else {
					wx.showToast({
						title: '已是最后一页',
						icon: 'none'
					})
				}
			} else {
				console.log(res.data + res.msg);
				wx.hideLoading();
				wx.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		})
	},
	musicPause() {
		let $this = this
		if (this.data.animationData.musicRotate) {
			wx.createSelectorQuery().select('.music').fields({computedStyle: ['transform']}, function (res) {
				wx.createSelectorQuery().select('.imgRotate').fields({computedStyle: ['transform']}, function (res1) {
					var musicRotate = res.transform == 'none' ? '' : res.transform
					$this.setData({
						'animationData.musicRotate': '',
						'animationData.musicStop': `${musicRotate} ${res1.transform}`,
						'animationData.musicBg': 'stop'
					})
				}).exec()
			}).exec()
			app.audio.pause()
			console.log("暂停");
		} else {
			$this.setData({
				'animationData.musicRotate': 'rotate',
				'animationData.musicBg': ''
			})
			app.audio.play()
			console.log("继续");
		}

	},
	onPullDownRefresh() {
		let $this = this
		wx.showLoading({
			title: '正在加载'
		})
		api.getMsg(this.data.page).then(res => {
			if (!res.status) {
				wx.hideLoading()
				setTimeout(function () {
					if (res.data.length) {
						$this.setData({
							msg: res.data,
							'animationData.basket': 'scaleSmall',
							heart: $this.data.heart,
							'heart[0].trunkShow': true,
							'heart[1].trunkShow': true,
							'heart[2].trunkShow': true,
							'heart[3].trunkShow': true,
							'heart[4].trunkShow': true
						})
					} else {
						$this.setData({
							'animationData.basket': 'scaleSmall',
							heart: $this.data.heart,
							'heart[0].trunkShow': true,
							'heart[1].trunkShow': true,
							'heart[2].trunkShow': true,
							'heart[3].trunkShow': true,
							'heart[4].trunkShow': true
						})
						wx.showToast({
							title: '已是最后一页',
							icon: 'none'
						})
					}
					wx.stopPullDownRefresh()
				}, 500)
			} else {
				console.log(res.data + res.msg);
				$this.setData({
					'animationData.basket': 'scaleSmall',
					heart: $this.data.heart,
					'heart[0].trunkShow': true,
					'heart[1].trunkShow': true,
					'heart[2].trunkShow': true,
					'heart[3].trunkShow': true,
					'heart[4].trunkShow': true
				})
				wx.hideLoading();
				wx.showToast({
					title: '加载失败',
					icon: 'none'
				})
				wx.stopPullDownRefresh()
			}
		})

	},
	toSend() {
		wx.navigateTo({
			url: `../mindSend/mindSend?playstatus=${this.data.animationData.musicRotate}`
		})
	}
})
