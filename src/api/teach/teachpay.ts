import service from '@/utils/request'

export const useTeachPayApi = (id: Number) => {
	return service.get('/teaching/teachpay/' + id)
}

export const useTeachPaySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/teachpay', dataForm)
	} else {
		return service.post('/teaching/teachpay', dataForm)
	}
}

export const dataListUrl = '/teaching/teachpay/page' 
export const deleteUrl = '/teaching/teachpay' 