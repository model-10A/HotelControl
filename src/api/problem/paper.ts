import service from '@/utils/request'

export const useProblemPaperApi = (id: Number) => {
	return service.get('/problem/paper/' + id)
}

export const useProblemPaperSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/problem/paper', dataForm)
	} else {
		return service.post('/problem/paper', dataForm)
	}
}

export const useProblemPaperStatusApi = (paperId: Number) => {
	return service.get('/problem/paper/updateStatus/' + paperId)
}

export const dataListUrl = '/problem/paper/page'

export const deleteUrl = '/problem/paper'
