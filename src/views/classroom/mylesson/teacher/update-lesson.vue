<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="调整课堂" width="500px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px">
			<el-form-item label="课堂名称" prop="name">
				<el-input v-model="dataForm.name" style="width: 220px" placeholder="课堂名称"></el-input>
			</el-form-item>
			<el-form-item label="上课地点" prop="place">
				<el-input v-model="dataForm.place" style="width: 220px" placeholder="上课地点"></el-input>
			</el-form-item>
			<el-form-item label="预计上课时间" prop="beginTime">
				<el-date-picker
					v-model="dataForm.beginTime"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="预计结课时间" prop="endTime">
				<el-date-picker
					v-model="dataForm.endTime"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
				></el-date-picker>
			</el-form-item>
			<!--      <el-form-item label="课堂状态" prop="status">-->
			<!--        <el-select v-model="dataForm.status" placeholder="课堂状态" >-->
			<!--          <el-option label="未开启" :value=-1></el-option>-->
			<!--          <el-option label="进行中" :value=0></el-option>-->
			<!--          <el-option label="已结束" :value=1></el-option>-->
			<!--          <el-option label="异常" :value=2></el-option>-->
			<!--        </el-select>-->
			<!--      </el-form-item>-->
		</el-form>
		<template #footer>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useLessonApi, useLessonSubmitApi } from '@/api/lessons/lesson'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	lessonId: 0,
	name: '',
	place: '',
	beginTime: '',
	endTime: '',
	status: 0
})

const init = (id: number) => {
	visible.value = true
	if (id) {
		getLesson(id)
	}
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
			return
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
