import service from '@/utils/request'

export const updateStudentsApi = (dataForm: any) => {
	return service.put('/lessons/attend/students/update', dataForm)
}

export const useLessonStudentApi = (dataForm: any) => {
	return service.post('/lessons/attend/lesson', dataForm)
}

export const useDeleteLessonStudentApi = (dataForm: any) => {
	return service.delete('/lessons/attend/lesson', { data: dataForm })
}

export const getStudentsStatisticsInfo = () => {
	return service.get('/lessons/statistics/students')
}

export const getTeacherStatisticsInfo = () => {
	return service.get('/lessons/statistics/teacher')
}

export const useGiveOrResetLikesApi = (lessonId: any, stuId: any, type: any) => {
	return service.get('/lessons/attend/giveLike', {
		params: {
			lessonId: lessonId,
			stuId: stuId,
			type: type
		}
	})
}

export const dataStudentsListUrl = '/lessons/attend/students/list'
