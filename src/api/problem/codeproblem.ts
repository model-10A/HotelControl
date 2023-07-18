import service from '@/utils/request'

export const useCodeProblemApi = (id: Number) => {
	return service.get('/problem/code/' + id)
}

export const useCodeProblemUpdateStatusApi = (id: Number) => {
	return service.get('/problem/code/updateStatus/' + id)
}

export const useCodeProblemSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/problem/code', dataForm)
	} else {
		return service.post('/problem/code', dataForm)
	}
}

export const useCodeProblemInfoApi = (id: Number) => {
	return service.get('/problem/code/problemInfo/' + id)
}

export const useCodeAnswerApi = (problemId: any) => {
	return service.get('/problem/code/getCodeAnswer/' + problemId)
}

export const useImportExcelApi = (file: any) => {
	return service.post('/problem/code/import', file)
}

export const dataListUrl = '/problem/code/page'

export const deleteUrl = '/problem/code'
