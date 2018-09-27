//index.js
//获取应用实例
const app = getApp()
const getTime = require('../../utils/util')
const api = require('../../utils/api')

Page({
	data: {
		content: '看见这条内容且时间正确说明你已经发布成功',
		username: '都是咸鱼',
		nowTime: '获取时间失败',
		location: '未获取定位',
		locationIcon: false,
		playStatus: ''
	},
	onLoad(query) {
		let time = getTime.formatTime(new Date())
		this.setData({
			playStatus: query.playstatus,
			nowTime: time
		})
	},
	onShow() {
		if (!app.audio.paused && this.data.playStatus) {  //监听后台切换事件
			app.audio.play()
		}
	},
	setMsg(e) {
		this.setData({
			content: e.detail.value
		})
	},
	setUsername(e) {
		this.setData({
			username: e.detail.value
		})
	},
	getLocation() {
		var $this = this
		if (!this.data.locationIcon) {
			wx.showLoading({
				title: '正在定位'
			})
			new Promise((res1, rej1) => {
				wx.getLocation({success: res1, fail: rej1})
			}).then(res1 => {
				return new Promise((res2, rej2) => {
					const params = {
						location: `${res1.latitude},${res1.longitude}`,
						output: 'json',
						ak: 'B61195334f65b9e4d02ae75d24fa2c53'
					}
					wx.request({
						url: 'https://api.map.baidu.com/geocoder/v2/',
						data: Object.assign({}, params),
						header: {'Content-Type': 'json'},
						success: res2,
						fail: rej2
					})
				})
			}).then(res2 => {
				var location = res2.data.result.addressComponent
				wx.hideLoading()
				console.log(`${location.city}${location.district}`)
				$this.setData({
					location: `${location.city}${location.district}`,
					locationIcon: true
				})
			}).catch(err => {
				console.log(err);
				wx.hideLoading()
				wx.showToast({
					title: '定位失败',
					icon: 'none'
				})
			})
		} else {
			$this.setData({
				location: '未获取定位',
				locationIcon: false
			})
		}

	},
	send() {
		let time = this.data.nowTime
		let username = this.data.username
		let content = this.data.content
		let location = this.data.location
		wx.showLoading({
			title: '正在提交'
		})
		api.send(time, username, content, location).then(res => {
			if (!res.status) {
				app.globalData.refreshStatus = true
				app.globalData.refreshPage = Math.ceil(res.count / 5)

				wx.hideLoading()
				wx.showModal({
					title: '提交成功，请返回查看。',
					content: '',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateBack({
								url: '../mindTree/mindTree'
							})
						}
					}
				})
			} else {
				wx.hideLoading()
				wx.showToast({
					title: '提交失败',
					icon: 'none'
				})
			}
		})
	}
})
