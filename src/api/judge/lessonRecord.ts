import service from '@/utils/request'

export const getLessonProblemRank = (lessonId: number, type: number) => {
	return service.get('/judge/lesson/record/getLessonProblemRank?lessonId=' + lessonId + '&type=' + type)
}

export const getUserLessonRecord = (dataForm: any) => {
	return service.post('/judge/lesson/record/getUserLessonRecord', dataForm)
}
export const useLessonProblemRecordApi = (data: any) => {
	return service.get('/judge/lesson/record/getLessonProblemRecord', {
		params: {
			...data
		}
	})
}

export const useProblemFinishApi = (data: any) => {
	return service.get('/judge/lesson/record/getProblemFinish', {
		params: {
			...data
		}
	})
}
