import service from '@/utils/request'

export const useTeachCommunicateRecordApi = (id: Number) => {
	return service.get('/teaching/communicate/' + id)
}

export const useTeachCommunicateRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/communicate', dataForm)
	} else {
		return service.post('/teaching/communicate', dataForm)
	}
}

export const dataListUrl = '/teaching/communicate/page'

export const deleteUrl = '/teaching/communicate'