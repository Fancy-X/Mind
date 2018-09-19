const api = 'http://2z0290a686.imwork.net:8081'

function fetch(url, data, method, header) {
	return new Promise((res, rej) => {
		wx.request({
			url,
			data,
			method,
			header,
			success: res,
			fail: rej
		})
	})
}


function getMsg(page = 1) {
	let url = `${api}/getmsg`
	let data = {page}
	return fetch(url, data).then(res => res.data)
}

function getOne(id) {
	let url = `${api}/getone`
	let data = {id}
	return fetch(url, data).then(res => res.data)
}

function comeOn(id, count) {
	let url = `${api}/comeon`
	let data = {id, count}
	return fetch(url, data).then(res => res.data)
}

function send(time, username, content ,location) {
	let url = `${api}/send`
	let data = {time, username, content ,location}
	return fetch(url, data, 'POST', {'content-type': 'application/x-www-form-urlencoded'}).then(res => res.data)
}

module.exports = {
	getMsg,
	getOne,
	comeOn,
	send
}