import service from '@/utils/request'

export const useUserInfoApi = () => {
	return service.get('/sys/user/student/info')
}

export const renewAmountSubmitApi = (data: any) => {
	return service.get('/teaching/student/renewAmountSubmit', {
		params: {
			userId: data.userId,
			num: data.num,
			remarks: data.remarks
		}
	})
}

export const outClassAddClassHoursSubmitApi = (data: any) => {
	return service.get('/teaching/student/outClassSubmit', {
		params: {
			userId: data.userId,
			classId: data.classId,
			num: data.num,
			remarks: data.remarks
		}
	})
}

export const joinClassAddClassHoursSubmitApi = (data: any) => {
	return service.get('/teaching/student/joinClassSubmit', {
		params: {
			userId: data.userId,
			classId: data.classId,
			num: data.num,
			remarks: data.remarks
		}
	})
}

export const updatePasswordApi = (data: any) => {
	return service.put('/teaching/student/password', data)
}

export const useUserApi = (id: number) => {
	return service.get('/teaching/student/' + id)
}
export const useOrgApi = () => {
	return service.get('/teaching/studentEx/orgList')
}
export const useUserSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/student', dataForm)
	} else {
		return service.post('/teaching/student', dataForm)
	}
}

export const useStudentsApi = (dataForm: any) => {
	return service.post('/teaching/student/getStudents', dataForm)
}

export const useStudentImportApi = (file: any) => {
	return service.post('/teaching/student/import', file)
}

export const useGetStudentByLessonApi = (id:Number) =>{
	return service.get('/teaching/student/stuList/'+id)
}

export const dataListUrl = '/teaching/student/page'
export const deleteUrl = '/teaching/student'
//插班、换班时获取所有班级
export const inClassDateListUrl = '/teaching/class/page'
