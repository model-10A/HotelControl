<template>
	<el-dialog v-model="visible" title="换班" :close-on-click-modal="false" draggable width="80%">
		<el-steps :active="active" align-center finish-status="success" style="margin: 20px 0 40px 0">
			<el-step title="选择将要退出的班级"></el-step>
			<el-step title="选择想要加入的班级"></el-step>
<!--      <el-step title="确认退出班级和加入班级"></el-step>-->
		</el-steps>

		<!-- 展示自己加入的班级 -->
		<el-table
			v-show="active === 0"
			:data="studentData"
			height="250"
			style="width: 100%"
			stripe
			border
			:header-cell-style="cellStyle"
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
		<!-- 选择加入的班级 -->
		<div v-show="active === 1">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" placeholder="班级名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="state.queryForm.planName" placeholder="引用教学计划" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="state.queryForm.teacher2Name" placeholder="任课老师" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList()">查询</el-button>
				</el-form-item>
			</el-form>
			<!-- 展示所有班级 -->
			<el-table
				ref="singleTableRef"
				v-loading="state.dataListLoading"
				:data="state.dataList"
				border
				style="width: 100%; margin-top: 15px"
				@select="handleCurrentChange"
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
			<el-pagination
				:current-page="state.page"
				:page-sizes="state.pageSizes"
				:page-size="state.limit"
				:total="state.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
		</div>
<!--    <div v-show="active === 2">-->
<!--      <el-alert :closable="false" style="margin-bottom: 25px" type="info">-->
<!--        <h1 slot="title" style="color: #242424">即将退出的班级</h1>-->
<!--      </el-alert>-->
<!--      -->
<!--      <el-alert :closable="false" style="margin-bottom: 25px" type="info">-->
<!--        <h1 slot="title" style="color: #242424">即将加入的班级</h1>-->
<!--      </el-alert>-->
<!--      -->
<!--    </div>-->
		<template #footer>
			<el-button v-show="active === 0" @click="visible = false" type="primary">取消</el-button>
			<el-button v-show="active > 0" type="primary" @click="previous()">上一步</el-button>
			<el-button v-show="active < 1" type="primary" @click="next()">下一步</el-button>
			<el-button v-show="active === 1" @click="submitHandle()" type="primary">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useUserApi, useUserSubmitApi } from '@/api/sys/user'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { type } from 'os'
import moment from 'moment'
import {
  useTeachClassUserSubmitApi,
  useTeachClassQuitApi,
  useTeachClassRecordApi,
  useTeachClassChangeApi
} from '@/api/teach/classuser'
import {useTeachPaySubmitApi} from '@/api/teach/teachpay'
import { Warning } from '@element-plus/icons-vue'
import {useLessonByIdApi} from '@/api/lessons/lesson'
import {useLessonStudentApi , useDeleteLessonStudentApi} from '@/api/lessons/attendlog'
import {useTeachClassOldByUserId,useTeachClassApi} from '@/api/teach/class'
import {inClassDateListUrl, joinClassAddClassHoursSubmitApi, outClassAddClassHoursSubmitApi} from '@/api/teach/student'
import { number } from 'echarts'
//控制对话框的隐藏
const visible = ref(false)
const emit = defineEmits(['refreshDataList'])
const state: IHooksOptions = reactive({
	dataListUrl: inClassDateListUrl,
	queryForm: {
    userId:'',
		name: '',
		planName: '',
		teacher2Name: ''
	},

})

let Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

//当前步数
let active = ref(0)
//下一步
const next = () => {
	if (active.value < 2) {
		active.value++
	}
}
//上一步
const previous = () => {
	if (active.value > 0) {
		active.value--
	}
}
//保存将要退出的班级
const studentData = reactive([])

const dataFormRef = ref()
//新班级body
let LessonStudentForm = reactive({
	classId:[],
	stuId:number
})
//旧班级body
let oldLessonStudentForm = reactive({
	classId:[],
	stuId:number
})
//保存新班级id
const currentRow = ref()
const singleTableRef = ref()
const handleCurrentChange = async (val: any) => {
	if (val.length > 1) {
		let del_row = val.shift()
		singleTableRef.value.toggleRowSelection(del_row, false)
	}
	if (val[0] == undefined) {
		currentRow.value = NaN
	} else {
		currentRow.value = val[0].id
	}
	//获取剩余课时数
	const classData = await useLessonByIdApi(currentRow.value)
	console.log("新班级剩余课时",classData)
	//数组清零
	LessonStudentForm.classId.length = 0
	classData.data.forEach(element => {
		//将剩余的课程id加入数组
		LessonStudentForm.classId.push(element.id)
  })

}
//保存旧班级id
const oldRow = ref()
const oldTableRef = ref()
const handleOldChange =async (val: any) => {
	if (val.length > 1) {
		let del_row = val.shift()
		oldTableRef.value.toggleRowSelection(del_row, false)
	}
	if (val[0] == undefined) {
		oldRow.value = null
	} else {
		oldRow.value = val[0].id
	}
	//获取剩余课时数
	const classData = await useLessonByIdApi(oldRow.value)
	console.log("旧班级剩余课",classData)
	//数组清零
	oldLessonStudentForm.classId.length = 0
	classData.data.forEach(element => {
		//将剩余的课程id加入数组
		oldLessonStudentForm.classId.push(element.id)
  })

	console.log("旧班级",oldLessonStudentForm)
}

//保存当前学生的id
let Tid = ref(0)


// 表单提交
const submitHandle = async () => {
	if (currentRow.value === null) {
		ElMessage({
			type: 'warning',
			message: '请选择要加入的班级'
		})
		return
	}
	if (oldRow.value === null) {
		ElMessage({
			type: 'warning',
			message: '请选择要退出的班级'
		})
		return
	}
	console.log('退出的班级id为', oldRow.value)
	console.log('插入的班级id为', currentRow.value)
	console.log('待加入的学生id为', Tid.value)

	let Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	console.log("加入时间",Time)
	//换班信息
	const classData = {
		quiteClassId:oldRow.value,
    joinClassId:currentRow.value,
		userId:Tid.value,
		quitTime:Time,
    joinTime:Time,
    quiteLessonList: oldLessonStudentForm.classId,
    joinLessonList: LessonStudentForm.classId,
    type:2,
	}
  console.log(classData)
  await useTeachClassChangeApi(classData)
	ElMessage.success({
			message: '换班成功',
			duration:500,
			onClose:  () => {
				visible.value = false
        emit('refreshDataList')
			}
		})

}

const getStudentData = async (id: number) =>{
	await useTeachClassOldByUserId(id).then((res)=>{
		Object.assign(studentData, res.data)
		if(studentData.length === 0){
			ElMessage.warning({
				message:'您没有在上的班级,请先加入班级',
				duration:500,
			})
			visible.value = false
		}
		else visible.value = true
	})
  getDataList()
}

//初始化
const init = (id: number) => {
  state.queryForm.userId=id
	studentData.length = 0
	getStudentData(id)
	Tid.value = id
	active.value = 0
	LessonStudentForm.stuId = id
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
