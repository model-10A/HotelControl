import service from '@/utils/request'

export const useTeachClassRecordApi = (id: Number) => {
	return service.get('/teaching/class/record/' + id)
}

export const useTeachClassRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/class/record', dataForm)
	} else {
		return service.post('/teaching/class/record', dataForm)
	}
}

export const dataListUrl = '/teaching/class/record/page'

export const deleteUrl = '/teaching/class/record'