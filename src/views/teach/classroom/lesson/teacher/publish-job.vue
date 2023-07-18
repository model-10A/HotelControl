<template>
	<div>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-row>
				<el-col :span="8">
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
				</el-col>

				<el-col :span="8">
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
				</el-col>

				<el-form-item label="作业状态" prop="homeworkStatus">
					<el-tag v-if="dataForm.homeworkStatus === 0" type="info">未发布</el-tag>
					<el-tag v-else-if="dataForm.homeworkStatus === 1">进行中</el-tag>
					<el-tag v-else-if="dataForm.homeworkStatus === 2" type="danger">已结束</el-tag>
				</el-form-item>
			</el-row>
		</el-form>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border max-height="300" style="width: 100%">
			<el-table-column align="center" header-align="center" label="问题编号" prop="problemId" width="100"> </el-table-column>
			<el-table-column align="center" header-align="center" label="问题名称" prop="problemName" show-overflow-tooltip></el-table-column>
			<fast-table-column
				align="center"
				dict-type="problem_type"
				header-align="center"
				label="问题类型"
				prop="problemType"
				width="100"
			></fast-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="选择作业" width="200">
				<template #default="scope">
					<el-checkbox v-model="scope.row.used" :false-label="0" :true-label="1" />
				</template>
			</el-table-column>
		</el-table>

		<!--		<el-button v-if="dataForm.homeworkStatus === 1" type="danger" @click="submitHandle(2)">截止</el-button>-->
		<!--		<el-button v-if="dataForm.homeworkStatus === 0" type="primary" @click="submitHandle(1)">发布作业</el-button>-->
		<!--		<el-button v-else-if="dataForm.homeworkStatus === 1" type="primary" @click="submitHandle(1)">重新发布</el-button>-->
		<!--		<el-button v-else-if="dataForm.homeworkStatus === 2" type="primary" @click="submitHandle(1)">重新发布</el-button>-->
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { updateLessonHomework, useLessonApi } from '@/api/lessons/lesson'
import { ElMessageBox } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl, useUpdateLessonProblemApi } from '@/api/lessons/problem'
import { useCrud } from '@/hooks'

const emit = defineEmits(['refreshDataList'])
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	homeworkBeginTime: '',
	homeworkEndTime: '',
	homeworkStatus: 0
})
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		lessonId: props.modelValue,
		type: 2
	},
	isPage: false
	// createdIsNeed: false
})

const getLesson = (id: number) => {
	useLessonApi(id).then((res: any) => {
		console.log(res)
		Object.assign(dataForm, res.data)
	})
}

const init = () => {
	state.queryForm.lessonId = props.modelValue

	getLesson(props.modelValue)
}

init()
const dataRules = ref({})

// 表单提交
const submitHandle = (status: number) => {
	ElMessageBox.confirm('确定进行操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
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
					useUpdateLessonProblemApi(state.dataList)
					getLesson(props.modelValue)
					ElMessage.success({
						message: '操作成功',
						duration: 500,
						onClose: () => {
							visible.value = false
							emit('refreshDataList')
						}
					})
				})
			})
		})
		.catch(() => {})
}
const disabledDateFun = (time: Record<string, any>): boolean => {
	return time.getTime() <= new Date().getTime() - 24 * 60 * 60 * 1000
}
const { getDataList } = useCrud(state)

defineExpose({
	submitHandle
})
</script>
