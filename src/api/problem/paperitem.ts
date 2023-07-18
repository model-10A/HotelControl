import service from '@/utils/request'

export const useProblemPaperItemApi = (paperId: Number) => {
	return service.get('/problem/paperItem/' + paperId)
}

export const useProblemPaperItemSubmitApi = (paperItemList: any) => {
	return service.post('/problem/paperItem', paperItemList)
}

export const useProblemPaperItemDeleteApi = (id: number) => {
	return service.delete('/problem/paperItem/' + id)
}
