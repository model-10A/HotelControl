import service from '@/utils/request'
export const useExamRecordApi = (data: any) => {
	return service.get('/judge/exam/record/getUserExamScore', {
		params: {
			...data
		}
	})
}
export const answerSituationApi = (data:any)=>{
	return service.get(ExamRecordListUrl,{
		params:{
			examId:data.examId,
			name:data.name,
			status:data.status,
			isCorrecting:data.isCorrecting
		}
	})
}

export const useExamRecordListApi = (data: any) => {
	return service.get('/judge/exam/record/getExamRecordList', {
		params: {
			...data
		}
	})
}

export const changeProblemScoreApi = (data:any) => {
  return service.get('judge/exam/record/changeProblemScore',{
	  params:{
		  score:data.fraction,
		  recordId:data.recordId,
	  }
  })
}


export const useMakePaperApi=(examId:any,userId:any)=>{
	return service.get('judge/exam/record/makePaper',{
		params:{
			examId:examId,
			userId:userId
		}
	})
}

export  const ExamRecordListUrl='/judge/exam/record/getExamRecordList';
