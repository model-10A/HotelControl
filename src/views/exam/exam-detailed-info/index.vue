<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span>
					<span style="font-size: 25px">《{{ state.name }}》</span>
					<span style="font-size: 18px">（总分:{{ state.score }}）</span>
					({{ state.beginTime }} - {{ state.endTime }})
				</span>
			</div>
		</template>
		<div style="position: absolute; right: 60px; z-index: 999">
			<el-button type="primary" @click="showDialog()">附件下载</el-button>
		</div>
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="考试情况" name="first">
				<answer-situation v-model="examId"></answer-situation>
			</el-tab-pane>

			<el-tab-pane label="学生列表" name="second">
				<exam-students-list ref="examListRef" v-model="examId"></exam-students-list>
			</el-tab-pane>

			<el-tab-pane label="考题列表" name="third">
				<exam-problem-list ref="examProblemListRef" v-model="examId"></exam-problem-list>
			</el-tab-pane>

			<el-tab-pane label="成绩分析" name="fourth">
				<score-analysis v-if="activeName === 'fourth'" v-model="examId"></score-analysis>
			</el-tab-pane>
		</el-tabs>
	</el-card>

	<el-dialog v-model="dialogVisible" title="选择题目" width="300px">
		<el-select v-model="problemId" placeholder="选择要下载附件的题目" size="large" value-key="{{problem.id}}">
			<el-option v-for="item in problemList" :key="item.id" :label="item.problemName" :value="item.problemId" />
		</el-select>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="downloadZip()">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import AnswerSituation from './answer-situation/answer-situation.vue'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExamStudentsList from '@/views/exam/exam-detailed-info/exam-students-list.vue'

import ExamProblemList from '@/views/exam/exam-detailed-info/exam-problem-list.vue'
import { useDownloadZipApi, useExamApi, useExamExcelApi, userProblemExamApi } from '@/api/lessons/exam'
import ScoreAnalysis from '@/views/exam/exam-detailed-info/score-analysis/score-analysis.vue'
import { number } from 'echarts'
import { ElMessage } from 'element-plus'
const activeName = ref('first')
const route = useRoute()
const router = useRouter()
const examId = ref(route.params.examId)
const state = reactive({})
const examListRef = ref()

const problemId = ref()
const dialogVisible = ref(false)
const getExamInfo = () => {
	useExamApi(Number(examId.value)).then(res => {
		Object.assign(state, res.data)
	})
}

const showDialog = () => {
	dialogVisible.value = true
	getExamProblemList()
}

const problemList = ref([] as any)
const getExamProblemList = () => {
	userProblemExamApi(examId.value).then(res => {
		problemList.value = res.data
	})
}

const downloadZip = () => {
	problemList.value.forEach((item: any) => {
		if (item.problemId === problemId.value) {
			useDownloadZipApi(item.problemName, problemId.value, item.problemType, 3, examId.value).then((res: any) => {
				ElMessage.success('下载成功')
			})
		}
	})
}

getExamInfo()
</script>

<style scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
