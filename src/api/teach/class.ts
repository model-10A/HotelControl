import service from '@/utils/request'

export const useTeachClassApi = (id: Number) => {
	return service.get('/teaching/class/' + id)
}

export const useTeachClassSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/class', dataForm)
	} else {
		return service.post('/teaching/class', dataForm)
	}
}

export const useTeachClassOldByUserId = (id: Number) => {
	return service.get('/teaching/class/page/old/' + id)
}
export const useTeachClassNowAndEndByUserId = (id:number) =>{
	return service.get('teaching/class/page/NowAndEnd/'+ id )
}
export const useStudentClassListApi = (status: any) => {
	return service.get('/teaching/class/student/' + status)
}

export const useStudentClassListForIdApi = (id:any,status: any) => {
	return service.get('/teaching/class/studentClass' ,{
		params:{
			id:id,
			status:status
		}
	})
}

export const useTeacherClassListApi = (status: any) => {
	return service.get('/teaching/class/teacher/' + status)
}

export const useEndingClassApi = (id: number) => {
	return service.get('/teaching/class/classStatus/' + id)
}

export const useTeachClassPriceApi = (id: number) => {
	return service.get('/teaching/class/price' + id)
}

export const useOpenClassesApi = () => {
	return service.get('/teaching/class/getOpenClassesList')
}
export const useOpenClassesWithOrgApi = (id:number) => {
	return service.get('/teaching/class/getOpenClassesListWithOrg/'+id)
}

export const dataListUrl = '/teaching/class/page'
export const deleteUrl = '/teaching/class'
