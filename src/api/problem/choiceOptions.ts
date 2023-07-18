import service from '@/utils/request'

export const getOptionApi = (id: Number) => {
	return service.get('/problem/choice/option/' + id)
}

export const submitOptionApi = (data: any) => {
	return service.post('/problem/choice/option', data)
}
