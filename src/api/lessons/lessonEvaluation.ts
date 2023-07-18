import service from '@/utils/request'

export const insertEvaluationListApi = (query: any ) => {
	return service.post('/lessons/evaluate' , query)
}

export const updateEvaluationApi = (dataFrom: any) => {
	return service.post('/lessons/evaluate/updateEvaluation', dataFrom)
}

export const getLessonEvaluationApi = (lessonId: number) => {
	return service.get('/lessons/evaluate/list/' + lessonId)
}

export const sendEvaluateApi = (lessonId: number) => {
	return service.get('/lessons/evaluate/send/' + lessonId)
}
