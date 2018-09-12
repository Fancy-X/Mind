const app = getApp()

Page({
	data: {
		textArr: [
			"累么？",
			"那就对了。",
			"舒服...",
			"是留给死人的。"
		]
	},
	enter() {
		wx.redirectTo({
			url: "/pages/mindTree/mindTree"
		})
	}
})