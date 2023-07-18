import service from '@/utils/request'
import { downloadFileApi } from '@/api/file/file'

export const useLessonApi = (id: any) => {
	return service.get('/lessons/lesson/' + id)
}

export const useLessonSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/lessons/lesson', dataForm)
	} else {
		return service.post('/lessons/lesson', dataForm)
	}
}

export const createLessonsApi = (dataForm: any) => {
	return service.post('lessons/lesson/create', dataForm)
}
export const attendLessonApi = (lessonId: any) => {
	return service.get('lessons/stu/' + lessonId)
}

export const getMyLessonApi = () => {
	return service.get(dataPageUrl, {
		params: {
			page: 1,
			limit: 5
		}
	})
}

export const getMyHomeworkApi = () => {
	return service.get(dataHomeworkPageUrl, {
		params: {
			page: 1,
			limit: 1
		}
	})
}

export const updateLessonHomework = (dataForm: any) => {
	return service.put('/lessons/lesson/homework', dataForm)
}

export const useLessonByIdApi = (classId: any) => {
	return service.get('/lessons/lesson/list', {
		params: {
			classId: classId,
			page: 1,
			limit: 999
		}
	})
}
export const useClassDoneLessonApi =(id:number)=>{
	return service.get('lessons/lesson/list/getClassDoneLesson/'+id)
}

export const createAuditionLessonApi = (data: any) => {
	return service.post('lessons/lesson/create/audition', data)
}

export const updateList = (dataList: any) => {
	return service.post('/lessons/lesson/updateList', dataList)
}

export const useLessonExcelApi = (lessonId: any) => {
	return service
		.get('/lessons/lesson/exportLesson', {
			responseType: 'blob',
			params: {
				lessonId: lessonId
			}
		})
		.then(res => {
			downloadFileApi(res)
		})
}

export const useGetLessonHourApi = (id:Number) => {
	return service.get("/lessons/lesson/getLessonHour/" + id)
}


export const dataListUrl = '/lessons/lesson/list'
export const dataListPageUrl = 'lessons/lesson/page/info'
export const dataHomeworkPageUrl = '/lessons/lesson/homework/page'
export const dataHistoryHomeworkPageUrl = 'lessons/lesson/historyHomework/page'
export const dataPageUrl = '/lessons/lesson/page'
export const dataAllLessonPageUrl = '/lessons/lesson/page/allLesson'
export const deleteUrl = '/lessons/lesson'
export const afootLessonPageUrl = '/lessons/lesson/page/afootLesson'
//学生课堂信息获取
export const dataStudentLessonInfoUrl = '/lessons/lesson/homeworkForStudentId/page'
