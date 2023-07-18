import service from '@/utils/request'

export const useUserInfoApi = () => {
	return service.get('/teaching/user/info')
}

export const updatePasswordApi = (data: any) => {
	return service.put('/teaching/user/password', data)
}

export const useUserApi = (id: number) => {
	return service.get('/teaching/user/teacher/' + id)
}

export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/user', dataForm)
	} else {
		return service.post('/teaching/user', dataForm)
	}
}
export const useSelectTeacherApi = () => {
	return service.get('/teaching/user/GetTeacher')
}
export const useInsertTeacherApi = () => {
	return service.get('/teaching/user/insert/teacher')
}
export const resetPassword = (data: any) => {
	return service.put('/teaching/user/ResetPassword', data)
}
export const useInsertTeacherRole = (data: any) => {
	return service.put('/teaching/user/insert/teacher', data)
}

export const dataListUrl = '/teaching/user/teacherPage'

export const deleteUrl = '/teaching/user'
