<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="140px" @keyup.enter="submitHandle()">
			<!-- <el-form-item label="班级id" prop="id">
			<el-input v-model="dataForm.id" placeholder="请输入班级id"></el-input>
		</el-form-item> -->
			<el-form-item label="班级名称" prop="className">
				<el-input v-model="dataForm.className" placeholder="请输入班级名称"></el-input>
			</el-form-item>
			<el-form-item label="面向对象" prop="object">
				<el-input v-model="dataForm.object" placeholder="请输入面向对象"></el-input>
			</el-form-item>
			<el-form-item label="课程类型" prop="courseType">
				<el-input v-model="dataForm.courseType" placeholder="请输入课程类型"></el-input>
			</el-form-item>
			<el-form-item label="课程目标" prop="target">
				<el-input v-model="dataForm.target" placeholder="请输入课程目标"></el-input>
			</el-form-item>
			<el-form-item label="开课结课日期" prop="classTime">
				<el-date-picker
					v-model="dataForm.classTime"
					type="daterange"
					range-separator="至"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					start-placeholder="开课日期"
					end-placeholder="结课日期"
				/>
			</el-form-item>
			<el-form-item label="开始结束时间" prop="lessonTime">
				<el-time-picker
					v-model="dataForm.lessonTime"
					is-range
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="HH:mm"
					format="HH:mm"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, FormRules } from 'element-plus/es'
import { useEnrollClassApi, useEnrollClassSubmitApi } from '@/api/affair/enrollclass'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	classTime: [] as any[],
	lessonTime: [] as any[],
	status: '',
	courseType: '',
	className: '',
	startTime: '',
	endTime: '',
	object: '',
	target: '',
	//deleted: '',
	classDate: '',
	classEnd: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getEnrollClass(id)
	}
}

const getEnrollClass = (id: number) => {
	useEnrollClassApi(id).then(res => {
		Object.assign(dataForm, res.data)
		dataForm.classTime[0] = dataForm.classDate
		dataForm.classTime[1] = dataForm.classEnd
		dataForm.lessonTime[0] = dataForm.startTime
		dataForm.lessonTime[1] = dataForm.endTime
		console.log(dataForm)
	})
}

const dataRules = reactive<FormRules>({
	className: [
		{
			required: true,
			message: '请输入班级名称',
			trigger: 'blur'
		}
	],
	startTime: [
		{
			required: true,
			message: '请输入开始时间',
			trigger: 'blur'
		}
	],
	classTime: [
		{
			required: true,
			message: '该内容不能为空',
			trigger: 'blur'
		}
	],
	lessonTime: [
		{
			required: true,
			message: '该内容不能为空',
			trigger: 'blur'
		}
	],
	endTime: [
		{
			required: true,
			message: '请输入结束时间',
			trigger: 'blur'
		}
	],
	object: [
		{
			required: true,
			message: '请输入面向对象',
			trigger: 'blur'
		}
	],
	target: [
		{
			required: true,
			message: '请输入课程目标',
			trigger: 'blur'
		}
	],
	courseType: [
		{
			required: true,
			message: '请输入课程类型',
			trigger: 'blur'
		}
	],
	classDate: [
		{
			required: true,
			message: '请输入开课日期'
		}
	],
	classEnd: [
		{
			required: true,
			message: '请输入结课日期'
		}
	]
})

// 表单提交
const submitHandle = () => {
	dataForm.classDate = dataForm.classTime[0]
	dataForm.classEnd = dataForm.classTime[1]
	dataForm.startTime = dataForm.lessonTime[0]
	dataForm.endTime = dataForm.lessonTime[1]
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useEnrollClassSubmitApi(dataForm).then(() => {
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
<style scoped></style>
