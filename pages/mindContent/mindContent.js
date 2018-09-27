//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/api')

Page({
	data: {
		msg: {},
		comeOnIcon: false,
		playStatus: ''
	},
	onLoad(query) {
		let $this = this
		this.setData({
			playStatus: query.playstatus
		})
		api.getOne(query.id).then(res => {
			$this.setData({
				msg: res.data
			})
		})

		wx.getStorage({
			key: 'come_on',
			complete: function (res) {
				$this.storage = res.data
				if ($this.storage) {
					if (query.id in $this.storage) {
						$this.setData({
							comeOnIcon: $this.storage[query.id]
						})
					} else {
						$this.storage[query.id] = false
						wx.setStorage({key: 'come_on', data: $this.storage})
					}
				} else {
					$this.storage = {}
					$this.storage[query.id] = false
					wx.setStorage({key: 'come_on', data: $this.storage})
				}
			}
		})
	},
	onShow() {
		if (!app.audio.paused && this.data.playStatus) {  //监听后台切换事件
			app.audio.play()
		}
	},
	comeOn() {
		let id = this.data.msg._id
		let count = this.data.msg.comeOn

		if (this.data.comeOnIcon) {
			api.comeOn(id, count-1).then(res => {
				if (!res.status) {
					this.storage[id] = false
					wx.setStorage({key: 'come_on', data: this.storage})

					this.setData({
						comeOnIcon: false,
						'msg.comeOn': count - 1
					})
				}else{
					wx.showToast({
						title: '取消加油失败了',
						icon: 'none'
					})
				}
			})
		} else {
			api.comeOn(id, count+1).then(res => {
				if (!res.status) {
					this.storage[id] = true
					wx.setStorage({key: 'come_on', data: this.storage})

					this.setData({
						comeOnIcon: true,
						'msg.comeOn': count + 1
					})
				}else{
					wx.showToast({
						title: '加油失败了',
						icon: 'none'
					})
				}

			})
		}
	}
})
