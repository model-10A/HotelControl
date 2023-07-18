import service from '@/utils/request'

export const useTeachPayApi = (id: Number) => {
	return service.get('/sale/pay/' + id)
}

export const useMonthPayApi = () => {
	return service.get('/sale/pay/month/amount')
}

export const useMonthPeopleApi = () => {
	return service.get('/sale/pay/month/people')
}

export const useTeachPaySubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/sale/pay', dataForm)
	} else {
		return service.post('/sale/pay', dataForm)
	}
}

export const useReturnBackSubmitApi = (dataForm: any) => {
	return service.put('/sale/pay/return', dataForm)
}

export const useStatisticsMonthApi = () => {
	return service.get(dataListUrlMonth)
}

export const useStatisticsTeacherApi = (id : Number,season : Number) =>{
	return service.get('sale/pay/statistics/people/teacher/'+ id +'/' + season)
}
export const useGetHandlerApi = () =>{
	return service.get('/sale/pay/getHandler')
}
export const dataListUrl = '/sale/pay/page'

export const dataListUrlMonth = '/sale/pay/statistics/people/month'

export const deleteUrl = '/sale/pay'
