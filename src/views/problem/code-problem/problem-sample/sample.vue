<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm">
			<h3>{{ problemId }}:{{ problemName }}</h3>
			<br />
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle(problemId)">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column label="序号" header-align="center" align="center">
				<template #default="scope">
					<span>{{ scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="inputPath" label="样例输入文件地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="outputPath" label="样例输出文件地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="inputSize" label="样例输入文件大小" header-align="center" align="center"></el-table-column>
			<el-table-column prop="outputSize" label="样例输出文件大小" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button type="text" size="small" @click="previewResourcesHandle(scope.row)">预览</el-button>
					<el-button type="text" size="small" @click="downloadHandle(scope.row)">下载</el-button>
					<el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getList"></add-or-update>
		<!--    预览-->
		<preview-sample ref="previewSampleRef"></preview-sample>
	</el-card>
</template>

<script setup lang="ts" name="ProblemCodeSampleIndex">
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import PreviewResources from './preview-sample.vue'
import { useRoute } from 'vue-router'
import { useCodeProblemApi } from '@/api/problem/codeproblem'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataListUrl, deleteUrl } from '@/api/problem/problemsample'
import { downloadSampleApi } from '@/api/file/file'
import PreviewSample from '@/views/problem/code-problem/problem-sample/preview-sample.vue'

const value = ref('')
const route = useRoute()
const problemId: any = ref('')
let problemName: any = ref('')

onMounted(() => {
	problemId.value = route.path.split('/').pop()
	getProblem(problemId.value)
	state.problemId = problemId.value
	getList()
})

const state = reactive({
	dataListSelections: [],
	dataListLoading: false,
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	problemId: '',
	dataList: []
})

const previewSampleRef = ref()
const previewResourcesHandle = (row: any) => {
	previewSampleRef.value.init(row.inputPath, row.outputPath)
}

const getList = () => {
	state.dataListLoading = true
	service.get(state.dataListUrl + state.problemId).then((res: any) => {
		state.dataList = res.data
	})
	state.dataListLoading = false
}

const downloadHandle = (row: any) => {
	downloadSampleApi(row.inputPath)
	downloadSampleApi(row.outputPath)
}

const deleteBatchHandle = (key?: number | string) => {
	let data: any[] = []
	if (key) {
		data = [key]
	} else {
		data = state.dataListSelections ? state.dataListSelections : []
		if (data.length === 0) {
			ElMessage.warning('请选择删除记录')
			return
		}
	}
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			if (state.deleteUrl) {
				service.delete(state.deleteUrl, { data }).then(() => {
					ElMessage.success('删除成功')
					getList()
				})
			}
		})
		.catch(() => {})
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id: number) => {
	addOrUpdateRef.value.init(id)
}

const getProblem = (id: number) => {
	useCodeProblemApi(id).then(res => {
		problemName.value = res.data.name
		console.log(problemName)
	})
}
</script>
