<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-select v-model="state.queryForm.isTypical" placeholder="典型问题" clearable>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.difficulty" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<kp-select-tree v-model="state.queryForm.kpCode" placeholder="知识点" clearable></kp-select-tree>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.status" dict-type="problem_status" placeholder="题目状态" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="importFromExcel()">导入</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="题目编号" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="name" label="名称" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
			<el-table-column
				prop="description"
				label="题干"
				:show-overflow-tooltip="true"
				header-align="center"
				align="center"
				width="200"
			></el-table-column>
			<el-table-column prop="source" label="来源" show-overflow-tooltip header-align="center" align="center" width="150"></el-table-column>
			<fast-table-column
				prop="difficulty"
				label="难度"
				dict-type="problem_difficulty"
				header-align="center"
				align="center"
				width="130"
			></fast-table-column>
			<el-table-column prop="kpName" label="知识点" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column prop="submitTimes" label="提交数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="correctTimes" label="正确数" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="isTypical" label="典型" dict-type="yes_or_no" header-align="center" align="center"></fast-table-column>
			<el-table-column prop="usedNum" label="引用数" header-align="center" align="center"></el-table-column>
			<el-table-column label="状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{
						getDictLabel(store.appStore.dictList, 'problem_status', scope.row.status)
					}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button v-if="scope.row.status === 1" style="padding: 0" type="text" size="small" @click="updateStatus(scope.row.id)">下架</el-button>
					<span v-else>
						<!--						<el-button style="padding: 0" type="text" size="small" @click="editResources(scope.row.id, 2)">资源管理</el-button>-->

						<el-button style="padding: 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
						<el-divider direction="vertical" />
						<el-button style="padding: 0" type="text" size="small" @click="updateStatus(scope.row.id)">发布</el-button>
					</span>
					<el-divider direction="vertical" />
					<el-button
						style="padding: 0"
						type="text"
						size="small"
						@click="router.push({ path: '/problem/problem-explanation/' + scope.row.id + '/' + 2 })"
						>题解管理</el-button
					>
					<el-divider v-if="scope.row.status !== 1" direction="vertical" />
					<el-button v-if="scope.row.status !== 1" style="padding: 0" type="text" size="small" @click="deleteBatchHandle(scope.row.id)"
						>删除</el-button
					>
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

		<!--资源管理弹窗-->
		<problem-resource ref="editResourceRef"></problem-resource>
		<import-excel ref="importExcelRef" @refreshDataList="getDataList"></import-excel>
	</el-card>
</template>

<script setup lang="ts" name="ProblemFill-problemIndex">
import { useCrud } from '@/hooks'
import { router } from '@/router'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { useFillProblemUpdateStatusApi } from '@/api/problem/fillproblem'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'
import { dataListUrl, deleteUrl } from '@/api/problem/fillproblem'
import ProblemResource from '../problem-resource/problem-resource.vue'
import ImportExcel from '@/views/problem/fill-problem/import-excel.vue'
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		name: '',
		difficulty: '',
		status: '',
		isTypical: '',
		kpCode: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
const importExcelRef = ref()
const importFromExcel = () => {
	importExcelRef.value.init()
}
const updateStatus = (id: number) => {
	useFillProblemUpdateStatusApi(id).then(res => {
		ElMessage.success('更新成功！')
		getDataList()
	})
}

const editResourceRef = ref()
const editResources = (id?: number, type?: number) => {
	editResourceRef.value.init(id, type)
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
