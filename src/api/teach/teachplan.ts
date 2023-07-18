import service from '@/utils/request'

export const useTeachPlanApi = (id: Number) => {
	return service.get('/teaching/plan/' + id)
}

export const useTeachPlanUpdateStatusApi = (id: Number) => {
	return service.get('/teaching/plan/updateStatus/' + id)
}

export const useTeachPlanSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put(deleteUrl, dataForm)
	} else {
		return service.post(deleteUrl, dataForm)
	}
}

export const dataListUrl = '/teaching/plan/page'

export const deleteUrl = '/teaching/plan'

export const useTeachPlanAllApi = () => {
	return service.get('/teaching/plan/all/')
}
