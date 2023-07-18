import service from '@/utils/request'

export const useFillProblemApi = (id: Number) => {
	return service.get('/problem/fill/' + id)
}

export const useFillProblemUpdateStatusApi = (id: Number) => {
	return service.get('/problem/fill/updateStatus/' + id)
}

export const useFillProblemSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/problem/fill', dataForm)
	} else {
		return service.post('/problem/fill', dataForm)
	}
}

export const useFillProblemInfoApi = (id: Number) => {
	return service.get('/problem/fill/problemInfo/' + id)
}

export const useFillAnswerApi = (problemId: any) => {
	return service.get('/problem/fill/getFillAnswer/' + problemId)
}

export const useImportExcelApi = (file: any) => {
	return service.post('/problem/fill/import', file)
}
export const dataListUrl = '/problem/fill/page'

export const deleteUrl = '/problem/fill'
