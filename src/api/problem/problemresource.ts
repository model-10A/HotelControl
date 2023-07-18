import service from '@/utils/request'

export const getProblemResource = (id: number) => {
	return service.get('/problem/resource/' + id)
}

export const uploadProblemResourceApi = (dataForm: any) => {
	return service.post('/problem/resource', dataForm)
}

export const deleteProblemResourceApi = (id: any) => {
	return service.delete('/problem/resource/' + id)
}
