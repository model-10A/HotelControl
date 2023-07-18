<template>
	<el-drawer v-model="visible" size="70%" title="测试" :modal="visible">
		<code-problem-info-test v-show="record.problemType === 3" ref="codeRef"></code-problem-info-test>
	</el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import CodeProblemInfoTest from '@/components/problem-info/code-problem-info-test.vue'
import { dataStudentsListUrl } from '@/api/lessons/attendlog'
import service from '@/utils/request'
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const value = ref(props.modelValue)
const visible = ref(false)
const codeRef = ref()
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
	await codeRef.value.init(problemId, source, lessonId)
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
