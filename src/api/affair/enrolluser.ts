import service from '@/utils/request'

export const useEnrollUserApi = (id: Number) => {
	return service.get('/teaching/enrollUser/' + id)
}

export const useEnrollUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/enrollUser', dataForm)
	} else {
		return service.post('/teaching/enrollUser', dataForm)
	}
}

export const useEnrollUserConfirmApi = (id: Number) => {
	return service.get('/teaching/enrollUser/confirm?id=' + id)
}

export const insertSysUser = (id: Number) => {
	return service.get('/teaching/enrollUser/insertSysUser?id=' + id)
}

export const dataListUrl = '/teaching/enrollUser/page'

export const deleteUrl = '/teaching/enrollUser'
