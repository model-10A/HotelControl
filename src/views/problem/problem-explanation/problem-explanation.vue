<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<h3>{{ problemId }}:{{ problemName }}</h3>
			<br />
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column label="序号" header-align="center" align="center" width="100">
				<template #default="scope">
					<span>{{ scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ProblemCodeSampleIndex">
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { useRoute } from 'vue-router'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataListUrl } from '@/api/problem/problemExplanation.ts'
import { deleteProblemSolving } from '@/api/problem/problemExplanation'
import { useCrud } from '@/hooks'
import { useChoiceProblemApi } from '@/api/problem/choiceproblem'
import { useFillProblemApi } from '@/api/problem/fillproblem'
import { useCodeProblemApi } from '@/api/problem/codeproblem'

const value = ref('')
const route = useRoute()
let problemId: any = ref('')
let problemType: any = ref('')
let problemName: any = ref('')

const state = reactive({
	dataListSelections: [],
	dataListUrl: dataListUrl,
	createdIsNeed: false,
	queryForm: {
		problemId: '',
		problemType: ''
	},
	dataList: []
})

onMounted(() => {
	problemId.value = route.path
		.substring(0, route.path.length - 2)
		.split('/')
		.pop()
	problemType.value = route.path.split('/').pop()
	getProblem()
	state.queryForm.problemId = problemId.value
	state.queryForm.problemType = problemType.value
	getDataList()
})

const getProblem = () => {
	if (problemType.value === '1') {
		useChoiceProblemApi(problemId.value).then((res: any) => {
			problemName.value = res.data.name
		})
	} else if (problemType.value === '2') {
		useFillProblemApi(problemId.value).then((res: any) => {
			problemName.value = res.data.name
		})
	} else if (problemType.value === '3') {
		useCodeProblemApi(problemId.value).then((res: any) => {
			problemName.value = res.data.name
		})
	}
}

const deleteBatchHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			deleteProblemSolving(id).then(() => {
				ElMessage.success('删除成功')
				getDataList()
			})
		})
		.catch(() => {})
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id, problemId.value, problemType.value)
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
