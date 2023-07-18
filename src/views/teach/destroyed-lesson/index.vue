<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.studentName" placeholder="学生姓名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.type" clearable placeholder="选择记录状态">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.classId" clearable placeholder="班级" @change="getLesson">
					<el-option v-for="item in dataForm.classList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.lessonId" no-data-text="请先选择班级" placeholder="课程">
					<el-option v-for="item in dataForm.lessonList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">
					<svg-icon icon="icon-search"></svg-icon>
					搜索
				</el-button>
				<el-button type="primary" @click="reset()"> 重置 </el-button>
			</el-form-item>
		</el-form>
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="addHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="studentNumber" label="学号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="studentName" label="姓名" header-align="center" align="center"></el-table-column>
			<el-table-column label="班级及课程" header-align="center" align="center">
				<template #default="scope">
					<span>{{ scope.row.className }}的{{ scope.row.lessonName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="签到情况" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-show="scope.row.studentLessonStatus === -1" type="danger">未签到</el-tag>
					<el-tag v-show="scope.row.studentLessonStatus === 0" type="warning">请假</el-tag>
					<el-tag v-show="scope.row.studentLessonStatus === 1" type="success">签到</el-tag>
					<el-tag v-show="scope.row.studentLessonStatus === 2">迟到</el-tag>
				</template>
			</el-table-column>
			<!--      <el-table-column prop="duration" label="时长" header-align="center" align="center">-->
			<!--        <template #default="scope">-->
			<!--          <span>{{ scope.row.duration }}h</span>-->
			<!--        </template>-->
			<!--      </el-table-column>-->
			<!--      <el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>-->
			<el-table-column prop="type" label="类型" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.type === 0">常规课</el-tag>
					<el-tag v-else-if="scope.row.type === 1" type="success">集训课</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.status == 0" type="warning">未销课</el-tag>
					<el-tag v-else-if="scope.row.status == 1" type="success">已销课</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="actualDeduction" label="实际扣时" header-align="center" align="center">
				<template #default="scope">
					<span>{{ scope.row.actualDeduction }}h</span>
				</template>
			</el-table-column>
			<el-table-column prop="direction" label="说明" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.direction === ''">无</span>
					<span v-else>{{ scope.row.direction }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-if="scope.row.status == 0" type="text" @click="destroyedLessonPayHandle(scope.row)">销课 </el-button>
					<el-button v-else-if="scope.row.status == 1" type="text" @click="destroyedLessonPayHandle(scope.row)">详情 </el-button>
				</template>
			</el-table-column>
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
		<!--    新增-->
		<add  ref="addRef" @refreshDataList="getDataList"></add>
		<!-- 消课/详情 -->
		<destroyed-lesson-pay ref="destroyedLessonPayRef" @refreshDataList="getDataList"></destroyed-lesson-pay>
	</el-card>
</template>

<script setup lang="ts" name="TeachDestroyedLessonRecordIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import DestroyedLessonPay from './destroyed-lesson-pay.vue'
import Add from './add.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl } from '@/api/teach/teachdestroyedlessonrecord.ts'
import {useOpenClassesApi, useOpenClassesWithOrgApi} from '@/api/teach/class'
import { useLessonByIdApi } from '@/api/lessons/lesson'
import {useUserInfoApi} from "@/api/sys/user";

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		studentName: '',
		type: null,
		classId: '',
		lessonId: '',
    orgId: ''
	}
})
const orgId = ref()
const getUserOrgId = async () =>{
  const {data:data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  orgId.value = data.orgId
  getDataList()
  getClass(data.orgId)
}
// const getUserOrgId1 = () =>{
//   useUserInfoApi().then(res=>{
//   state.queryForm.orgId = res.data.orgId
//   console.log(state.queryForm.orgId)
// })
// }

const reset = () => {
	state.queryForm.classId = ''
	state.queryForm.lessonId = ''
	state.queryForm.studentName = ''
	state.queryForm.type = null
	dataForm.lessonList = []
	getDataList()
}

const options = ref([
	{
		value: 0,
		label: '未销课'
	},
	{
		value: 1,
		label: '已销课'
	}
])

const dataForm = reactive({
	classList: [],
	lessonList: []
})
const getClass = (id:number) => {
  if (id==null){
    id = 0
  }
	useOpenClassesWithOrgApi(id).then(res => {
		dataForm.classList = res.data
	})
}
const getLesson = (id: any) => {
  dataForm.lessonList = []
  state.queryForm.lessonId = ''
	useLessonByIdApi(id).then(res => {
		dataForm.lessonList = res.data
	})
}
const destroyedLessonPayRef = ref()
const destroyedLessonPayHandle = (item?: any) => {
	destroyedLessonPayRef.value.init(item)
}
const addRef = ref()
const addHandle = () => {
	addRef.value.init(orgId.value)
}
onMounted(() => {
  getUserOrgId()
})
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
