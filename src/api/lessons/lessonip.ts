import service from '@/utils/request'

export const useLessonIpApi = (id: Number) => {
	return service.get('/lessons/ip/' + id)
}

export const useLessonIpSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put(deleteUrl, dataForm)
	} else {
		return service.post(deleteUrl, dataForm)
	}
}

export const dataListUrl = '/lessons/ip/list'
export const deleteUrl = '/lessons/ip'