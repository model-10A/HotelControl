<template>
	<el-card>
		<el-button-group>
			<el-button size="large" :type="buttonFlag === 1 ? 'primary' : ''" :icon="EditPen" @click="buttonFlag = 1">课后作业</el-button>
			<el-button size="large" :type="buttonFlag === 2 ? 'primary' : ''" :icon="Bell" @click="buttonFlag = 2">未完成的课堂习题 </el-button>
		</el-button-group>
		<br />
		<el-divider />

		<div v-if="buttonFlag === 1">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" placeholder="名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="state.queryForm.classId" class="m-2" placeholder="班级" clearable>
						<el-option v-for="item in classDataForm.classList" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table
				v-loading="state.dataListLoading"
				:data="state.dataList"
				style="width: 100%"
				:row-key="getRowKeys"
				:expand-row-keys="expands"
				@expand-change="expandSelect"
			>
				<el-table-column type="expand" label="展开" width="80">
					<template #default="props">
						<div>
							<h3>课后作业</h3>
							<br />
							<el-table
								style="width: 90%; margin: auto"
								max-height="400"
								:data="
									children.problemList.filter(item => {
										return item.used === 1
									})
								"
								border
							>
								<el-table-column prop="problemName" show-overflow-tooltip label="题目名称">
									<template #default="scope"> {{ scope.row.problemId }}、{{ scope.row.problemName }} </template>
								</el-table-column>
								<fast-table-column
									prop="problemType"
									label="题目类型"
									dict-type="problem_type"
									header-align="center"
									align="center"
								></fast-table-column>

								<el-table-column label="状态" header-align="center" align="center" width="150">
									<template #default="scope">
										<el-tag :type="hasFinish(scope.row).type"> {{ hasFinish(scope.row).value }}</el-tag>
									</template>
								</el-table-column>
								<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
									<template #default="scope">
										<el-button
											v-show="ifAnswer(scope.row)"
											type="text"
											size="small"
											@click="answerHandle(scope.row.problemId, scope.row.problemType, scope.row.type, scope.row.lessonId)"
											>答题</el-button
										>
										<span v-show="!ifAnswer(scope.row)" type="text" size="small">已截止</span>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="作业名称" header-align="center" align="center" show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.className }}班 {{ scope.row.name }}作业 </template>
				</el-table-column>
				<el-table-column prop="homeworkBeginTime" label="作业时间" header-align="center" align="center" width="300px">
					<template #default="scope"> {{ scope.row.homeworkEndTime.substring(0, 16) }}-{{ scope.row.homeworkEndTime.substring(5, 16) }} </template>
				</el-table-column>
				<el-table-column prop="homeworkStatus" label="作业状态" header-align="center" align="center">
					<template #default="scope">
						<el-tag v-if="scope.row.homeworkStatus === 1" type="success">进行中</el-tag>
						<el-tag v-if="scope.row.homeworkStatus === 2" type="info">已结束</el-tag>
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
		</div>

		<div v-else>
			<el-form>
				<el-form-item>
					<el-button type="primary" @click="useCrud(unfinishedProblem).getDataList()"><svg-icon icon="icon-search"></svg-icon>刷新</el-button>
				</el-form-item>
			</el-form>

			<el-table v-loading="unfinishedProblem.dataListLoading" :data="unfinishedProblem.dataList" border style="width: 100%">
				<el-table-column label="课堂名称" prop="lessonName" show-overflow-tooltip header-align="center" align="center" width="120"> </el-table-column>
				<el-table-column prop="problemName" show-overflow-tooltip label="题目名称">
					<template #default="scope"> {{ scope.row.problemId }}、 {{ scope.row.problemName }} </template>
				</el-table-column>
				<fast-table-column
					prop="problemType"
					label="题目类型"
					dict-type="problem_type"
					header-align="center"
					align="center"
					width="100"
				></fast-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button type="text" size="small" @click="answerHandle(scope.row.problemId, scope.row.problemType, 1, scope.row.lessonId)"
							>答题</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="unfinishedProblem.page"
				:page-sizes="unfinishedProblem.pageSizes"
				:page-size="unfinishedProblem.limit"
				:total="unfinishedProblem.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="useCrud(unfinishedProblem).sizeChangeHandle"
				@current-change="useCrud(unfinishedProblem).currentChangeHandle"
			>
			</el-pagination>
		</div>
	</el-card>

	<answer-problem ref="answerProblemRef"></answer-problem>
</template>

<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataHomeworkPageUrl } from '@/api/lessons/lesson'
import { useCrud } from '@/hooks'
import { useStudentClassListApi } from '@/api/teach/class'
import moment from 'moment'
import AnswerProblem from '@/views/classroom/lesson/student/lesson-problem/answer-problem.vue'
import { unfinishedProblemUrl, useLessonHomeworkApi } from '@/api/lessons/problem'
import { useProblemFinishApi } from '@/api/judge/lessonRecord'
import { EditPen, Bell } from '@element-plus/icons-vue'

const state: IHooksOptions = reactive({
	dataListUrl: dataHomeworkPageUrl,
	queryForm: {
		classId: '',
		name: '',
		role: 2
	}
})
const buttonFlag = ref(1)

const unfinishedProblem: IHooksOptions = reactive({
	dataListUrl: unfinishedProblemUrl,
	queryForm: {},
	createdIsNeed: false
})
useCrud(unfinishedProblem).getDataList()

const children = reactive({
	problemList: [],
	finishList: [
		{
			problemId: 0,
			problemType: 0,
			submitStatus: 0
		}
	]
})
const tag = [
	{ type: 'primary', value: '已交' },
	{ type: 'info', value: '未答' },
	{ type: 'info', value: '未答' },
	{ type: 'success', value: '正确' },
	{ type: 'danger', value: '错误' }
]
const hasFinish = (row: any) => {
	if (children.finishList.length === 0) {
		return tag[1]
	}
	for (let i = 0; i < children.finishList.length; i++) {
		if (row.problemId === children.finishList[i].problemId && row.problemType === children.finishList[i].problemType) {
			return tag[children.finishList[i].submitStatus]
		}
	}
	return tag[1]
}
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
			useProblemFinishApi({ lessonId: row.id, type: 2 })
				.then(res => {
					children.finishList = res.data
				})
				.finally(() => {
					useLessonHomeworkApi(row.id).then(res => {
						children.problemList = res.data
					})
				})
		} else {
			expands.value = []
		}
	}
}

const classDataForm = reactive({
	status: 2,
	classList: [
		{
			id: '',
			name: '',
			endTime: '',
			teacher1Name: '',
			teacher2Name: '',
			nextLesson: '',
			frequency: '',
			lessonName: '',
			lessonStartTime: '',
			lessonFinishTime: '',
			lessonStatus: 0,
			lessonPlace: ''
		}
	]
})
const getClassList = () => {
	useStudentClassListApi(classDataForm.status).then(res => {
		classDataForm.classList = res.data
	})
}
getClassList()
const answerProblemRef = ref()
const answerHandle = (problemId: any, problemType: any, type: any, lessonId: any) => {
	answerProblemRef.value.initProblem(problemId, problemType, type, lessonId)
}

const ifAnswer = (row: any) => {
	let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	if (now >= homeworkBeginTime && now <= homeworkEndTime) {
		return true
	}
	return false
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped></style>
