import service from '@/utils/request'

export const useKpListApi = () => {
	return service.get('/problem/kp/list')
}

export const useKpApi = (id: Number) => {
	return service.get('/problem/kp/' + id)
}

export const useKpSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/problem/kp', dataForm)
	} else {
		return service.post('/problem/kp', dataForm)
	}
}

export const getKpName = (id: Number) => {
	let name: any
	service.get('/problem/kp/name/' + id).then(res => {
		name = res.data
	})
	return name
}

export const dataListUrl = '/problem/kp/list'

export const deleteUrl = '/problem/kp'

export const getKpProblemUrl = '/problem/kp/getKpProblem'
