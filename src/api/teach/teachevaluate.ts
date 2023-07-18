import service from '@/utils/request'

export const useTeachEvaluateSubmitApi = (dataForm:any) =>{
    return service.post('/teaching/evaluate', dataForm)
}

export const deleteUrl = '/teaching/evaluate'

export const dataListUrl = '/teaching/evaluate/page'