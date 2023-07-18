// 消息接收
export const receiveMessage = (message: any) => {
	let param = JSON.parse(message.data)
	// 处理 赋值问题
	console.log(param)
	if (param) {
		switch (param.message) {
			case 'scheduleListFeedBack':
				break
			case 'onMessage':
				// 地磁获取消息列表 正则替换给过来的编码

				break
		}
	}
}
