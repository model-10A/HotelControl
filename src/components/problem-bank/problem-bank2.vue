<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="选择题" name="choice">
			<el-form :inline="true" :model="choice.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-select v-model="choice.queryForm.type" clearable placeholder="类型" size="small">
						<el-option label="单选" value="1"></el-option>
						<el-option label="多选" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="choice.queryForm.isTypical" clearable placeholder="典型问题" size="small">
						<el-option :value="1" label="是"></el-option>
						<el-option :value="0" label="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="choice.queryForm.name" clearable placeholder="名称" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="choice.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度" size="small"></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="choice.queryForm.kpCode" placeholder="知识点" size="small"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="choice.dataListLoading" :data="choice.dataList" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="编号" prop="id" width="60"></el-table-column>
				<el-table-column align="center" header-align="center" label="类型" prop="type" width="60">
					<template #default="scope">
						<span v-if="scope.row.type == 1">单选</span>
						<span v-if="scope.row.type == 2">多选</span>
					</template>
				</el-table-column>
				<el-table-column align="center" show-overflow-tooltip header-align="center" label="名称" prop="name" width="150"></el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					align="center"
					dict-type="problem_difficulty"
					header-align="center"
					label="难度"
					width="110"
					prop="difficulty"
				></fast-table-column>
				<el-table-column align="center" header-align="center" label="知识点" prop="kpName" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
					<template #default="scope">
						<el-button size="small" type="text" @click="addProblem(scope.row, 1)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="choice.page"
				:page-size="choice.limit"
				:page-sizes="choice.pageSizes"
				:total="choice.total"
				layout="total, prev, pager, next"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
		</el-tab-pane>

		<el-tab-pane label="填空题" name="fill">
			<el-form :inline="true" :model="fill.queryForm" @keyup.enter="useCrud(fill).getDataList()">
				<el-form-item>
					<el-select v-model="fill.queryForm.isTypical" clearable placeholder="典型问题" size="small">
						<el-option :value="1" label="是"></el-option>
						<el-option :value="0" label="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="fill.queryForm.name" clearable placeholder="名称" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="fill.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度" size="small"></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="fill.queryForm.kpCode" placeholder="知识点" size="small"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="useCrud(fill).getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="fill.dataListLoading" :data="fill.dataList" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="编号" prop="id" width="70"></el-table-column>
				<el-table-column align="center" header-align="center" label="名称" prop="name" show-overflow-tooltip width="150"> </el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					align="center"
					dict-type="problem_difficulty"
					show-overflow-tooltip
					header-align="center"
					label="难度"
					prop="difficulty"
					width="110"
				></fast-table-column>
				<el-table-column align="center" header-align="center" label="知识点" prop="kpName" width="200" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
					<template #default="scope">
						<el-button size="small" type="text" @click="addProblem(scope.row, 2)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="fill.page"
				:page-size="fill.limit"
				:page-sizes="fill.pageSizes"
				:total="fill.total"
				layout="total,prev, pager, next"
				@current-change="fillCurrentChangeHandle"
			>
			</el-pagination>
		</el-tab-pane>
		<el-tab-pane label="代码题" name="code">
			<el-form :inline="true" :model="code.queryForm" @keyup.enter="useCrud(code).getDataList()">
				<el-form-item>
					<el-select v-model="code.queryForm.isTypical" clearable placeholder="典型问题" size="small">
						<el-option :value="1" label="是"></el-option>
						<el-option :value="0" label="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="code.queryForm.name" clearable placeholder="名称" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="code.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度" size="small"></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="code.queryForm.kpCode" placeholder="知识点" size="small"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="useCrud(code).getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="code.dataListLoading" :data="code.dataList" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="编号" prop="id" width="80"></el-table-column>
				<el-table-column align="center" header-align="center" label="名称" prop="name" show-overflow-tooltip width="150"></el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					align="center"
					dict-type="problem_difficulty"
					header-align="center"
					label="难度"
					prop="difficulty"
					width="110"
				></fast-table-column>
				<el-table-column align="center" header-align="center" label="知识点" prop="kpName" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
					<template #default="scope">
						<el-button size="small" type="text" @click="addProblem(scope.row, 3)">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="code.page"
				:page-size="code.limit"
				:page-sizes="code.pageSizes"
				:total="code.total"
				layout="total, prev, pager, next"
				@current-change="codeCurrentChangeHandle"
			>
			</el-pagination>
		</el-tab-pane>
	</el-tabs>
</template>

<script lang="ts" setup>
import { inject, reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import KpSelectTree from '@/components/kp-select-tree'
import { useCrud } from '@/hooks'
const activeName = ref('choice')
const choice: IHooksOptions = reactive({
	dataListUrl: '/problem/choice/page',
	queryForm: {
		type: '',
		name: '',
		difficulty: '',
		kpCode: '',
		status: '1',
		isTypical: ''
	}
})

const code: IHooksOptions = reactive({
	dataListUrl: '/problem/code/page',
	queryForm: {
		type: '',
		name: '',
		difficulty: '',
		kpCode: '',
		status: '1',
		isTypical: ''
	}
})

const fill: IHooksOptions = reactive({
	dataListUrl: '/problem/fill/page',
	queryForm: {
		type: '',
		name: '',
		difficulty: '',
		kpCode: '',
		status: '1',
		isTypical: ''
	}
})

const dataList: any = inject('dataList')

const addProblem = (problem: any, type: number) => {
	dataList.push({
		sort: 99,
		problemId: problem.id,
		problemName: problem.name,
		problemType: type,
		score: 10,
		type: 1,
		source: 2
	})
}
const codeCurrentChangeHandle = (val: number) => {
	useCrud(code).currentChangeHandle(val)
}
useCrud(code).getDataList()
const fillCurrentChangeHandle = (val: number) => {
	useCrud(fill).currentChangeHandle(val)
}
useCrud(fill).getDataList()

const { getDataList, currentChangeHandle } = useCrud(choice)
</script>
