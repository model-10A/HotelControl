<template>
	<el-drawer v-model="visible" :modal="visible" size="50%" title="讲解卡">
    <code-problem-info v-show="record.problemType === 3" ref="codeRef" :download-flag="false"></code-problem-info>
    <fill-problem-info v-show="record.problemType === 2" ref="fillRef" :download-flag="false"></fill-problem-info>
    <choice-problem-info v-show="record.problemType === 1" ref="choiceRef" :download-flag="false"></choice-problem-info>
	</el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import CodeProblemInfo from '@/components/problem-info/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info/fill-problem-info.vue'
import { dataStudentsListUrl } from '@/api/lessons/attendlog'
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const value = ref(props.modelValue)
const visible = ref(false)
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
let record = reactive({
	problemType: 2,
	problemId: 0,
	userId: 0,
	source: 0,
	sourceId: 0
})

const init = async (problemId: number, pType: number, source: number, lessonId: number, userId: number) => {
	visible.value = true
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

</style>
