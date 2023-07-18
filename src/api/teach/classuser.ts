import service from '@/utils/request'

export const useTeachClassUserApi = (id: Number) => {
	return service.get('/teaching/classUser/' + id)
}
//新增
export const useTeachClassUserSubmitApi = (dataForm: any) => {
	return service.post('/teaching/classUser/insertClassUserOne', dataForm)
}
//退班
export const useTeachClassQuitApi = (dataForm: any) => {
	return service.put('/teaching/classUser/quit', dataForm)
}

//换班
export const useTeachClassChangeApi = (dataForm: any) => {
	return service.put('/teaching/classUser/changeClassUser', dataForm)
}
//保存记录
export const useTeachClassRecordApi = (dataForm: any) => {
	return service.post('/teaching/classUser/classRecord', dataForm)
}
export const useTeachStudentApi = (query: any) => {
	// @ts-ignore
	return service.get('/teaching/classUser/getStudent', query)
}
export const dataListUrl = '/teaching/classUser/getStudent'

export const dataPageUrl = '/teaching/classUser/page'
