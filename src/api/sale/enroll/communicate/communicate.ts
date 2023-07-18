import service from "@/utils/request";

//报名沟通 获取学生信息
export const getCommunicateStuInfoApi = (id: number) => {
    return service.get('sale/communicate/getEnrollStuInfo/'+id)
}
//报名沟通 提交完善学生信息
export const submitCommunicateStuInfoApi = (form: any) => {
    return service.post("sale/communicate/improveStuInfo",form)
}
//报名沟通 获取课程表信息
export const getCommunicateScheduleApi = () => {

}
//获取沟通历史
export const getCommunicateHistoryApi = (id: number) => {
    return service.get('sale/communicate/getCommunicateHistory/'+id)
}
//获取试听详情
export const getCommunicateAuditionApi = (id: number) => {
    return service.get('sale/communicate/trialDetails/'+id)
}

//获取缴费详情
export const getCommunicatePaymentApi = (id: number) => {
    return service.get('sale/communicate/paymentDetail/'+id)
}

//获取报名备注和沟通备注
export const getDescriptionApi = (id: number) => {
    return service.get('sale/communicate/getRemarks/'+ id)
}

//提交沟通备注
export const submitCommunicateDescriptionApi = (data: any) => {
    return service.post('sale/communicate/remark',data)
}

//获取试听课程 （下拉框）
export const getAuditionLessonApi = () => {
    return service.get('sale/communicate/getAuditions')
}

//提交沟通表单
export const submitCommunicateFormApi = (dataForm: any) => {
    return service.post('sale/communicate/submit', dataForm)
}


export const getHandlerApi = () => {
    return service.get('sale/communicate/handler')
}

//获取学生的优惠折扣
export const getDiscountApi = (id:number) => {
    return service.get("sale/communicate/getDiscount/" + id)
}

//获取活动对应的优惠折扣列表
export const getActivityDiscountApi = (id:any) => {
    return service.get("sale/communicate/getActivityDiscount/"+id)
}


