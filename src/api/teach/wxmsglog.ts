import service from '@/utils/request'

export const useWxMsgLogApi = (id: Number) => {
	return service.get('/teaching/wxmsglog/' + id)
}

export const useWxMsgLogSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/teaching/wxmsglog', dataForm)
	} else {
		return service.post('/teaching/wxmsglog', dataForm)
	}
}

export const useSendWxMsgLogApi = (dataForm: any) =>{
	return service.post('/wechat/wx/msg', dataForm)
}

export const useSendBatchMessageApi = (dataForm: any)=>{
	return service.post('/wechat/wx/groupMessage',dataForm)
}

export const dataListUrl = '/wechat/wxMsgLog/page'

export const deleteUrl = '/wechat/wxMsgLog'

