<template>
	<el-card>
		<el-card style="height: 100px">
			<el-page-header :icon="null" @back="onBack">
				<template #icon> <svg-icon icon="icon-left"></svg-icon></template>
				<template #content>
					<span style="font-size: 25px">《{{ state.name }}》</span>
					<el-tag v-if="state.endTime < state.nowTime" type="danger">已结束</el-tag>
					<el-tag v-if="state.beginTime > state.nowTime">未开始</el-tag>
				</template>
				<template #extra>
					<div class="flex items-center">
						<span v-show="state.beginTime <= state.nowTime && state.endTime >= state.nowTime" style="margin-left: 20px"
							>距离下课：<count-down ref="countDownRef"></count-down
						></span>
						<el-button style="margin-left: 10px" type="primary" @click="updateClassHandle()">时间调整</el-button>
						<el-button style="margin-left: 10px" type="primary" @click="exportLesson()">导出课堂</el-button>
					</div>
				</template>
			</el-page-header>
		</el-card>
		<el-card>
			<div style="position: absolute; right: 60px; z-index: 999">
				<el-button v-if="homeworkStatus === 0 || state.endTime > state.nowTime" type="danger" @click="endLesson()">下课</el-button>
				<el-button type="primary" @click="setLessonExam()">添加考试</el-button>
				<el-button type="primary" @click="oneClickPublishAll()">发布习题</el-button>
				<el-button type="primary" @click="addProblemHandle()">添加题目</el-button>
				<el-button type="primary" @click="showDialog()">附件下载</el-button>
			</div>

			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="学生列表" name="first">
					<lesson-chat v-model="lessonId" />
				</el-tab-pane>

				<el-tab-pane label="题目列表" name="second">
					<lesson-problem ref="lessProblemRef" v-model="lessonId" />
				</el-tab-pane>

				<el-tab-pane label="答题情况" name="third">
					<answer-situation ref="answerSituationRef" v-model="lessonId"></answer-situation>
				</el-tab-pane>
				<el-tab-pane label="知识列表" name="fourth">
					<lesson-resources v-model="lessonId" />
				</el-tab-pane>
				<el-tab-pane label="考试列表" name="fifth">
					<exam-list ref="examListRef" v-model="lessonId"></exam-list>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<!--    调整课堂-->
		<update-class ref="updateClassRef" @refreshDataList="getClassInfo()"></update-class>
		<!--    点名-->
		<call-students ref="callStudentsRef" @refreshDataList="getClassInfo()"></call-students>
		<!-- 评价-->
		<evaluation ref="evaluationRef"></evaluation>

		<publish-all ref="publishAllRef"></publish-all>

		<!--添加题目-->
		<add-problem ref="addProblemRef"></add-problem>
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
	<el-dialog v-model="addExamVisible" title="添加考试" width="80%">
		<add-exam
			ref="addExamRef"
			:begin-time="state.beginTime"
			:class-id="state.classId"
			:create-type="1"
			:end-time="state.endTime"
			:lesson-id="route.params.lessonId"
			:model-value="1"
		></add-exam>
	</el-dialog>

	<el-dialog v-model="stepsVisible" :close-on-click-modal="false" title="结束课堂" width="80%">
		<el-steps :active="active" align-center>
			<el-step title="第一步" />
			<el-step title="第二步" />
			<el-step title="第三步" />
		</el-steps>
		<div v-show="active == 0"><Step1 v-model="lessonId"></Step1></div>
		<div v-show="active == 1"><Step2 v-model="lessonId"></Step2></div>
		<div v-show="active == 2"><publish-job ref="publishJobRef" v-model="lessonId"></publish-job></div>
		<div style="text-align: center; margin: 20px">
			<el-button
				v-show="active > 0"
				type="primary"
				@click="
					() => {
						active--
					}
				"
				>上一步</el-button
			>
			<el-button v-show="active == 2" :loading="assignHomeworkLoading" :loading-icon="Eleme" type="primary" @click="assignHomework()"
				>布置作业</el-button
			>
			<el-button
				v-show="active < 2"
				type="primary"
				@click="
					() => {
						active++
					}
				"
				>下一步</el-button
			>
		</div>
		<template #footer>
			<el-button @click="stepsVisible = false">取消</el-button>
			<el-button :loading="loading" type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="ClassroomLessonTeacherIndex" setup>
import { useRoute, useRouter } from 'vue-router'
import CountDown from '@/components/count-down/count-down.vue'
import UpdateClass from './update-class.vue'
import { provide, reactive, ref, watch } from 'vue'
import CallStudents from './call-students.vue'
import LessonResources from '@/views/classroom/lesson/teacher/lesson-resources/lesson-resources.vue'
import LessonProblem from '@/views/classroom/lesson/teacher/lesson-problem/lesson-problem.vue'
import { useLessonApi, useLessonExcelApi, useLessonSubmitApi } from '@/api/lessons/lesson'
import AnswerSituation from '@/views/classroom/lesson/teacher/answer-situation/answer-situation.vue'
import Evaluation from '@/views/classroom/lesson/teacher/evaluation/evaluation.vue'
import moment from 'moment'
import PublishAll from '@/views/classroom/lesson/teacher/publish-all.vue'
import PublishJob from '@/views/classroom/lesson/teacher/publish-job.vue'
import AddProblem from '@/views/classroom/lesson/teacher/add-problem.vue'
import LessonChat from '@/views/classroom/lesson/teacher/lesson-chat/lesson-chat.vue'
import { useDownloadZipApi } from '@/api/lessons/exam'
import { dataListUrl } from '@/api/lessons/problem'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'
// import { sendLoginLesson } from '@/utils/LessonMsgSend.ts'
import store from '@/store'
// import socket from '@/utils/socket.ts'
import ExamList from '@/views/classroom/lesson/teacher/exam-list/exam-list.vue'
import AddExam from '@/views/exam/exammanage/addExam.vue'
import Step1 from '@/views/classroom/lesson/teacher/steps/step1.vue'
import Step2 from '@/views/classroom/lesson/teacher/steps/step2.vue'
import { Eleme } from '@element-plus/icons-vue'
import { dataStudentsListUrl } from '@/api/lessons/attendlog'
import dayjs from 'dayjs'
import { number } from 'echarts'
import { useTeachDestroyedLessonRecordList } from '@/api/teach/teachdestroyedlessonrecord'
const loading = ref(false)
const dialogVisible = ref(false)
const lessProblemRef = ref()
const activeName = ref('first')
const route = useRoute()
const router = useRouter()
const addExamVisible = ref(false)
const state = reactive({
	id: 0,
	name: '',
	beginTime: '',
	endTime: '',
	status: '' as any,
	classId: '' as any,
	nowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
})

const homeworkStatus = ref()
const active = ref(0)
const lessonId = ref(route.params.lessonId)
provide('lessonId', route.params.lessonId)
const countDownRef = ref()
const addProblemRef = ref()
const publishAllRef = ref()
const answerSituationRef = ref()
const examListRef = ref()
let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
const getClassInfo = () => {
	useLessonApi(lessonId.value).then(res => {
		countDownRef.value.init(res.data.endTime)
		state.id = Number(lessonId.value)
		state.name = res.data.name
		state.beginTime = res.data.beginTime
		state.endTime = res.data.endTime
		state.classId = res.data.classId

		homeworkStatus.value = res.data.homeworkStatus
		lessProblemRef.value.init(state)
		examListRef.value.init(lessonId.value)
		answerSituationRef.value.init(state)
		// homeworkProblemRef.value.init(state)
	})
	console.log(state)
	provide('state', state)
}

const updateClassRef = ref()
const updateClassHandle = () => {
	updateClassRef.value.init(lessonId.value)
}

// const callStudentsRef = ref()
// const callStudentsHandle = () => {
// 	callStudentsRef.value.init(lessonId.value)
// }
const onBack = () => {
	router.push({ path: '/classroom/mylesson/teacher/index' })
}
const evaluationRef = ref()
const evaluationHandle = () => {
	evaluationRef.value.init(lessonId.value)
}
// socket.init(null)
// watch(
// 	() => router.currentRoute.value.path,
// 	(newValue, oldValue) => {
// 		lessonId.value = route.params.lessonId
// 		if (lessonId.value !== undefined) {
// 			getClassInfo()
// 			sendLoginLesson(Number(lessonId.value), { username: store.userStore.user.realName + '老师' })
// 		}
// 	},
// 	{ immediate: true, deep: true }
// )

const exportLesson = () => {
	useLessonExcelApi(lessonId.value)
}
const oneClickPublishAll = () => {
	publishAllRef.value.init(state)
}

const addProblemHandle = () => {
	addProblemRef.value.init()
}
const problemId = ref()

const problemList = ref([] as any)
const getLessonProblemList = () => {
	service
		.get(dataListUrl, {
			params: {
				page: false,
				lessonId: lessonId.value,
				type: ''
			}
		})
		.then((res: any) => {
			problemList.value = res.data
		})
}

const showDialog = () => {
	dialogVisible.value = true
	getLessonProblemList()
}
const downloadZip = () => {
	problemList.value.forEach((item: any) => {
		if (item.problemId === problemId.value) {
			useDownloadZipApi(item.problemName, problemId.value, item.problemType, 1, lessonId.value).then((res: any) => {
				ElMessage.success('下载成功')
			})
		}
	})
}

const setLessonExam = () => {
	addExamVisible.value = true
}

const stepsVisible = ref(false)
const endLesson = async () => {
	stepsVisible.value = true
	await getStudentsList()
	await getClassInfo()
}
const submitHandle = async () => {
	loading.value = true

	state.endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	if (active.value == 2) {
		await getClassInfo()
		await useLessonSubmitApi(state).then(() => {
			loading.value = false
			stepsVisible.value = false
		})
		state.nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
		await pushLessonDestroyedRecord()
		await getClassInfo()
		ElMessage.success('下课成功')
	} else {
		ElMessage.info('请点击下一步')
	}
}
const publishJobRef = ref()
const assignHomeworkLoading = ref()
const assignHomework = async () => {
	assignHomeworkLoading.value = true
	await publishJobRef.value.submitHandle(1)
	assignHomeworkLoading.value = false
}

const studentsList = ref([])

const getStudentsList = () => {
	service
		.get(dataStudentsListUrl, {
			params: {
				page: false,
				limit: null,
				lessonId: lessonId.value
			}
		})
		.then((res: any) => {
			studentsList.value = res.data
		})
}

const destroyedRecord = reactive({
	lessonId: '' as any,
	classId: '' as any,
	status: 0,
	type: null,
	duration: '' as any,
	actualDeduction: '' as any,
	direction: ''
})
const studentIdList = ref([] as any)
const pushLessonDestroyedRecord = () => {
	studentIdList.value = []
	let temp = dayjs(new Date(state.endTime)).diff(dayjs(new Date(state.beginTime)), 'minutes') / 60
	destroyedRecord.duration = Number(temp.toFixed(1))
	destroyedRecord.actualDeduction = Number(temp.toFixed(1))
	destroyedRecord.classId = Number(state.classId)
	destroyedRecord.lessonId = Number(lessonId.value)
	studentsList.value.forEach((item: any) => {
		studentIdList.value.push(item.stuId)
	})
	let destoryRecordVo = {
		stuIdList: studentIdList.value,
		vo: destroyedRecord
	}

	useTeachDestroyedLessonRecordList(destoryRecordVo)
}
</script>

<style scoped>
.el-dialog__body {
	min-height: 300px;
}
</style>
