import store from '@/store'
import { ElMessage } from 'element-plus'
import cache from '@/utils/cache'
const token = store.userStore.token // 获取验证信息，后台配置
interface socket {
	websocket: any
	connectURL: string
	socket_open: boolean
	hearbeat_timer: any
	hearbeat_interval: number
	is_reonnect: boolean
	reconnect_count: number
	reconnect_current: number
	ronnect_number: number
	reconnect_timer: any
	reconnect_interval: number
	init: (receiveMessage: Function | null) => any
	receive: (message: any) => void
	heartbeat: () => void
	send: (data: any, callback?: any) => void
	close: () => void
	reconnect: () => void
}

const socket: socket = {
	websocket: null,
	// connectURL: `${import.meta.env.VITE_SOCKET_API_URL as any}/ws/${user_id}?access_token=${token}`,
	connectURL: import.meta.env.VITE_SOCKET_API_URL + '?token=' + cache.getToken(),
	// 开启标识
	socket_open: false,
	// 心跳timer
	hearbeat_timer: null,
	// 心跳发送频率
	hearbeat_interval: 45000,
	// 是否自动重连
	is_reonnect: true,
	// 重连次数
	reconnect_count: 3,
	// 已发起重连次数
	reconnect_current: 1,
	// 网络错误提示此时
	ronnect_number: 0,
	// 重连timer
	reconnect_timer: null,
	// 重连频率
	reconnect_interval: 5000,

	init: (receiveMessage: Function | null) => {
		console.log(2222)
		if (!('WebSocket' in window)) {
			ElMessage.warning('浏览器不支持WebSocket')
			return null
		}
		// 已经创建过连接不再重复创建
		if (socket.websocket) {
			return socket.websocket
		}
		socket.websocket = new WebSocket(socket.connectURL)
		socket.websocket.onmessage = (e: any) => {
			if (receiveMessage) {
				receiveMessage(e)
			} else {
				console.log('success:' + e)
				socket.receive(e)
			}
		}

		socket.websocket.onclose = (e: any) => {
			clearInterval(socket.hearbeat_interval)
			socket.socket_open = false
			console.log('error:' + e)

			// 需要重新连接
			if (socket.is_reonnect) {
				socket.reconnect_timer = setTimeout(() => {
					// 超过重连次数
					if (socket.reconnect_current > socket.reconnect_count) {
						clearTimeout(socket.reconnect_timer)
						socket.is_reonnect = false
						return
					}

					// 记录重连次数
					socket.reconnect_current++
					socket.reconnect()
				}, socket.reconnect_interval)
			}
		}

		// 连接成功
		socket.websocket.onopen = function () {
			socket.socket_open = true
			socket.is_reonnect = true
			// 开启心跳
			socket.heartbeat()
		}

		// 连接发生错误
		socket.websocket.onerror = function () {}
	},

	send: (data, callback = null) => {
		console.log(data)
		if (socket.websocket.readyState === socket.websocket.OPEN) {
			// 开启状态直接发送
			socket.websocket.send(JSON.stringify(data))
			if (callback) {
				callback()
			}
		} else if (socket.websocket.readyState === socket.websocket.CONNECTING) {
			console.log(socket.websocket.readyState)
			// 正在开启状态，则等待1s后重新调用
			setTimeout(() => {
				console.log('正在开启中。。1s后重试')
				socket.send(data, callback)
			}, 1000)
		} else {
			clearInterval(socket.hearbeat_timer)
			if (socket.ronnect_number < 1) {
				ElMessage.error('关闭')
			}
			socket.ronnect_number++
		}
	},

	receive: (message: any) => {
		return JSON.parse(message.data)
		// console.log(message)
		// return 'params'
	},

	heartbeat: () => {
		if (socket.hearbeat_timer) {
			clearInterval(socket.hearbeat_timer)
		}

		socket.hearbeat_timer = setInterval(() => {
			// let data = {
			// 	user_idId: store.state.users.user_id,
			// 	authToken: store.state.users.authorization,
			// 	content: 'ping'
			// }
			// var sendDara = {
			// 	encryption_type: 'base64',
			// 	data: Base64.encode(JSON.stringify(data))
			// }
			// socket.send(sendDara)
		}, socket.hearbeat_interval)
	},

	close: () => {
		clearInterval(socket.hearbeat_interval)
		socket.is_reonnect = false
		socket.websocket.close()
	},

	/**
	 * 重新连接
	 */
	reconnect: () => {
		if (socket.websocket && !socket.is_reonnect) {
			socket.close()
		}

		socket.init(null)
	}
}

export default socket
