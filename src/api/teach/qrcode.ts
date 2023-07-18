import service from '@/utils/request'

export const getPromotionQR = (id: Number) => {
	return service.get('/teaching/qr-code/getPromotionQR', {
		params: { id: id },
		responseType: 'blob'
	})
}

export const downLoadQR = (id: Number, name: String) => {
	return service.get('/teaching/qr-code/downloadQR', {
		params: { id: id, name: name }
	})
}
