import service from '@/utils/request'
import { downloadFileApi } from '@/api/file/file'
import { returnStatement } from '@babel/types'

export const useExamApi = (id: number) => {
	return service.get('/lessons/exam/' + id)
}

export const useExamSubmitApi = (dataForm: any) => {
	if (dataForm.id) {
		return service.put('/lessons/exam', dataForm)
	} else {
		return service.post('/lessons/exam', dataForm)
	}
}

export const getExamingDataApi = () => {
	return service.get('/lessons/exam/Examing')
}

export const getExamRecordListInfoApi = (data: any) => {
	return service.get('lessons/exam/attend/list', {
		params: {
			examId: data.examId,
			status: data.status,
			isCorrecting: data.isCorrecting
		}
	})
}

export const genExamInvitationCodeApi = (data: any) => {
	return service.get('/lessons/exam/attend/invitation', {
		params: {
			examId: data.examId,
			time: data.time,
			code: data.code
		}
	})
}

export const receiveExamInvitationApi = (data: any) => {
	return service.get('/lessons/exam/attend/receive', {
		params: {
			code: data.code
		}
	})
}

export const updateExamStudentApi = (data: any) => {
	return service.put('lessons/exam/attend', data)
}

export const useAttendExamApi = (examId: any) => {
	return service.get('lessons/stu/exam/' + examId)
}

export const userProblemExamApi = (examId: any) => {
	return service.get('lessons/exam/problem/list/' + examId)
}

export const useExamIndexApi = (examId: any) => {
	return service.get('lessons/exam/updateExamIndex/' + examId)
}

export const useExamPaperApi = (examId: any) => {
	return service.get('lessons/exam/submitPaper/' + examId)
}

export const useUserInfoApi = (data: any) => {
	return service.get('/lessons/exam/attend/getUserExamInfo', {
		params: {
			userId: data.userId,
			examId: data.examId
		}
	})
}

export const userTeacherHomeExamList = (beginTime: any, endTime: any) => {
	return service.get(dataListUrl, {
		params: {
			beginTime: beginTime,
			endTime: endTime,
			page: 1,
			limit: 5
		}
	})
}

export const useExamExcelApi = (examId: any) => {
	return service
		.get('/lessons/exam/exportExam', {
			responseType: 'blob',
			params: {
				examId: examId
			}
		})
		.then(res => {
			downloadFileApi(res)
		})
}

export const useUserExamExcelApi = (query: any) => {
	return service.post('/lessons/exam/exportUserExam', query, { responseType: 'blob' }).then(res => {
		downloadFileApi(res)
	})
}

export const usePaperByClassIdApi = (classIdlist: any) => {
	return service.post('lessons/exam/getPaperByClassId', classIdlist)
}

export const useAbilityExamApi = () => {
	return service.get('lessons/exam/getAbilityExam')
}

export const useAttendLogAbilityExamApi = (examId: any, abilityId: any) => {
	return service.get('lessons/exam/attend/addAttendLogFromAbilityExam', {
		params: {
			examId: Number(examId),
			abilityId: abilityId
		}
	})
}

export const usePromulgateGradeApi = (examId: any, gainAbilityId: any, score: any) => {
	return service.get('/lessons/exam/promulgateGrade', {
		params: {
			examId: examId,
			gainAbilityId: gainAbilityId,
			score: score
		}
	})
}

export const useDownloadZipApi = (problemName: any, problemId: any, problemType: any, source: any, sourceId: any) => {
	return service
		.get('/lessons/exam/downloadZip', {
			params: {
				problemName: problemName,
				problemId: problemId,
				problemType: problemType,
				source: source,
				sourceId: sourceId
			},
			responseType: 'blob'
		})
		.then(res => {
			downloadFileApi(res)
		})
}

export const useExamListByLessonIdApi = (lessonId: any) => {
	return service.get('lessons/exam/getExamListByLessonId', {
		params: {
			lessonId: lessonId
		}
	})
}
export const useExamListByClassIdApi = (id: number) => {
	return service.get('lessons/exam/getExamListByClassId', {
		params: {
			classId: id
		}
	})
}

export const stuDataListUrl = '/lessons/exam/studentPage'
export const stuDataListForIdUrl = '/lessons/exam/studentForId'
export const deleteUrl = '/lessons/exam'
export const dataListUrl = '/lessons/exam/page'
export const examAttendLogUrl = 'lessons/exam/attend/page'
export const examAttendLogDeleteUrl = 'lessons/exam/attend'
