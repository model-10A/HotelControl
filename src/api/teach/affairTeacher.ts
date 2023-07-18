import service from '@/utils/request'
export const dataListUrl = '/teaching/affairTeacher/affairTeacherPage'

export const deleteUrl = '/teaching/affairTeacher'

export const resetPassword = (data: any) => {
	return service.put('/teaching/affairTeacher/ResetPassword', data)
}

export const useUserApi = (id: number) => {
	return service.get('/teaching/affairTeacher/affairTeacher/' + id)
}

export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/affairTeacher', dataForm)
	} else {
		return service.post('/teaching/affairTeacher', dataForm)
	}
}
