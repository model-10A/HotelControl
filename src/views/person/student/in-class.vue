<template>
	<el-dialog v-model="visible" title="插班" :close-on-click-modal="false" draggable width="80%">
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
			<el-table
				ref="singleTableRef"
				v-loading="state.dataListLoading"
				:data="state.dataList"
				border
				@selection-change="handleCurrentChange"
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


		<template #footer>
			<el-button  @click="visible = false" type="primary">取消</el-button>
			<el-button  @click="submitHandle()" type="primary">确定</el-button>
		</template>

    <in-class-lesson ref="inClassLessonRef" @close="close"></in-class-lesson>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import {useTeachClassUserSubmitApi} from '@/api/teach/classuser'
import {useTeachPaySubmitApi} from '@/api/teach/teachpay'
import moment from 'moment'
import { ElTable } from 'element-plus'
import {useTeachClassApi} from '@/api/teach/class'
import {inClassDateListUrl} from '@/api/teach/student'
import {useLessonByIdApi} from '@/api/lessons/lesson'
import {useLessonStudentApi} from '@/api/lessons/attendlog'
import InClassLesson from './dialog/in-class-lesson.vue'
import { number } from 'echarts'
const emit = defineEmits(['refreshDataList'])
const state: IHooksOptions = reactive({
	dataListUrl: inClassDateListUrl,
	queryForm: {
    userId:'',
		name: '',
		planName: '',
		teacher2Name: ''
	}
})
const inClassLessonRef = ref()
const visible = ref(false)
const currentRow = ref()
let LessonStudentForm = reactive({
	classId:[],
	stuId:number
})
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
	console.log(currentRow.value)
}
const singleTableRef = ref()
//保存当前学生的id
let Tid = ref(0)
const init = (id: number) => {
  state.queryForm.userId=id
  getStudentData(id)
	visible.value = true
	Tid.value = id
	LessonStudentForm.stuId = id
  currentRow.value=null
}

//第三步

//保存自身的班级
const studentData = reactive([])
const getStudentData = async (id: number) =>{
  getDataList()
}

const close = () => {
  visible.value=false
  emit('refreshDataList')
}

// 表单提交
const submitHandle = async () => {
	console.log('插入的班级id为', currentRow.value)

	console.log('待加入的学生id为', Tid.value)

	let Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	console.log("加入时间",Time)
	//class_user表
	const classUserData = {
		classId:currentRow.value,
		userId:Tid.value,
		paymentAmount:0,
		joinTime:Time
	}
  inClassLessonRef.value.init(currentRow.value,classUserData,Tid)
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
