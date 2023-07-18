import service from '@/utils/request'

export const useChoiceProblemApi = (id: Number) => {
	return service.get('/problem/choice/' + id)
}

export const useChoiceProblemUpdateStatusApi = (id: Number) => {
	return service.get('/problem/choice/updateStatus/' + id)
}

export const useChoiceProblemSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/problem/choice', dataForm)
	} else {
		return service.post('/problem/choice', dataForm)
	}
}

export const useChoiceProblemInfoApi = (id: any) => {
	return service.get('/problem/choice/problemInfo/' + id)
}

export const useOptionsFromJudgeApi = (problemId: any) => {
	return service.get('/problem/choice/options/' + problemId)
}

export const useImportExcelApi = (file: any) => {
	return service.post('/problem/choice/import', file)
}

export const dataListUrl = '/problem/choice/page'

export const deleteUrl = '/problem/choice'
