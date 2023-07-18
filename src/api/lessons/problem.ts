import service from '@/utils/request'

export const useLessonHomeworkApi = (id: number) => {
	return service.get('/lessons/problem/list', {
		params: {
			lessonId: id,
			type: 2
		}
	})
}
export const useLessonProblemApi = (dataForm: any) => {
	if (dataForm.id) {
	} else {
		return service.post('/lessons/problem', dataForm)
	}
}

export const useUpdateLessonProblemApi = (lessonProblemList: any) => {
	return service.post('/lessons/problem/update', lessonProblemList)
}

export const useBatchInsertLessonProblem = (submitObj: any) => {
	return service.post('/lessons/problem/batchInsertLessonProblem', submitObj)
}

export const dataListUrl = '/lessons/problem/list'
export const deleteUrl = '/lessons/problem'
export const unfinishedProblemUrl = '/lessons/problem/unfinished/page'

export const unfinishedProblemForIdUrl = '/lessons/problem/studentsForId/page'
