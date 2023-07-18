<template>
	<div>
		<exam-result-display ref="examResultDisplayRef"></exam-result-display>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ExamResultDisplay from './score-line-chart.vue'
import { getExamRecordListInfoApi } from '@/api/lessons/exam'

const props = defineProps({
	modelValue: {
		type: String,
		required: true
	}
})
const examId = ref(props.modelValue)

let dataList = reactive<number[]>([])
const examResultDisplayRef = ref()
const getResultDisplayData = () => {
	let queryForm = {
		examId: examId.value,
		status: 2,
		isCorrecting: 1
	}
	getExamRecordListInfoApi(queryForm).then(res => {
		examResultDisplayRef.value.setOptionData(res.data)
	})
}

getResultDisplayData()
</script>

<style scoped>
.table_head {
	white-space: nowrap !important;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
