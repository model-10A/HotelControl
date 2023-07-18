import service from '@/utils/request'

export const useTeachAuditionRecordApi = (id: Number) => {
	return service.get('/teaching/audition/record/' + id)
}

export const useTeachAuditionRecordDatailApi = (id: Number) => {
	return service.get('/teaching/audition/record/detail/' + id)
}

export const useTeachAuditionRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/audition/record', dataForm)
	} else {
		return service.post('/teaching/audition/record', dataForm)
	}
}
export const useSaleAuditionRecordSubmitApi = (dataForm: any) => {
	return service.post('/teaching/audition/record/sale', dataForm)
}
export const userJoinAuditionLessonApi = (data: any) => {
	return service.post('/teaching/audition/record/joinAudition', data)
}

export const dataNewStudentUrl = 'teaching/audition/record/page/newStudent'
export const dataListUrl = 'teaching/audition/record/page'
export const deleteUrl = 'teaching/audition/record'
