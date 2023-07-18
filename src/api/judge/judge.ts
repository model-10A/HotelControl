import service from '@/utils/request'

export const useJudgeApi = (judgeRecord: any) => {
	return service.post('/judge/record', judgeRecord)
}

export const userGetRecordApi = (judgeRecord: any) => {
	return service.post('/judge/getRecord', judgeRecord)
}

export const useRecordAndAnswerApi = (record: any) => {
	return service.post('/judge/getRecordAndAnswer', record)
}

export const useReasonAndStatusApi = (record: any) => {
	return service.post('/judge/updateReasonAndStatus', record)
}

export const checkUserRecordApi = () =>{
	return service.get('/judge/statisticsUserJudgeRecord')
}