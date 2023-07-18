<template>
	<div>
		<div>
			<el-button type="primary" style="margin-left: 10px" @click="refresh()">刷新</el-button>
		</div>
		<br />
		<el-table
			v-loading="state.dataListLoading"
			max-height="700"
			:data="
				state.dataList.filter(item => {
					return item.used === 1
				})
			"
			border
			style="width: 100%"
		>
			<el-table-column label="问题编号" prop="problemId" header-align="center" align="center" width="100"> </el-table-column>
			<el-table-column prop="problemName" show-overflow-tooltip label="问题名称" header-align="center" align="center"></el-table-column>
			<fast-table-column
				prop="problemType"
				label="问题类型"
				dict-type="problem_type"
				header-align="center"
				align="center"
				width="100"
			></fast-table-column>
			<fast-table-column
				prop="type"
				label="练习类型"
				dict-type="teachItem-paperType"
				header-align="center"
				align="center"
				width="100"
			></fast-table-column>
			<!--			<el-table-column prop="score" label="分数" header-align="center" align="center"></el-table-column>-->
			<el-table-column v-if="state.queryForm.type === 1" prop="beginTime" label="开始时间" header-align="center" align="center"></el-table-column>
			<el-table-column v-if="state.queryForm.type === 1" prop="endTime" label="结束时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="状态" header-align="center" align="center" width="100">
				<template #default="scope">
					<el-tag :type="hasFinish(scope.row).type"> {{ hasFinish(scope.row).value }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-show="ifAnswer(scope.row)" type="text" size="small" @click="answerHandle(scope.row)">答题</el-button>

					<el-tag v-show="!ifAnswer(scope.row)" class="ml-2" type="danger" size="small">未开放</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<answer-problem ref="answerProblemRef"></answer-problem>
	</div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref, toRef } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl } from '@/api/lessons/problem'
import moment from 'moment'
import AnswerProblem from '@/views/classroom/lesson/student/lesson-problem/answer-problem.vue'
import { useProblemFinishApi } from '@/api/judge/lessonRecord'
const props = defineProps({
	modelValue: {
		type: String,
		required: true
	}
})
const lessonId = ref(props.modelValue)

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		lessonId: lessonId.value,
		type: ''
	},
	isPage: false,
	createdIsNeed: false,
	finishList: []
})

const beginTime = ref()
const init = (time: string) => {
	beginTime.value = time
	refresh()
}
const setType = () => {
	let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	if (now < beginTime.value) {
		state.queryForm.type = 0
	} else {
		state.queryForm.type = 1
	}
}

const refresh = async () => {
	setType()
	getProblemFinishList()
}
const getProblemFinishList = () => {
	useProblemFinishApi(state.queryForm)
		.then(res => {
			state.finishList = res.data
		})
		.finally(() => {
			getDataList()
		})
}
const tag = [
	{ type: 'primary', value: '已交' },
	{ type: 'info', value: '未答' },
	{ type: 'info', value: '未答' },
	{ type: 'success', value: '正确' },
	{ type: 'danger', value: '错误' }
]
const hasFinish = (row: any) => {
	if (state.finishList.length === 0) {
		return tag[1]
	}
	for (let i = 0; i < state.finishList.length; i++) {
		if (row.problemId === state.finishList[i].problemId && row.problemType === state.finishList[i].problemType) {
			return tag[state.finishList[i].submitStatus]
		}
	}
	return tag[1]
}
const ifAnswer = (row: any) => {
	let beginTime = row.beginTime
	let endTime = row.endTime
	let type = row.type
	if (type != 1) {
		return true
	}
	let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	if (now >= beginTime && now <= endTime) {
		return true
	}
	return false
}
const answerProblemRef = ref()
const answerHandle = (row: any) => {
	answerProblemRef.value.initProblem(row.problemId, row.problemType, row.type, lessonId.value)
}

const { getDataList } = useCrud(state)
defineExpose({
	init
})
</script>
