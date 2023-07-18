<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="设置题目时间" width="400px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="开始时间" prop="beginTime">
				<el-date-picker
					v-model="dataForm.beginTime"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime">
				<el-date-picker
					v-model="dataForm.endTime"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useUpdateLessonProblemApi } from '@/api/lessons/problem.ts'

const emit = defineEmits(['refreshDataList'])
const submitList = [] as any[]
const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	lessonId: '',
	problemId: '',
	problemName: '',
	problemType: '',
	beginTime: '',
	score: '',
	endTime: '',
	source: '',
	type: '',
	createTime: '',
	updateTime: ''
})

const init = (row: any) => {
	visible.value = true
	dataForm.id = row.id

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (row.id) {
		Object.assign(dataForm, row)
	}
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (dataForm.beginTime > dataForm.endTime) {
			ElMessage.error('结束时间需大于起始时间')
			return
		}

		submitList.slice(0, submitList.length)
		submitList.push(dataForm)
		useUpdateLessonProblemApi(submitList).then(() => {
			ElMessage.success({
				message: '修改成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
