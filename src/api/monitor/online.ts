import service from '@/utils/request'

export const useForceLogoutApi = (token: string) => {
	return service.delete('/monitor/online/' + token)
}

export const dataListUrl = '/monitor/online/page'
