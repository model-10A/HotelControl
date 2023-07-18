<template>
	<el-card>
		<el-card style="height: 100px">
			<el-page-header :icon="null" @back="onBack">
				<template #icon>
					<svg-icon icon="icon-left"></svg-icon>
				</template>
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
						<!--            <el-button style="margin-left: 10px" type="primary" @click="refresh">刷新</el-button>-->
					</div>
				</template>
			</el-page-header>
		</el-card>

		<el-card>
			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="学生列表" name="first">
					<lesson-chat v-model="lessonId" />
				</el-tab-pane>
				<!--				<el-tab-pane label="课堂学习" name="second">-->
				<!--					<lesson-resources v-model="lessonId" />-->
				<!--				</el-tab-pane>-->
				<el-tab-pane :label="setTabSecondName()" name="third">
					<lesson-problem ref="lessonProblemRef" v-model="lessonId" />
				</el-tab-pane>

				<el-tab-pane label="考试列表" name="fourth">
					<exam-list v-model="lessonId"></exam-list>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</el-card>
</template>

<script lang="ts" name="ClassroomLessonStudentIndex" setup>
import { useRoute, useRouter } from 'vue-router'
import CountDown from '@/components/count-down/count-down.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import LessonResources from '@/views/classroom/lesson/student/lesson-resources/lesson-resources.vue'
import LessonProblem from '@/views/classroom/lesson/student/lesson-problem/lesson-problem.vue'
import LessonChat from '@/views/classroom/lesson/student/lesson-chat/lesson-chat.vue'
import { attendLessonApi, useLessonApi } from '@/api/lessons/lesson'
import moment from 'moment'
// import socket from '@/utils/socket.ts'
import store from '@/store'

import { closeTab } from '@/utils/tabs'
// import { sendLoginLesson } from '@/utils/LessonMsgSend.ts'
import ExamList from '@/views/classroom/lesson/student/exam-list/exam-list.vue'

const activeName = ref('first')
const route = useRoute()
const router = useRouter()
const state = reactive({
	name: '',
	beginTime: '',
	endTime: ''
})

const lessonId = ref(route.params.lessonId)
const countDownRef = ref()
const lessonProblemRef = ref()
const getClassInfo = () => {
	useLessonApi(lessonId.value).then(res => {
		countDownRef.value.init(res.data.endTime)
		state.name = res.data.name
		state.beginTime = res.data.beginTime
		state.endTime = res.data.endTime
		lessonProblemRef.value.init(state.beginTime)
	})
}

const onBack = () => {
	router.push({ path: '/classroom/mylesson/student/index' })
}

const setTabSecondName = () => {
	let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	if (now < state.beginTime) {
		return '预习作业'
	} else {
		return '课堂作业'
	}
}
socket.init(null)

watch(
	() => router.currentRoute.value.path,
	(newValue, oldValue) => {
		lessonId.value = route.params.lessonId
		if (lessonId.value !== undefined) {
			getClassInfo()
			attendLessonApi(lessonId.value)
				.then(res => {})
				.catch(err => {
					closeTab(router, route)
				})
			sendLoginLesson(Number(lessonId.value), { username: store.userStore.user.realName })
		}
	},
	{ immediate: true, deep: true }
)
onMounted(() => {
	attendLessonApi(lessonId.value)
		.then(res => {})
		.catch(err => {
			closeTab(router, route)
		})
})
</script>

<style scoped></style>
