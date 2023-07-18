import service from '@/utils/request'

export const useGetPaperByClassIdListApi = (classIdList: any) => {
	return service.post('/teaching/paper/getPaperByClassIdList', classIdList)
}

export const useAddTeachPlanPaperApi = (teachPlanPaperList: any) => {
	return service.post('/teaching/paper/addTeachPlanPaper', teachPlanPaperList)
}

export const useGetTeachPlanPaperApi = (planId: any) => {
	return service.get('/teaching/paper/getTeachPlanPaper', {
		params: {
			planId: planId
		}
	})
}

export const useDeleteTeachPlanPaperApi = (planId: any) => {
	return service.get('/teaching/paper/deleteTeachPlanPaper', {
		params: {
			planId: planId
		}
	})
}
