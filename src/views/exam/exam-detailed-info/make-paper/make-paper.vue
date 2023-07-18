<template>
	<el-card v-loading="loading.value">
		<template #header>
			<div class="card-header">
				<span>
					<span style="font-size: 25px">《{{ state.name }}》</span>
					<span style="font-size: 18px">（总分:{{ state.score }}）</span>
					({{ state.beginTime }} - {{ state.endTime }})
				</span>
			</div>
		</template>
		<el-row :gutter="20">
			<el-col :span="8">
				<div style="overflow: auto; padding-top: 9px">
					<el-card>
						<el-row :gutter="24" style="margin: 10px">
							<el-col :span="12"> 姓名: </el-col>
							<el-col :span="12">
								<div>{{ name }}</div>
							</el-col>
						</el-row>
						<el-row :gutter="24" style="margin: 10px">
							<el-col :span="12"> 答题时间: </el-col>
							<el-col :span="12">
								<div>{{ duration }}分钟</div>
							</el-col>
						</el-row>
					</el-card>
					<el-table
						:data="examData.paperProblem"
						:summary-method="getSummaries"
						border
						highlight-current-row
						max-height="100vh"
						show-summary
						@row-click="handle"
					>
						<el-table-column header-align="center" label="问题列表">
							<template #default="scope">
								<span>{{ scope.$index + 1 }}、{{ scope.row.problemName }}({{ scope.row.score }}分)</span>
							</template>
						</el-table-column>
						<el-table-column header-align="center" label="得分" width="115px">
							<template #default="scope">
								<el-input-number
									v-model="scope.row.fraction"
									:disabled="scope.row.submitStatus === null"
									:max="scope.row.score"
									:min="0"
									:precision="2"
									controls-position="right"
									size="small"
									style="width: 90px"
									@blur="updateHandle(scope.row)"
								/>
							</template>
						</el-table-column>
					</el-table>
					<div style="display: flex; flex-direction: row; justify-content: center; margin-top: 10px">
						<el-button type="success" @click="makePaperHandle()">一键批卷</el-button>

						<el-divider border-style="b_d_s" direction="vertical" />
						<el-button type="primary" @click="submitMakePaperHandle()">提交批改</el-button>
					</div>
				</div>
			</el-col>

			<el-col :span="16">
				<div v-if="examData.paperProblem.length > 0">
					<code-problem-info
						v-if="record.problemType === 3"
						ref="codeRef"
						:flag="false"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></code-problem-info>
					<fill-problem-info
						v-if="record.problemType === 2"
						ref="fillRef"
						:flag="false"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></fill-problem-info>
					<choice-problem-info
						v-if="record.problemType === 1"
						ref="choiceRef"
						:flag="false"
						:problem-id="record.problemId"
						:source-id="record.sourceId"
						source="3"
					></choice-problem-info>
				</div>

				<submit-problem-completion ref="submitProblemCompletionRef" v-model="flag"></submit-problem-completion>
				<el-card>
					<div class="t_s_i">
						<el-row :gutter="24">
							<el-col :span="5"><div class="t_s_t">得分</div> </el-col>
							<el-col :span="12">
								<el-input-number
									v-model="clickRow.fraction"
									:max="clickRow.score"
									:min="0"
									:precision="2"
									controls-position="right"
								></el-input-number>
							</el-col>
							<el-col :span="7">
								<el-button type="primary" @click="submitScore()">确定</el-button>
							</el-col>
						</el-row>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</el-card>
</template>

<script lang="ts" setup>
import CodeProblemInfo from '@/components/problem-info-exam/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info-exam/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info-exam/fill-problem-info.vue'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { updateExamStudentApi, useExamApi, useUserInfoApi } from '@/api/lessons/exam'
import SubmitProblemCompletion from '@/components/problem-completion/submit-problem-completion.vue'
import { changeProblemScoreApi, useExamRecordApi, useMakePaperApi } from '@/api/judge/examRecord'
import { ElMessage } from 'element-plus'
import { router } from '@/router'

import dayjs from 'dayjs'
const name = ref()
const duration = ref()
const flag = ref(1)
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const state = reactive({})
const route = useRoute()
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
const submitProblemCompletionRef = ref()
const examId = ref(route.params.examId)
const userId = ref(route.params.userId)
const loading = ref(false)
const record = reactive({
	languageType: 52,
	problemType: 0,
	problemId: 0,
	source: 3,
	userId: Number(route.params.userId),
	sourceId: Number(route.params.examId)
})
const clickRow = ref({
	fraction: 0.0,
	score: 0.0
})
const examData = reactive({
	paperProblem: [
		{
			problemId: 0,
			problemType: 0
		}
	],
	problemIndex: 0
})
const sums: any[] = ['总分', 0]

const makePaperHandle = () => {
	useMakePaperApi(examId.value, userId.value).then(res => {
		getDate()
		ElMessage.success('批改完成！')
	})
}

const submitMakePaperHandle = () => {
	let examLog = {
		userId: userId.value,
		examId: examId.value,
		score: sums[1],
		isCorrecting: 1
	}
	updateExamStudentApi(examLog).then(res => {
		ElMessage.success('提交成功！')
		router.push({ path: '/exam/tea-exam/' + examId.value })
	})
}

const updateHandle = (row: any) => {
	changeProblemScoreApi(row).then(res => {
		ElMessage.success('修改成功！')
	})
}
const submitScore = () => {
	updateHandle(clickRow.value)
}
const getDate = () => {
	loading.value = true
	useUserInfoApi({ userId: userId.value, examId: examId.value }).then(res => {
		name.value = res.data.name
		duration.value = dayjs(res.data.quitTime).diff(dayjs(res.data.joinTime), 'minutes')
	})
	useExamRecordApi({ examId: examId.value, userId: userId.value }).then(res => {
		examData.paperProblem = res.data.problemRecords
		record.problemId = examData.paperProblem[0].problemId
		record.problemType = examData.paperProblem[0].problemType
		record.sourceId = Number(examId.value)
		record.userId = Number(userId.value)
		clickRow.value = examData.paperProblem[0]
		initSubmitAndJudgementCompletion()
		loading.value = false
	})
}
getDate()
const getSummaries = () => {
	let total = 0
	examData.paperProblem.forEach((item: any) => {
		total += item.fraction
	})
	sums[1] = total
	return sums
}
const handle = (row: any, event: any, column: any) => {
	if (row.problemId !== record.problemId) {
		clickRow.value = row
		record.problemId = row.problemId
		record.problemType = row.problemType
		record.sourceId = Number(examId.value)
		record.userId = Number(userId.value)
		initSubmitAndJudgementCompletion()
	}
}
const getExamInfo = () => {
	useExamApi(Number(examId.value)).then(res => {
		Object.assign(state, res.data)
		console.log(state)
	})
}

const initSubmitAndJudgementCompletion = () => {
	submitProblemCompletionRef.value.init(record.problemId, record.problemType, record.source, record.sourceId, record.userId, record.fraction)
}
getExamInfo()
</script>

<style scoped>
.div-el-tag :hover {
	cursor: pointer;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover {
	cursor: pointer;
}
.t_s_i {
	display: flex;
	flex-direction: row-reverse;
}
.t_s_t {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}
</style>
