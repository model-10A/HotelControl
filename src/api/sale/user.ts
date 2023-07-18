import service from '@/utils/request'
import { id } from 'element-plus/es/locale'

export const useUserApi = (id: Number) => {
	return service.get('/sale/user/' + id)
}

export const useUserPayApi = (id: Number) => {
	return service.get('/sale/user/pay/' + id)
}

export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sale/user/', dataForm)
	} else {
		return service.post('/sale/user/', dataForm)
	}
}

export const useUserConfirmApi = (id: Number) => {
	return service.get('/sale/user/confirm?id=' + id)
}

export const useUserFunnelApi = (id: Number) => {
	return service.get('/sale/user/status/' + id)
}

export const useUserStatusPayApi = (id: Number) => {
	return service.put('/sale/user/pay/' + id)
}

export const useInsertCadetsUserApi = (dataForm: any) => {
	return service.post('/sale/user/cadets/', dataForm)
}

export const useSaleNameApi = () => {
	return service.get('/sale/user/sale')
}



export const dataListUrl = '/sale/user/page'

export const deleteUrl = '/sale/user/'
