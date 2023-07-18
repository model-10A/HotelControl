import service from '@/utils/request'

export const useEnrollClassApi = (id: Number) => {
	return service.get('teaching/enrollClass/' + id)
}

export const useEnrollClassSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('teaching/enrollClass', dataForm)
	} else {
		return service.post('teaching/enrollClass', dataForm)
	}
}

export const useEnrollClassDeleteApi = (id: Number) => {
	return service.put('teaching/enrollClass/' + id)
}

export const useEnrollClassStatusApi = (id: Number) =>{
	return service.put('teaching/enrollClass/status/'+id)
}

export const useEnrollClassListApi = () =>{
	return service.get('teaching/enrollClass/publish')
}

export const dataListUrl =  '/teaching/enrollClass/page'
export const deleteUrl =  '/teaching/enrollClass'
