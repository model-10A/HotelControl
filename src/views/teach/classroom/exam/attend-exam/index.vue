<template>
	<el-row :gutter="20">
		<el-col :span="6">
			<el-card style="height: 80vh; overflow: auto">
				<h1>{{ examData.attendLogVO.examName }}</h1>
				<br />
				<div>总分：{{ examData.attendLogVO.totalScore }} <span style="margin-right: 10px"></span>时长：{{ examData.attendLogVO.timeLimit }}</div>
				<el-divider />
				<div style="font-size: 30px; text-align: center">{{ examData.problemIndex }}/{{ examData.paperProblem.length }}</div>
				<el-divider />
				<div style="text-align: center">
					<h1 style="margin: 0px">剩余时间</h1>
					<div style="color: red; font-size: 20px">
						<count-down ref="examCountDownRef" v-model="flag"></count-down>
					</div>
				</div>
				<el-divider />
				<div style="text-align: center">
					<el-button v-if="examData.back === 1" :disabled="examData.problemIndex === 1" size="large" type="primary" @click="nextOrLastProblem(0)"
						>上一题
					</el-button>
					<el-button :disabled="examData.problemIndex >= examData.paperProblem.length" size="large" type="primary" @click="nextOrLastProblem(1)"
						>下一题
					</el-button>
					<el-divider />
					<el-button :disabled="examData.problemIndex !== examData.paperProblem.length" size="large" type="primary" @click="submitPaper()">
						提交试卷
					</el-button>
				</div>
				<el-divider v-if="examData.back === 0" />
				<h1 v-if="examData.back === 0">注：当前考试形式，不可返回上一题</h1>
			</el-card>
		</el-col>
		<el-col :span="18">
			<el-card style="height: 80vh; overflow: auto">
				<template #header>
					<div class="card-header">
						<div style="text-align: center; margin-top: 5px">
							<h1 v-if="examData.paperProblem.length > 0">
								{{ examData.problemIndex }}、{{ examData.paperProblem[examData.problemIndex - 1].problemName }}（{{
									examData.paperProblem[examData.problemIndex - 1].score
								}}分）
							</h1>
						</div>
					</div>
				</template>
				<div v-if="examData.paperProblem.length > 0">
					<code-problem-info
						v-if="record.problemType === 3"
						ref="codeRef"
						:index="examData.problemIndex"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></code-problem-info>
					<fill-problem-info
						v-if="record.problemType === 2"
						ref="fillRef"
						:index="examData.problemIndex"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></fill-problem-info>
					<choice-problem-info
						v-if="record.problemType === 1"
						ref="choiceRef"
						:index="examData.problemIndex"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></choice-problem-info>
				</div>
			</el-card>
		</el-col>
	</el-row>

	<el-dialog v-model="flag" center title="考试结束" width="30%" @close="finishExam()">
		<span>您的考试答题时间已结束，已为您自动交卷</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="finishExam()">关闭</el-button>
				<el-button type="primary" @click="finishExam()">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import CountDown from '@/components/count-down/count-down.vue'
import CodeProblemInfo from '@/components/problem-info-exam/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info-exam/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info-exam/fill-problem-info.vue'
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAttendExamApi, useExamIndexApi, useExamPaperApi } from '@/api/lessons/exam'
import { ElMessage } from 'element-plus'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import { closeTab } from '@/utils/tabs'

const examCountDownRef = ref()
const flag = ref(false)
const examId = ref()
const route = useRoute()
const router = useRouter()
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
const record = reactive({
	languageType: 52,
	problemType: 3,
	problemId: 0,
	submitContent: '',
	source: 3,
	sourceId: 0,
	submitStatus: null,
	submitTime: '',
	submitImg: '',
	filePath: ''
})
const examData = reactive({
	paperProblem: [] as any,
	problemIndex: 0,
	back: 0,
	attendLogVO: {
		id: 0,
		examId: 0,
		timeLimit: 0,
		examName: '',
		totalScore: 0,
		finishExamTime: ''
	}
})

examId.value = route.params.examId
const getDate = () => {
	useAttendExamApi(examId.value)
		.then(res => {
			Object.assign(examData, res.data)
			examCountDownRef.value.init(examData.attendLogVO.finishExamTime)
			setRecord()
		})
		.catch(err => {
			closeTab(router, route)
		})
}

getDate()

const setAnswerRecord = () => {
	let answer = {
		languageType: 0,
		submitContent: '',
		submitImg: '',
		filePath: ''
	}
	if (record.problemType === 1) {
		answer = choiceRef.value.getAnswer()
	} else if (record.problemType === 2) {
		answer = fillRef.value.getAnswer()
	} else {
		answer = codeRef.value.getAnswer()
	}
	record.languageType = answer.languageType
	record.submitContent = answer.submitContent
	record.submitImg = answer.submitImg
	record.filePath = answer.filePath
}
const nextOrLastProblem = (type: any) => {
	setAnswerRecord()
	//判空
	if (type === 1) {
		if (record.submitContent === '' || record.submitContent === null || record.submitContent === undefined) {
			ElMessage.error('答案为空！！')
			return
		}
	}

	//提交
	useJudgeApi(record)
	if (type === 1) {
		examData.problemIndex++
	} else {
		examData.problemIndex--
	}

	setRecord()

	//服务器更新
	useExamIndexApi(examId.value)
}

const setRecord = () => {
	if (examData.paperProblem.length > 0) {
		record.problemId = examData.paperProblem[examData.problemIndex - 1].problemId
		record.problemType = examData.paperProblem[examData.problemIndex - 1].problemType
		record.sourceId = examData.attendLogVO.examId
	}
}

const finishExam = () => {
	flag.value = false
	closeTab(router, route)
}

watch(flag, (newName, oldName) => {
	if (flag.value == true) {
		submitPaper()
	}
})

const submitPaper = () => {
	setAnswerRecord()
	useJudgeApi(record).finally(() => {
		//结束考试
		useExamPaperApi(examId.value).then(res => {
			ElMessage.success('提交成功，考试结束！')
			closeTab(router, route)
		})
	})
}
</script>

<style scoped>
.div-el-tag :hover {
	cursor: pointer;
}
</style>
