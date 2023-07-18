import service from '@/utils/request'

export const useTeachPlanItemApi = (id: Number) => {
	return service.get('/teaching/planItem/' + id)
}

export const getItemResourceApi = (id: number) => {
	return service.get('/teaching/planItem/resource/' + id)
}

export const getTeachPlanItemApi = (id: number) => {
	return service.get('/teaching/planItem/' + id)
}

export const getItemPaperApi = (id: number) => {
	return service.get('/teaching/planItem/paper/' + id)
}

export const submitItemPaperApi = (dataForm: any) => {
	return service.post('/teaching/planItem/paper/', dataForm)
}

export const uploadItemResourceApi = (dataForm: any) => {
	return service.post('/teaching/planItem/resource', dataForm)
}

export const deleteItemResourceApi = (id: any) => {
	return service.delete('/teaching/planItem/resource/' + id)
}

export const useTeachPlanItemSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put(deleteUrl, dataForm)
	} else {
		return service.post(deleteUrl, dataForm)
	}
}

export const dataListUrl = '/teaching/planItem/list/'

export const deleteUrl = '/teaching/planItem'

export const resourceDataListUrl = '/teaching/planItem/resource/list'

export const resourceDeleteUrl = '/teaching/planItem/resource/'
