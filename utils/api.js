function fetch(url, data, method) {
	return new Promise((res,rej) => {
		wx.request({
			url,
			data,
			method,
			success: res,
			fail: rej
		})
	})
}


function getMsg(page = 1) {
	let url = 'http://2z0290a686.imwork.net:8081/getmsg'
	let data = {page}
	return fetch(url, data).then(res => {
		console.log(res.data);
	})
}

function getOne(id) {
	let url = 'http://2z0290a686.imwork.net:8081/getone'
	let data = {id}
	return fetch(url,data).then(res => {
		console.log(res.data);
	})
}

module.exports = {
	getMsg,
	getOne
}