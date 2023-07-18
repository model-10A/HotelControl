<template>
	<el-dialog v-model="visible" width="70%" title="试卷管理" :close-on-click-modal="false">
		<el-row :gutter="20">
			<el-col :span="24">
				<el-table :data="dataList" border style="width: 100%" size="small">
					<el-table-column prop="paperId" label="试卷编号" header-align="center" align="center"></el-table-column>
					<el-table-column prop="paperName" label="试卷名称" header-align="center" align="center"></el-table-column>
					<el-table-column prop="paperType" label="试卷类型" header-align="center" align="center">
						<template #default="scope">
							<p v-if="scope.row.paperType == 0">预习资料</p>
							<p v-if="scope.row.paperType == 1">课堂练习</p>
							<p v-if="scope.row.paperType == 3">课后作业</p>
						</template>
					</el-table-column>
					<el-table-column prop="problemNum" label="题目数量" header-align="center" align="center"></el-table-column>
					<fast-table-column
						prop="difficulty"
						dict-type="problem_difficulty"
						label="难度"
						header-align="center"
						align="center"
						width="150"
					></fast-table-column>
					<el-table-column prop="description" label="说明" header-align="center" align="center"></el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<template #footer>
			<el-button @click="visible = false">返回</el-button>
		</template>
		<paper-problem-saw ref="editProblemRef"></paper-problem-saw>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRef } from 'vue'
import { getItemPaperApi } from '@/api/teach/teachplanitem'
import PaperProblem from '@/views/problem/paper/paper-problem.vue'
import PaperProblemSaw from '@/views/problem/paper/paper-problem-saw.vue'

const dataList = ref()
const visible = ref(false)
const init = async (id: number) => {
	visible.value = true
	getItemPaper(id)
	console.log(dataList)
}
const getItemPaper = (id: number) => {
	console.log('ididid')
	console.log(id)
	getItemPaperApi(id).then(res => {
		dataList.value = res.data
		dataList.value.id = id
	})
}

const editProblemRef = ref()
const editProblem = (id: number) => {
	console.log(id)
	editProblemRef.value.init(id)
}

defineExpose({
	init
})
</script>
