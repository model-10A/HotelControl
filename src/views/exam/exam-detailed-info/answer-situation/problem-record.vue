<template>
	<el-drawer v-model="visible" :modal="visible" size="100%">
		<template #title>
			<div class="custom_dialog_header">
				<span style="font-size: 20px">讲解卡</span>
			</div>
		</template>
		<el-row>
			<el-col :span="12" style="overflow: auto">
				<code-problem-info v-show="record.problemType === 3" ref="codeRef" :download-flag="false"></code-problem-info>
				<fill-problem-info v-show="record.problemType === 2" ref="fillRef" :download-flag="false"></fill-problem-info>
				<choice-problem-info v-show="record.problemType === 1" ref="choiceRef" :download-flag="false"></choice-problem-info
			></el-col>
			<el-col :span="12" style="overflow: auto">
				<div style="text-align: center; margin-bottom: 20px">
					<el-button style="margin-right: 30px" @click="last">上一个</el-button>
					<el-select v-model="value" filterable placeholder="选择学生" @change="changeSelect">
						<el-option v-for="item in state.dataList" :key="item.userId" :label="item.name" :value="item.userId" />
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
import SubmitProblemCompletion from '@/components/problem-completion/submit-problem-completion.vue'

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
	source: 3,
	sourceId: 0
})

onMounted(async () => {
	//提前渲染body
	visible.value = true
	// visible.value = true
	await new Promise(resolve => setTimeout(resolve, 1))
	visible.value = false
})
const examId = ref()
const state = reactive({
	dataList: [] as any[]
})

const init = async (problemId: number, pType: number, source: number, sourceId: number, userId: number, dataList: any) => {
	visible.value = true
	examId.value = sourceId
	record.problemType = pType
	record.problemId = problemId
	record.source = source
	record.sourceId = sourceId
	value.value = userId
	state.dataList = dataList
	if (pType == 1) {
		await choiceRef.value.init(problemId, source, sourceId)
	} else if (pType === 2) {
		await fillRef.value.init(problemId, source, sourceId)
	} else if (pType === 3) {
		await codeRef.value.init(problemId, source, sourceId)
	}
	await initSubmitAndJudgementCompletion()
}

const changeSelect = () => {
	initSubmitAndJudgementCompletion()
}

const initSubmitAndJudgementCompletion = () => {
	submitProblemCompletionRef.value.init(record.problemId, record.problemType, record.source, record.sourceId, value)
}

const last = () => {
	for (let i = 0; i < state.dataList.length; i++) {
		if (state.dataList[i].userId === value.value) {
			if (i != 0) {
				value.value = state.dataList[i - 1].userId
				initSubmitAndJudgementCompletion()
			} else {
				ElMessage.info('当前是第一个')
			}
		}
	}
}
const next = () => {
	for (let i = 0; i < state.dataList.length; i++) {
		if (state.dataList[i].userId === value.value && i + 1 === state.dataList.length) {
			ElMessage.info('当前是最后一个')
			return
		}
		if (state.dataList[i].userId === value.value) {
			value.value = state.dataList[i + 1].userId
			initSubmitAndJudgementCompletion()
			return
		}
	}
}
defineExpose({
	init
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
