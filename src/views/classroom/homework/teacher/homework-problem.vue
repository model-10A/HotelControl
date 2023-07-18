<template>
	<el-card>
		<el-card style="height: 100px">
			<el-page-header :icon="null" @back="onBack">
				<template #icon> <svg-icon icon="icon-left"></svg-icon></template>
				<template #content>
					<span style="font-size: 25px">《{{ state.name }}》课后作业</span>
				</template>
				<template #extra>
					<div class="flex items-center">
						<el-button v-if="state.homeworkStatus === 1" type="danger" @click="submitHandle(2)">截止</el-button>
						<el-button v-if="state.homeworkStatus === 0" type="primary" @click="dataFormDialogVisible = true">发布作业</el-button>
						<el-button v-else-if="state.homeworkStatus === 1" type="primary" @click="dataFormDialogVisible = true">重新发布</el-button>
						<el-button v-else-if="state.homeworkStatus === 2" type="primary" @click="dataFormDialogVisible = true">重新发布</el-button>
					</div>
				</template>
			</el-page-header>
		</el-card>
		<el-card>
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
			</el-tabs>
		</el-card>
	</el-card>

	<el-dialog v-model="dataFormDialogVisible" draggable title="请选择时间" width="30%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="作业开始时间" prop="homeworkBeginTime">
				<el-date-picker
					v-model="dataForm.homeworkBeginTime"
					:disabled-date="disabledDateFun"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>

			<el-form-item label="作业结束时间" prop="homeworkEndTime">
				<el-date-picker
					v-model="dataForm.homeworkEndTime"
					:disabled-date="disabledDateFun"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>

			<el-form-item label="作业状态" prop="homeworkStatus">
				<el-tag v-if="dataForm.homeworkStatus === 0" type="info">未发布</el-tag>
				<el-tag v-else-if="dataForm.homeworkStatus === 1">进行中</el-tag>
				<el-tag v-else-if="dataForm.homeworkStatus === 2" type="danger">已结束</el-tag>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dataFormDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submitHandle(1)"> 确认 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import AnswerSituation from '@/views/classroom/homework/teacher/answer-situation/answer-situation.vue'
import LessonChat from '@/views/classroom/homework/teacher/lesson-chat/lesson-chat.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import LessonProblem from '@/views/classroom/homework/teacher/lesson-problem/lesson-problem.vue'
import { reactive } from 'vue'
import moment from 'moment'
import { updateLessonHomework, useLessonApi } from '@/api/lessons/lesson'
import { provide } from 'vue'
import { router } from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { dataListUrl, deleteUrl, useUpdateLessonProblemApi } from '@/api/lessons/problem'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
const dataFormDialogVisible = ref(false)
const route = useRoute()
const lessonId = ref(route.params.lessonId)
const activeName = ref('first')
const addOrUpdateRef = ref()
const disabledDateFun = (time: Record<string, any>): boolean => {
	return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000
}
const addOrUpdateHandle = (row: number) => {
	addOrUpdateRef.value.init(row)
}

const dataForm = reactive({
	id: 0,
	homeworkBeginTime: '' as any,
	homeworkEndTime: '' as any,
	homeworkStatus: '' as any
})

const state = reactive({
	id: 0,
	name: '',
	beginTime: '',
	endTime: '',
	status: '' as any,
	nowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
	homeworkStatus: '' as any
})

const data: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		lessonId: route.params.lessonId,
		type: 2
	},
	isPage: false
	// createdIsNeed: false
})

const getLesson = () => {
	useLessonApi(route.params.lessonId).then((res: any) => {
		Object.assign(dataForm, res.data)
	})
}
getLesson()
const getClassInfo = () => {
	useLessonApi(lessonId.value).then(res => {
		state.id = Number(lessonId.value)
		state.name = res.data.name
		state.beginTime = res.data.beginTime
		state.endTime = res.data.endTime
		state.homeworkStatus = Number(res.data.homeworkStatus)
		dataForm.homeworkStatus = Number(res.data.homeworkStatus)
	})
	provide('state', state)
}
const onBack = () => {
	router.push({ path: '/classroom/homework/teacher/index' })
}
const visible = ref(false)
const dataFormRef = ref()
// 表单提交
const submitHandle = (status: number) => {
	ElMessageBox.confirm('确定进行操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		if (status == 2) {
			dataForm.homeworkStatus = status
			updateLessonHomework(dataForm).then(() => {
				//更新题目启用列表
				useUpdateLessonProblemApi(data.dataList)
				ElMessage.success({
					message: '操作成功',
					duration: 500,
					onClose: () => {
						getClassInfo()
						visible.value = false
					}
				})
			})
		} else {
			dataFormRef.value.validate((valid: boolean) => {
				if (!valid) {
					return false
				}
				if (status !== 2) {
					if (new Date(dataForm.homeworkEndTime) < new Date()) {
						ElMessage.error('结束时间小于当前时间')
						return false
					}
					if (dataForm.homeworkBeginTime > dataForm.homeworkEndTime) {
						ElMessage.error('开始时间不得大于结束时间！')
						return false
					}
				}
				dataForm.homeworkStatus = status
				updateLessonHomework(dataForm).then(() => {
					//更新题目启用列表
					useUpdateLessonProblemApi(data.dataList)
					ElMessage.success({
						message: '操作成功',
						duration: 500,
						onClose: () => {
							getClassInfo()
							dataFormDialogVisible.value = false
						}
					})
				})
			})
		}
	})
}
const dataRules = ref({})
getClassInfo()
const { getDataList } = useCrud(data)
</script>

<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 15px;
}
</style>
