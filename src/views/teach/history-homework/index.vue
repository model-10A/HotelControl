<template>
	<el-card>
		<el-form :inline="true" :model="homeworkState.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="homeworkState.queryForm.name" clearable placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="homeworkState.queryForm.classId" class="m-2" clearable placeholder="班级">
					<el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="homeworkState.dataListLoading"
			:data="homeworkState.dataList"
			:expand-row-keys="expands"
			:row-key="getRowKeys"
			style="width: 100%"
			@expand-change="expandSelect"
		>
			<el-table-column align="center" header-align="center" label="作业名称" width="350">
				<template #default="scope"> {{ scope.row.className }}班 {{ scope.row.name }}作业 </template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="任课老师" prop="teacherName"></el-table-column>
			<el-table-column align="center" header-align="center" label="上课地点" prop="place"></el-table-column>
			<el-table-column align="center" header-align="center" label="作业开始时间" prop="homeworkBeginTime" width="180"></el-table-column>
			<el-table-column align="center" header-align="center" label="作业结束时间" prop="homeworkEndTime" width="180"></el-table-column>
			<el-table-column align="center" header-align="center" label="作业状态" prop="homeworkStatus">
				<template #default="scope">
					<el-tag v-if="scope.row.homeworkStatus === 1" type="success">进行中</el-tag>
					<el-tag v-if="scope.row.homeworkStatus === 2" type="info">已结束</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="操作">
				<template #default="scope">
					<el-button type="text" @click="gotoLesson(scope.row.id)">进入</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="homeworkState.page"
			:page-size="homeworkState.limit"
			:page-sizes="homeworkState.pageSizes"
			:total="homeworkState.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<answer-problem ref="answerProblemRef"></answer-problem>
	</el-card>
</template>

<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataHistoryHomeworkPageUrl } from '@/api/lessons/lesson'
import { useCrud } from '@/hooks'
import { useOpenClassesApi, useTeacherClassListApi } from '@/api/teach/class'
import StuLineChart from '@/views/classroom/lesson/teacher/evaluation/stu-line-chart.vue'
import AnswerProblem from '@/views/classroom/lesson/student/lesson-problem/answer-problem.vue'

import { getLessonProblemRank } from '@/api/judge/lessonRecord'
import { router } from '@/router'

const stuLineChartRef = ref()
const homeworkState: IHooksOptions = reactive({
	dataListUrl: dataHistoryHomeworkPageUrl,
	queryForm: {
		classId: '',
		name: ''
	}
})
const state = reactive({
	tableHead: [
		{
			index: null,
			label: '姓名',
			property: 'name'
		}
	],
	tableData: [
		{
			userId: 0,
			name: '张三',
			lessonId: 0,
			problemRecords: [
				{
					recordId: 326,
					spendTime: null,
					submitStatus: 4,
					problemId: 16,
					problemType: 1,
					problemName: '测试啊',
					type: 1,
					submitTime: '',
					beginTime: null
				}
			]
		}
	]
})

const query = reactive({
	lessonId: 0,
	type: 2
})

const gotoLesson = (id: any) => {
	router.push({ path: '/classroom/homework/teacher/homework-problem/' + id })
}

const children = reactive({
	problemList: [],
	finishList: []
})

const expands = ref()
const getRowKeys = (row: any) => {
	return row.id
}
let homeworkEndTime: any
let homeworkBeginTime: any
const expandSelect = (row: any, expandedRows: any) => {
	if (expandedRows.length) {
		expands.value = []
		if (row) {
			children.finishList.length = 0
			expands.value.push(row.id)
			homeworkEndTime = row.homeworkEndTime
			homeworkBeginTime = row.homeworkBeginTime

			getLessonProblemRank(row.id, 2)
				.then(res => {
					stuLineChartRef.value.setOptionData(res.data)
				})
				.finally(() => {})
		} else {
			expands.value = []
		}
	}
}

const classList = ref([] as any)
const getClassList = () => {
	useOpenClassesApi().then(res => {
		classList.value = res.data
	})
}
getClassList()

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(homeworkState)
</script>

<style scoped></style>
