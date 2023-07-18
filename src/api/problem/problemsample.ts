import service from '@/utils/request'

export const uploadSampleProblemApi = (data: any) => {
	return service.post('/problem/sample/file/', data)
}

export const getSampleFileApi = (path: string) => {
	return service.get('/file/sample/fileStream', {
		params: {
			path: path
		},
		responseType: 'blob'
	})
}

export const dataListUrl = '/problem/sample/list/'

export const deleteUrl = '/problem/sample'
