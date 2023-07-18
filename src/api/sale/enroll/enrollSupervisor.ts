import service from '@/utils/request'
import { numericLiteral } from "@babel/types";


//主管提交家长报名表单
export const useSubmitRegisterFormForSupervisorApi = (form:any) =>{
  return service.post('sale/enroll/registration' , form)
}

//获取销售列表
export const useGetSaleListApi = () => {
  return service.get('sale/user/saleList')
}

//指派-获取学生与销售信息
export const useGetStuAndSaleInfoForSupervisor = (selection:any) => {
  return service.post('sale/enroll/assignmentInfo',selection)
}

//指派-提交新增的指派信息学生的id与销售id
export const useSubmitAssignmentForSupervisorInsert = (form:any) => {
  return service.post('sale/user/cadetsInsert',form)
}

//指派-提交修改的指派信息学生的id与销售id
export const useSubmitAssignmentForSupervisorUpdate = (form:any) => {
  return service.post('sale/user/cadetsUpdate',form)
}

//指派-获取当前销售关联的学生列表
export const useGetSalesStudentsInfoForSupervisor = (id:any) => {
  return service.get("sale/user/stuForSale/"+id)
}