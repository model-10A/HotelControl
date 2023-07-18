import service from '@/utils/request'

export const useTeachDestroyedLessonRecordApi = (id: Number) => {
	return service.get('/teaching/destroyed/lesson/record' + id)
}

export const saveTeachDestroyedLessonApi = (dataForm: any) => {
	return service.put('/teaching/destroyed/lesson/record', dataForm)
}
export const saveTeachDestroyedLessonStuListApi = (vo:any) => {
	return service.post('/teaching/destroyed/lesson/record/list',vo)
}

export const useTeachDestroyedLessonRecordList = (vo: any) => {
	return service.post('/teaching/destroyed/lesson/record', vo)
}


export const dataListUrl = '/teaching/destroyed/lesson/record/page'

export const deleteUrl = '/teaching/destroyed/lesson/record'
