import service from '@/utils/request'

export const useLessonResourceApi = (lessonId: any) => {
	return service.get('/lessons/resource/getLessonResource/' + lessonId)
}

export const useLessonResourceSubmitApi = (dataForm: any) => {
		return service.post('/lessons/resource', dataForm)
}

export const deleteLessonResourceApi = (id: number) => {
	return service.delete('/lessons/resource/'+ id)
}


