import store from '@/store'
import socket from '@/utils/socket'
const userId = store.userStore.user.id

export const sendLoginLesson = (lessonId: number, data: any | null) => {
	let rep = {
		lessonId: lessonId,
		userId: userId,
		...data,
		type: 1
	}
	socket.send(rep)
}

export const sendChatMsg = (lessonId: number, data: any | null) => {
	if (data != null) {
		socket.send({
			lessonId: lessonId,
			userId: userId,
			...data,
			type: 2
		})
	} else {
		socket.send({
			lessonId: lessonId,
			userId: userId,
			type: 2
		})
	}
}

export const getUserMsg = (lessonId: number) => {
	let rep = {
		lessonId: lessonId,
		userId: userId,
		type: 3
	}
	socket.send(rep)
}
