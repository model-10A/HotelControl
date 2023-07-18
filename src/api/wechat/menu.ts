import service from '@/utils/request'

export const useWxMenuApi = () => {
	return service.get('/wechat/menu/list')
}

export const useSaveMenuApi = (data: any) => {
	return service.post('/wechat/menu/release', data)
}
