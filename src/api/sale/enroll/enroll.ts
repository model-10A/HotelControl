import service from '@/utils/request'

//报名管理页面获取学生
export const getEnrollStudentUrl = 'sale/enroll/page'

//获取课程包


//销售提交家长报名表单
export const useSubmitRegisterFormForSaleApi = (form: any) => {
    return service.post('sale/enroll/registration/sale', form)
}
//获取活动
export const useGetEventsApi = () => {
    return service.get('sale/activity')
}


export const usePostStuAbandonApi = (selection: any) => {
    return service.post('sale/enroll/abandon', selection)

}

