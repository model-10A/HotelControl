import service from '@/utils/request'

export const useEnrollLessonSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/enrollLesson', dataForm)
	} else {
		return service.post('/teaching/enrollLesson', dataForm)
	}
}
export const useEnrollLessonApi = (id: Number) => {
	return service.get('/teaching/enrollLesson/' + id)
}

export const useEnrollLessonSelectApi = () => {
	return service.get('/teaching/enrollLesson/SelectOne')
}
export const useEnrollupdateOpinionApi = (dataForm: any) => {
	return service.post('/teaching/enrollLesson/teacherOpinion', dataForm)
}

export const useEnrollJoinLessonApi = (data: any) => {
	return service.post('/teaching/enrollLesson/joinLesson', data)
}

export const dataListUrl = '/teaching/enrollLesson/page'
export const deleteUrl = '/teaching/enrollLesson'
