import service from '@/utils/request'

export const getHotelProductsUrl = 'business/product/hotel/page'
export const getRoomProductsUrl = 'business/product/room/page'
export const getOrdersUrl = 'business/order/page'

export const useSubmitHotelFormApi = (form: any) => {
  return service.post('business/product/hotel/add', form)
}

export const useUpdateHotelFormApi = (form: any) => {
  return service.post('business/product/updateHotelInfo', form)
}

export const useGetHotelInfoApi = (id: any) => {
  return service.get('business/product/getHotelInfo/'+id)
}

export const useGetLocalHotelInfoApi = (id:number) => {
  return service.get('business/product/getLocalHotelInfo'+id)
}//获取客户旗下酒店表单Api：

export const useGetOrderInfoApi = (id: any) => {
  return service.get('business/order/getOrderInfo/'+id)
}

export const useUpdateOrderInfoApi = (form: any) => {
  return service.post('business/order/updateOrderInfo', form)
}

