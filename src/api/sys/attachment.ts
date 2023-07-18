import service from '@/utils/request'

export const useAttachmentSubmitApi = (dataForm: any) => {
	return service.post('/sys/attachment', dataForm)
}

export const dataListUrl = '/sys/attachment/page'
export const deleteUrl = '/sys/attachment'
