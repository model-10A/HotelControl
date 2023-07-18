<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="试卷名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.difficulty" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.status" dict-type="enable_disable" placeholder="状态" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<kp-select-tree v-model="state.queryForm.kpCode" placeholder="知识点" clearable></kp-select-tree>
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
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="试卷编号" header-align="center" align="center" width="90"></el-table-column>
			<el-table-column prop="name" label="试卷名称" header-align="center" align="center" width="250"></el-table-column>
			<el-table-column prop="kpName" label="知识点" header-align="center" align="center" width="250"></el-table-column>
			<el-table-column prop="description" label="说明" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
			<fast-table-column
				prop="difficulty"
				dict-type="problem_difficulty"
				label="难度"
				header-align="center"
				align="center"
				width="130"
			></fast-table-column>
			<el-table-column prop="problemNum" label="题量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="score" label="总分" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{
						getDictLabel(store.appStore.dictList, 'problem_status', scope.row.status)
					}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="creator" label="创建人" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button v-if="scope.row.status === 1" style="padding: 0" type="text" size="small" @click="updateStatus(scope.row)">停用</el-button>
					<span v-else>
						<el-button style="padding: 0" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-divider direction="vertical" />
						<el-button style="padding: 0" type="text" size="small" @click="editPaperProblem(scope.row.id)">试题</el-button>
						<el-divider direction="vertical" />
						<el-button style="padding: 0" type="text" size="small" @click="updateStatus(scope.row)">启用</el-button>
						<el-divider direction="vertical" />
						<el-button style="padding: 0" type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					</span>
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
		<paper-problem ref="editPaperProblemRef" @refreshDataList="getDataList"></paper-problem>
	</el-card>
</template>

<script setup lang="ts" name="ProblemPaperIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import PaperProblem from '@/views/problem/paper/paper-problem.vue'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'
import { useProblemPaperStatusApi } from '@/api/problem/paper.ts'
import { dataListUrl, deleteUrl } from '@/api/problem/paper.ts'
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import { ElMessage } from 'element-plus'
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	dataListLoading: false,
	queryForm: {
		name: '',
		status: '',
		difficulty: '',
		kpCode: ''
	}
})

const addOrUpdateRef = ref()
const editPaperProblemRef = ref()

const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const editPaperProblem = (id?: number) => {
	editPaperProblemRef.value.init(id)
}

const updateStatus = (row: any) => {
	if (row.problemNum === 0 && row.status != 1) {
		ElMessage.error('试卷题目不可为空！')
		return
	}
	useProblemPaperStatusApi(row.id).finally(() => {
		getDataList()
	})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
