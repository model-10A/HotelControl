import service from '@/utils/request'

export const useGetEnrollStuInfoApi = (id:number) =>{
    return service.get('sale/details/stuInfo/'+ id )
}

export const useGetEnrollEventsInfoApi = (id:number) =>{
    return service.get('sale/details/activity/'+ id )
}

export const useGetEnrollCommunicateInfoApi = (id:number) =>{
    return service.get('sale/details/communicateInfo/'+ id )

}

export const useGetEnrollAuditionInfoApi = (id:number) =>{
    return service.get("sale/details/AuditionInfo/"+id)
}

export const useGetEnrollPaymentInfoApi = (id:number) =>{
    return service.get("/sale/details/paymentInfo/"+id)
}
