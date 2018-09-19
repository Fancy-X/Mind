//index.js
//获取应用实例
const app = getApp()
const getTime = require('../../utils/util')
const api = require('../../utils/api')

Page({
	data: {
		content: '',
		username: '',
		nowTime: '获取时间失败',
		location: '未获取定位',
		locationIcon: false
	},
	onLoad() {
		let time = getTime.formatTime(new Date())
		this.setData({
			nowTime: time
		})
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
		let $this = this
		let time = this.data.nowTime
		let username = this.data.username
		let content = this.data.content
		let location = this.data.location
		wx.showLoading({
			title: '正在提交'
		})
		api.send(time, username, content, location).then(res => {
			if (!res.status) {
				wx.hideLoading()
				wx.showModal({
					title: '提交成功',
					content: '',
					showCancel: false,
					success: function (res) {
						if (res.confirm) {
							wx.navigateTo({
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
