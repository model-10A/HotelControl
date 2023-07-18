<template>
	<el-dialog v-model="visible" width="400px" title="修改课堂时间" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="上课时间" prop="place">
				<el-date-picker
					v-model="dataForm.beginTime"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					type="datetime"
					placeholder="开始时间"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="结课时间" prop="place">
				<el-date-picker
					v-model="dataForm.endTime"
					format="YYYY-MM-DD HH:mm:ss"
					value-format="YYYY-MM-DD HH:mm:ss"
					type="datetime"
					placeholder="结束时间"
				></el-date-picker>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useLessonApi, useLessonSubmitApi } from '@/api/lessons/lesson'
import moment from 'moment'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	endTime: '',
	beginTime: '',
	remark: ''
})

const init = (id: number) => {
	visible.value = true
	getLesson(id)
}

const getLesson = (id: number) => {
	useLessonApi(id).then((res: any) => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (dataForm.beginTime > dataForm.endTime) {
			ElMessage.error('开始时间不得大于结束时间！')
			return false
		}
		useLessonSubmitApi(dataForm).then(() => {
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
}

defineExpose({
	init
})
</script>
