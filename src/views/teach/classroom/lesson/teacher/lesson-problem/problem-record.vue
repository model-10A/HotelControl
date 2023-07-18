<template>
	<el-drawer v-model="visible" :modal="visible" size="100%" title="讲解卡">
		<el-row :gutter="20">
			<el-col :span="12">
				<code-problem-info v-show="record.problemType === 3" ref="codeRef" :download-flag="false"></code-problem-info>
				<fill-problem-info v-show="record.problemType === 2" ref="fillRef" :download-flag="false"></fill-problem-info>
				<choice-problem-info v-show="record.problemType === 1" ref="choiceRef" :download-flag="false"></choice-problem-info
			></el-col>
			<el-col :span="12">
				<div style="text-align: center; margin-bottom: 20px">
					<el-button style="margin-right: 30px" @click="last">上一个</el-button>
					<el-select v-model="value" filterable placeholder="选择学生" @change="changeSelect">
						<el-option v-for="item in state.dataList" :key="item.id" :label="item.name" :value="item.stuId" />
					</el-select>
					<el-button style="margin-left: 30px" @click="next">下一个</el-button>
				</div>

				<submit-problem-completion ref="submitProblemCompletionRef"></submit-problem-completion>
			</el-col>
		</el-row>
	</el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import CodeProblemInfo from '@/components/problem-info/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info/fill-problem-info.vue'
import { dataStudentsListUrl } from '@/api/lessons/attendlog'
import SubmitProblemCompletion from '@/components/problem-completion/submit-problem-completion.vue'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const submitProblemCompletionRef = ref()
const value = ref(props.modelValue)
const visible = ref(false)
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
const dialog = ref()

let record = reactive({
	problemType: 2,
	problemId: 0,
	userId: 0,
	source: 0,
	sourceId: 0
})

onMounted(async () => {
	//提前渲染body
	//提前渲染body
	visible.value = true
	await new Promise(resolve => setTimeout(resolve, 10))
	visible.value = false
})

const state = reactive({
	dataListUrl: dataStudentsListUrl,
	dataListLoading: false,
	queryForm: {
		lessonId: 0
	},
	dataList: [] as any[]
})

const init = async (problemId: number, pType: number, source: number, lessonId: number, userId: number) => {
	visible.value = true
	state.queryForm.lessonId = lessonId
	record.problemType = pType
	record.problemId = problemId
	record.source = source
	record.sourceId = lessonId
	value.value = userId
	if (pType == 1) {
		await choiceRef.value.init(problemId, source, lessonId)
	} else if (pType === 2) {
		await fillRef.value.init(problemId, source, lessonId)
	} else if (pType === 3) {
		await codeRef.value.init(problemId, source, lessonId)
	}
	await getDataList()
	await initSubmitAndJudgementCompletion()
}

const changeSelect = () => {
	initSubmitAndJudgementCompletion()
}

const initSubmitAndJudgementCompletion = () => {
	submitProblemCompletionRef.value.init(record.problemId, record.problemType, record.source, record.sourceId, value)
}

const getDataList = async () => {
	state.dataListLoading = true
	let res = await service.get(state.dataListUrl, { params: { ...state.queryForm } })
	state.dataList = res.data
	if (value.value === undefined) {
		value.value = res.data[0].stuId
	}
	state.dataListLoading = false
}

const last = () => {
	for (let i = 0; i < state.dataList.length; i++) {
		if (state.dataList[i].stuId === value.value) {
			if (i != 0) {
				value.value = state.dataList[i - 1].stuId
				initSubmitAndJudgementCompletion()
			} else {
				ElMessage.info('当前是第一个')
			}
		}
	}
}
const next = () => {
	for (let i = 0; i < state.dataList.length; i++) {
		if (state.dataList[i].stuId === value.value && i + 1 === state.dataList.length) {
			ElMessage.info('当前是最后一个')
			return
		}
		if (state.dataList[i].stuId === value.value) {
			value.value = state.dataList[i + 1].stuId
			initSubmitAndJudgementCompletion()
			return
		}
	}
}
const closeDialog = () => {
	visible.value = false
}
defineExpose({
	init,
	closeDialog
})
</script>

<style scoped>
.fullscreen {
	float: right;
	margin-right: 20px;
	margin-top: 3px;
	cursor: pointer;
	font-size: 15px;
}
.fullscreen:hover {
	color: #207ff6;
}
</style>
