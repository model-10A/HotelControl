<template>
	<el-dialog v-model="visible" width="40%" title="试卷-题目详情" :close-on-click-modal="false">
		<el-table size="small" border :data="dataList" style="width: 100%">
			<el-table-column prop="problemId" label="题目编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="problemName" label="名称" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="problemType" dict-type="problem_type" label="类型" header-align="center" align="center"></fast-table-column>
			<problem-bank></problem-bank>
		</el-table>
		<template #footer>
			<el-button @click="visible = false">返回</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProblemPaperItemApi } from '@/api/problem/paperitem'

const dataList = ref()
const visible = ref(false)
let paperId: number
const init = async (id: number) => {
	visible.value = true
	paperId = id
	getItemProblem(paperId)
}
const getItemProblem = (paperId: number) => {
	useProblemPaperItemApi(paperId).then(res => {
		dataList.value = res.data
	})
}
defineExpose({
	init
})
</script>
