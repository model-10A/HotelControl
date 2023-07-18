<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="试卷-题目管理" width="80%">
		<el-row :gutter="20">
			<el-col :span="12">
				<el-table :data="state" border size="small" style="width: 100%">
					<el-table-column align="center" header-align="center" label="顺序" prop="sort">
						<template #default="scope">
							<el-input v-model="scope.row.sort" size="small" @blur="inputBlur()"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="题目编号" prop="problemId"></el-table-column>
					<el-table-column align="center" header-align="center" label="名称" prop="problemName"></el-table-column>
					<fast-table-column align="center" dict-type="problem_type" header-align="center" label="类型" prop="problemType"></fast-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="分数" width="100">
						<template #default="scope">
							<el-input v-model="scope.row.score" size="small"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
						<template #default="scope">
							<el-button size="small" type="text" @click="cancel(scope.$index)">取消</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="12">
				<problem-bank></problem-bank>
			</el-col>
		</el-row>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { provide, reactive, ref } from 'vue'
import ProblemBank from '@/components/problem-bank/problem-bank.vue'
import { useProblemPaperItemApi, useProblemPaperItemSubmitApi, useProblemPaperItemDeleteApi } from '@/api/problem/paperitem'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
let paperId: number
let state: any = ref([])
const getProblemPaperItem = (id: number) => {
	useProblemPaperItemApi(id).then(res => {
		state.value = res.data
	})
}
provide('dataList', state)
const init = async (id: number) => {
	visible.value = true
	paperId = id
	await getProblemPaperItem(id)
}

const cancel = (index: number) => {
	state.value.splice(index, 1)
}

const submitHandle = () => {
	let empty: number = 0
	state.value.forEach((item: any) => {
		item.paperId = paperId
		if (item.score === '' || item.score === null || item.score === undefined || item.sort === '' || item.sort === null || item.sort === undefined) {
			empty++
		}
	})
	if (empty === 0) {
		useProblemPaperItemSubmitApi(state.value).then(res => {
			visible.value = false
			emit('refreshDataList')
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
				}
			})
		})
	} else {
		ElMessage.error({
			message: '顺序或分数不能为空',
			duration: 500
		})
	}
}

const inputBlur = () => {
	state.value.sort((a: any, b: any) => a.sort - b.sort)
}

defineExpose({
	init
})
</script>
