<template>
	<el-dialog v-model="visible" title="学生反馈" width="1200px" :close-on-click-modal="false" draggable>
		<div>
			<stu-line-chart ref="stuLineChartRef" />
		</div>
		<el-form style="text-align: center" :inline="true" class="demo-form-inline">
			<el-form-item label="优秀">
				<el-input-number v-model="state.proportion.excellent" controls-position="right" size="small" :precision="0" :step="1" :max="100" :min="0"
			/></el-form-item>
			<el-form-item label="中等"
				><el-input-number v-model="state.proportion.medium" controls-position="right" size="small" :precision="0" :step="1" :max="100" :min="0"
			/></el-form-item>
			<el-form-item label="不及格"
				><el-input-number v-model="state.proportion.fail" controls-position="right" size="small" :precision="0" :step="1" :max="100" :min="0"
			/></el-form-item>
			<el-form-item label="">
				<el-tooltip class="box-item" effect="dark" content="该操作将生成/覆盖所有学生评价" placement="bottom-end">
					<el-button type="primary" size="medium" @click="genComments()">一键评语</el-button>
				</el-tooltip>
			</el-form-item>
		</el-form>

		<el-form label-width="100px" style="max-height: 30vh; overflow: auto" label-position="right">
			<el-space wrap :size="10" alignment="flex-start">
				<el-form-item v-for="(item, index) in state.problemRank" :key="index" :label="item.name + '(第' + item.rankNum + '名)'">
					<el-input v-model="item.content" style="width: 1000px" type="textarea" @blur="updateHandle(item)" />
				</el-form-item>
			</el-space>
		</el-form>

		<template #footer>
			<el-button :disabled="state.problemRank.length === 0" type="primary" @click="submitHandle()">推送至公众号</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template></el-dialog
	>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import StuLineChart from '@/views/classroom/lesson/teacher/evaluation/stu-line-chart.vue'
import { getLessonProblemRank } from '@/api/judge/lessonRecord'
import { ElMessage, ElMessageBox } from 'element-plus'
import { insertEvaluationListApi, updateEvaluationApi, getLessonEvaluationApi, sendEvaluateApi } from '@/api/lessons/lessonEvaluation'
import service from '@/utils/request'

const visible = ref(false)
const stuLineChartRef = ref()
const state = reactive({
	problemRank: [
		{
			content: '',
			rankNum: 0,
			userId: 0,
			name: '',
			lessonId: 0,
		}
	],
	rank: [],
	proportion: {
		excellent: 25,
		medium: 50,
		fail: 25,
	},
	content: {
		excellent: '',
		medium: '',
		fail: ''
	}
})

const value = ref()
const lessonId = ref()
const init = (id: number) => {
	lessonId.value = id
	visible.value = true
	getLessonProblemRank(id, 1)
		.then(res => {
			state.rank = res.data
			// state.problemRank = JSON.parse(JSON.stringify(res.data))
			stuLineChartRef.value.setOptionData(res.data)
			getLessonEvaluationApi(id).then(res => {
				state.problemRank = res.data
			})
		})
		.finally(() => {})
}

const updateHandle = (dataFrom: any) => {
	updateEvaluationApi(dataFrom)
}

const submitHandle = () => {
	sendEvaluateApi(lessonId.value).then(res => {
		ElMessage.success('下发成功')
	})
	visible.value = false
}

const genComments = () => {
	if (state.proportion.excellent +  state.proportion.medium + state.proportion.fail !== 100) {
		ElMessage.error('占比和需要等于100%')
		return
	}
	if (state.problemRank.length !== 0) {
		ElMessageBox.confirm('重新生成将覆盖原有内容，确定重新生成?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			setComments()
		})
	} else {
		setComments()
	}
}
const setComments = () => {
	state.problemRank = state.rank
	// let total = state.problemRank.length
	// let excellent = total * state.proportion.excellent * 0.01
	// let medium = excellent + total * state.proportion.medium * 0.01
	// let fail = medium + total * state.proportion.fail * 0.01
	// console.log(excellent, medium, fail)
	// for (let i = 0; i < state.problemRank.length; i++) {
	// 	if (state.problemRank[i].rankNum < excellent) {
	// 		state.problemRank[i].content = '上游'
	// 	} else if (state.problemRank[i].rankNum < medium) {
	// 		state.problemRank[i].content = '居中'
	// 	} else if (state.problemRank[i].rankNum < fail) {
	// 		state.problemRank[i].content = '下游'
	// 	}
	// }
  let query = {lessonId:state.problemRank[0].lessonId , excellent:state.proportion.excellent , medium:state.proportion.medium , fail:state.proportion.fail}
	console.log(query)
  insertEvaluationListApi(query)
		.then(res => {
			ElMessage.success('生成成功')
		})
		.finally(() => {
			getLessonEvaluationApi(lessonId.value).then(res => {
				state.problemRank = res.data
			})
		})
}
defineExpose({
	init
})
</script>

<style scoped>
.tooltip-base-box .box-item {
	width: 110px;
	margin-top: 10px;
}
</style>
