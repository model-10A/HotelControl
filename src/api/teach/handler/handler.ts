import service from '@/utils/request'

export const useGetPaymentInfoConfirmById = (id:number) =>{
  return service.get('teaching/handler/info/'+id)
}

export const submitPaymentInfoConfirmByIdApi = (data: any) => {
  return service.post('teaching/teachpay/process',data)
}