<template>
	<div>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle()">
			<el-form-item label="班级名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
			</el-form-item>
			<el-form-item label="班级介绍" prop="description">
				<el-input v-model="dataForm.description" placeholder="班级介绍"></el-input>
			</el-form-item>
			<el-form-item label="班级封面" prop="img">
				<fast-upload-img v-model="dataForm.img" img-width="200px"></fast-upload-img>
			</el-form-item>
			<el-form-item label="上课时间" prop="lessonTime">
				<el-time-picker
					v-model="dataForm.lessonTime"
					is-range
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					value-format="HH:mm:ss"
				/>
			</el-form-item>
			<el-form-item label="课时单价" prop="lessonPrice">
				<el-input v-model="dataForm.lessonPrice" placeholder="课时单价"></el-input>
			</el-form-item>
			<el-form-item label="上课地点" prop="frequency">
				<el-input v-model="dataForm.place" placeholder="上课地点"></el-input>
			</el-form-item>
			<el-form-item label="周频" prop="frequency">
				<el-input-number v-model="dataForm.frequency" placeholder="周频(0-7)" :precision="0" :step="1" min="0" max="7" />
			</el-form-item>

			<el-form-item label="班级开始时间" prop="beginTime">
				<el-date-picker v-model="dataForm.beginTime" placeholder="班级开始时间" value-format="YYYY-MM-DD" @change="beginTimeChangeHandle" />
			</el-form-item>
			<el-form-item label="班级结束时间" prop="endTime">
				<el-date-picker v-model="dataForm.endTime" placeholder="班级结束时间" value-format="YYYY-MM-DD" />
			</el-form-item>
			<el-form-item label="班主任" prop="teacher1Id">
				<el-select v-model="valueTeacher1" class="m-2" placeholder="选择班主任" size="large" @change="selectChange1(valueTeacher1)">
					<el-option v-for="(item, index) in options" :key="index" :label="item.realName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="任课老师" prop="teacher2Id">
				<el-select v-model="valueTeacher2" class="m-2" placeholder="选择班主任" size="large" @change="selectChange2(valueTeacher2)">
					<el-option v-for="(item, index) in teachers" :key="index" :label="item.realName" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="是否发布" prop="teacher2Id">
				<el-switch v-model="value1" />
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import FastUploadImg from '@/components/fast-upload-img/fast-upload-img.vue'
import { onMounted, reactive, ref } from 'vue'
import { useTeachClassSubmitApi } from '@/api/teach/class'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useSelectTeacherApi } from '@/api/teach/teacher'
import { DatetimeFormat } from 'vue-i18n'
import moment from 'moment'

const visible = ref(false)
const valueTeacher1 = ref('')
const valueTeacher2 = ref('')
const dataFormRef = ref()
const userIdList = ref()
const value1 = ref(true)

const options: any[] = []
const teachers: any[] = []

onMounted(() => {
	selectTeacher1()
	selectTeacher2()
})

const selectTeacher1 = () => {
	useSelectTeacherApi().then(res => {
		Object.assign(options, res.data)
		console.log(res.data)
	})
}
const selectChange1 = (valueTeacher1: any) => {
	console.log(valueTeacher1)
	dataForm.teacher1Id = valueTeacher1
}
const selectTeacher2 = () => {
	useSelectTeacherApi().then(res => {
		Object.assign(teachers, res.data)
		console.log(res.data)
	})
}
const selectChange2 = (valueTeacher2: any) => {
	console.log(valueTeacher2)
	dataForm.teacher2Id = valueTeacher2
}
const dataForm = reactive({
	id: '',
	name: '',
	description: '',
	img: '',
	planId: '',
	lessonNum: '',
	lessonTime: '',
	classTime: '',
	lessonPrice: '',
	frequency: '',
	lessonBeginTime: '',
	lessonEndTime: '',
	status: 0,
	beginTime: '',
	endTime: '',
	teacher1Id: '',
	teacher2Id: '',
	nextLesson: '',
	createTime: '',
	updateTime: '',
	deleted: '',
	updater: '',
	creator: '',
	version: '',
	userIdList: []
})

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	lessonTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	// img: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	planId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	lessonNum: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	lessonPrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	beginTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	frequency: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	teacher1Id: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	teacher2Id: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const change = (planId: any, lessonNum: any, userList: any) => {
	dataForm.planId = planId
	dataForm.lessonNum = lessonNum
	dataForm.userIdList = userList
	console.log(lessonNum)
	console.log(dataForm.frequency)
}
const beginTimeChangeHandle = () => {
	let addtime = parseInt(dataForm.lessonNum) * parseInt(dataForm.frequency)
	let be = dataForm.beginTime
	// const date = new Date(be)
	dataForm.endTime = dateChange(addtime, be)
	console.log('开始时间', be)
	console.log('结束时间', dataForm.endTime)
}
const dateChange = (num: number, date: string) => {
	date += ' 00:00:00' //设置为当天凌晨12点
	let dateTep = Date.parse(date) / 1000 //转换为时间戳
	dateTep += 86400 * num //修改后的时间戳
	var newDate = new Date(dateTep * 1000) //转换为时间
	return moment(newDate).format('YYYY-MM-DD')
}
const router = useRouter()
const goto = () => {
	router.push({
		path: '/teachClass'
	})
}
const submitHandle = () => {
	dataForm.lessonBeginTime = dataForm.lessonTime[0]
	dataForm.lessonEndTime = dataForm.lessonTime[1]
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (value1.value == true) {
			dataForm.status = 1
		} else {
			dataForm.status = 0
		}
		useTeachClassSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					goto()
				}
			})
		})
	})
}

defineExpose({
	change,
	submitHandle
})
</script>
