<template>
	<el-dialog v-model="visible" title="退班" :close-on-click-modal="false" draggable width="80%">
		<!-- <h3>请选择要退出的班级</h3> -->
		<!-- 展示自己加入的班级 -->
		<el-table
			:data="studentData"
			style="width: 100%"
			stripe
			border
			ref="oldTableRef"
			@select="handleOldChange"
		>
				<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="name" label="班级名称" header-align="center" align="center" width="150"></el-table-column>
				<el-table-column prop="description" label="班级介绍" header-align="center" align="center" ></el-table-column>
				<el-table-column prop="planName" label="引用教学计划" header-align="center" align="center" width="150"></el-table-column>
				<el-table-column prop="lessonBeginTime,lessonEndTime" label="上课时间范围" header-align="center" align="center" width="150">
					<template #default="scope"> {{ scope.row.lessonBeginTime }}-{{ scope.row.lessonEndTime }} </template>
				</el-table-column>
				<el-table-column prop="frequency" label="周频" header-align="center" align="center" width="100"></el-table-column>
				<el-table-column prop="status" label="班级状态" header-align="center" align="center" width="130">
					<template #default="scope">
					<el-tag v-if="scope.row.status == 0" type="danger">未发布</el-tag>
					<el-tag v-else-if="scope.row.status == 1" type="danger">未开班</el-tag>
					<el-tag v-else-if="scope.row.status == 2" type="success">开班中</el-tag>
					<el-tag v-else type="danger">结班</el-tag>
				</template>
				</el-table-column>
				<el-table-column prop="beginTime,endTime" label="班级预计时间范围" header-align="center" align="center" width="200">
					<template #default="scope"> {{ scope.row.beginTime }}~{{ scope.row.endTime }} </template>
				</el-table-column>
				<el-table-column prop="teacher1Name" label="班主任" header-align="center" align="center" width="100"></el-table-column>
				<el-table-column prop="teacher2Name" label="任课老师" header-align="center" align="center" width="100"></el-table-column>
		</el-table>

		<template #footer>
			<el-button  @click="visible = false" type="primary">取消</el-button>
			<el-button @click="submitHandle()" type="primary">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import moment from "moment"
import {useTeachClassQuitApi, useTeachClassRecordApi} from '@/api/teach/classuser'
import {useLessonByIdApi} from '@/api/lessons/lesson'
import { useDeleteLessonStudentApi} from '@/api/lessons/attendlog'
import {useTeachClassOldByUserId} from '@/api/teach/class'
import { number } from 'echarts'
import {outClassAddClassHoursSubmitApi} from "@/api/teach/student";
//控制对话框的隐藏
const visible = ref(false)
const emit = defineEmits(['refreshDataList'])
const state: IHooksOptions = reactive({})
let date = new Date().toLocaleDateString();
let time = new Date(date)
let Time = moment(time).format('YYYY-MM-DD hh:mm:ss');
//保存将要退出的班级
let studentData = reactive([])

//保存旧班级id
const oldRow = ref()
let oldLessonStudentForm = reactive({
	classId:[],
	stuId:number
})
const oldTableRef = ref()
const handleOldChange = async (val: any) => {
	if (val.length > 1) {
		let del_row = val.shift()
		oldTableRef.value.toggleRowSelection(del_row, false)
	}
	if (val[0] == undefined) {
		oldRow.value = NaN
	} else {
		oldRow.value = val[0].id
	}
//获取剩余课时数
	const classData = await useLessonByIdApi(oldRow.value)
	console.log("旧班级剩余课",classData)
	//数组清零
	oldLessonStudentForm.classId.length = 0
	classData.data.forEach((element:any) => {
		//将剩余的课程id加入数组
		oldLessonStudentForm.classId.push(element.id)
	})
	console.log("旧班级",oldLessonStudentForm)
}

//保存当前学生的id
let Tid = 0


// 表单提交
const submitHandle = async () => {
	if (oldRow.value === null) {
		ElMessage({
			type: 'warning',
			message: '请选择要退出的班级'
		})
		return
	}
  console.log('退出的班级id为', oldRow.value)
  console.log('待退出的学生id为', Tid)
	//class_user表
	const classUserData = {
    quiteClassId:oldRow.value,
		userId:Tid,
		quitTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
    quiteLessonList:oldLessonStudentForm.classId,
    type:3,
	}
	await useTeachClassQuitApi(classUserData)
	ElMessage.success({
		message:'退班成功',
		duration:500,
		onClose:() => {
				visible.value = false
        emit('refreshDataList')
			}
	})
}


const getStudentData = (id: number) =>{
	useTeachClassOldByUserId(id).then((res)=>{
		Object.assign(studentData, res.data)
		if(studentData.length === 0){
			ElMessage.warning({
				message:'您没有在上的班级，请先加入班级',
				duration:500,
			})
			visible.value = false
		}
		else visible.value = true
	})
}
//初始化
const init = (id: number) => {
	studentData.length = 0
	getStudentData(id)
	oldRow.value = null
	Tid = id
	oldLessonStudentForm.stuId = id
}
defineExpose({
	init
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
<style scoped lang="scss">
    :deep() {
    .el-table__header-wrapper .el-checkbox {
      display: none;
    }
  }
 
</style>
 
