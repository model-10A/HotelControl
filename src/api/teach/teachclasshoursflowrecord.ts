import service from '@/utils/request'

export const useTeachClassHoursFlowRecordApi = (lessonId: Number,stuId:Number) => {
	return service.get('/teaching/class/hours/flow/record',{
		params:{
			lessonId:lessonId,
			stuId:stuId,
		}
	})
}

export const useTeachClassHoursFlowRecordSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/class/hours/flow/record', dataForm)
	} else {
		return service.post('/teaching/class/hours/flow/record', dataForm)
	}
}

export const dataListUrl = '/teaching/class/hours/flow/record/page'

export const deleteUrl = '/teaching/class/hours/flow/record'