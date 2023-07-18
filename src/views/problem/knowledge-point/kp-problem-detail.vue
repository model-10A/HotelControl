<template>
	<el-dialog v-model="visible" title="题目内容">
		<el-form :inline="true">
			<el-form-item>
				<fast-select v-model="state.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border max-height="400" style="width: 100%">
			<el-table-column align="center" header-align="center" label="题目编号" prop="id" width="100"></el-table-column>
			<el-table-column align="center" header-align="center" label="类型" prop="problemType" width="100">
				<template #default="scope">
					<span v-if="scope.row.problemType === 1">选择题</span>
					<span v-if="scope.row.problemType === 2">填空题</span>
					<span v-if="scope.row.problemType === 3">代码题</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="名称" prop="name" show-overflow-tooltip></el-table-column>
			<fast-table-column
				align="center"
				dict-type="problem_difficulty"
				header-align="center"
				label="难度"
				prop="difficulty"
				width="130"
			></fast-table-column>
		</el-table>
		<el-pagination
			v-show="state.total > 0"
			:current-page="state.page"
			:page-size="state.limit"
			:page-sizes="state.pageSizes"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
	</el-dialog>
</template>

<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { getKpProblemUrl } from '@/api/problem/knowledgepoint'
import { useCrud } from '@/hooks'

const visible = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: getKpProblemUrl,
	dataListLoading: true,
	queryForm: {
		code: '',
		difficulty: '',
		answered: 0
	}
})

const init = async (code: any) => {
	state.dataList = []
	visible.value = true
	state.dataListLoading = true
	state.queryForm.code = code
	await getDataList()
	state.dataListLoading = false
}

defineExpose({
	init
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped></style>
