<template>
	<div>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle()">
			<el-form-item label="课程名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
			</el-form-item>
			<el-form-item label="开课时间" prop="beginTime">
				<el-date-picker
					v-model="dataForm.beginTime"
					format="YYYY-MM-DD HH:mm"
					placeholder="请选择开课时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm"
				/>
			</el-form-item>
			<el-form-item label="结课时间" prop="endTime">
				<el-date-picker
					v-model="dataForm.endTime"
					format="YYYY-MM-DD HH:mm"
					placeholder="请选择结课时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm"
				/>
			</el-form-item>
			<el-form-item label="上课地点" prop="place">
				<el-input v-model="dataForm.place" placeholder="上课地点"></el-input>
			</el-form-item>
			<el-form-item label="任课老师" prop="value">
				<!--				<el-input v-model="dataForm.teacherId" placeholder="请输入任课老师ID"></el-input>-->
				<el-select v-model="value" placeholder="选择任课老师" @change="selectChange(value)">
					<el-option v-for="(item, index) in options" :key="index" :label="item.realName" :value="item.id"> </el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useSelectTeacherApi } from '@/api/teach/teacher'
import { useEnrollLessonSelectApi, useEnrollLessonSubmitApi } from '@/api/affair/enrollLesson'
const visible = ref(false)
const dataFormRef = ref()
const value = ref('')
const options: any[] = []

onMounted(() => {
	selectTeacher()
})
const getSelect = () => {
	useEnrollLessonSelectApi().then(res => {
		Object.assign(options, res.data)
	})
}
const selectTeacher = () => {
	useSelectTeacherApi().then(res => {
		console.log('老师')
		console.log(res.data)
		Object.assign(options, res.data)
		console.log(res.data)
	})
}

const selectChange = (value: any) => {
	console.log(value)
	dataForm.teacherId = value
}

const dataForm = reactive({
	id: '',
	teacherId: '',
	planItemId: '',
	realName: '',
	name: '',
	status: 0,
	place: '',
	beginTime: '',
	endTime: ''
})

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	beginTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	place: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	value: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const change = (planId: any) => {
	dataForm.planItemId = planId
	// submitHandle()
	return dataForm
}
const router = useRouter()
const goto = () => {
	router.push({
		path: '/auditor-affair/addExam.vue'
	})
}

defineExpose({
	change
})
</script>
