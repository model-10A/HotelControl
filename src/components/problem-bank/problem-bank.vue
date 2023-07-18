<template>
	<el-tabs v-model="activeName">
		<el-tab-pane label="选择题" name="choice">
			<el-form :inline="true" :model="choice.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-select v-model="choice.queryForm.type" size="small" placeholder="类型" clearable>
						<el-option label="单选" value="1"></el-option>
						<el-option label="多选" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="choice.queryForm.isTypical" size="small" placeholder="是否典型" clearable>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="choice.queryForm.name" size="small" placeholder="名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="choice.queryForm.difficulty" size="small" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="choice.queryForm.kpCode" size="small" placeholder="知识点"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="choice.dataListLoading" size="small" :data="choice.dataList" border style="width: 100%">
				<el-table-column prop="id" label="编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="type" label="类型" header-align="center" align="center">
					<template #default="scope">
						<span v-if="scope.row.type === 1">单选</span>
						<span v-if="scope.row.type === 2">多选</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名称" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					prop="difficulty"
					label="难度"
					width="110"
					dict-type="problem_difficulty"
					header-align="center"
					align="center"
				></fast-table-column>
				<el-table-column prop="kpName" label="知识点" show-overflow-tooltip header-align="center" align="center" width="200"></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
					<template #default="scope">
						<el-button v-if="!has(scope.row.id, 1)" type="text" size="small" @click="addProblem(scope.row, 1)">选择</el-button>
						<span v-else>已选择</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="choice.page"
				:page-sizes="choice.pageSizes"
				:page-size="choice.limit"
				:total="choice.total"
				layout="total, prev, pager, next"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
		</el-tab-pane>

		<el-tab-pane label="填空题" name="fill">
			<el-form :inline="true" :model="fill.queryForm" @keyup.enter="useCrud(fill).getDataList()">
				<el-form-item>
					<el-select v-model="fill.queryForm.isTypical" size="small" placeholder="是否典型" clearable>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="fill.queryForm.name" size="small" placeholder="名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="fill.queryForm.difficulty" size="small" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="fill.queryForm.kpCode" size="small" placeholder="知识点"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="useCrud(fill).getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="fill.dataListLoading" size="small" :data="fill.dataList" border style="width: 100%">
				<el-table-column prop="id" label="编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					prop="difficulty"
					label="难度"
					width="110"
					dict-type="problem_difficulty"
					header-align="center"
					align="center"
				></fast-table-column>
				<el-table-column prop="kpName" label="知识点" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
					<template #default="scope">
						<el-button v-if="!has(scope.row.id, 2)" type="text" size="small" @click="addProblem(scope.row, 2)">选择</el-button>
						<span v-else>已选择</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="fill.page"
				:page-sizes="fill.pageSizes"
				:page-size="fill.limit"
				:total="fill.total"
				layout="total,prev, pager, next"
				@current-change="fillCurrentChangeHandle"
			>
			</el-pagination>
		</el-tab-pane>
		<el-tab-pane label="代码题" name="code">
			<el-form :inline="true" :model="code.queryForm" @keyup.enter="useCrud(code).getDataList()">
				<el-form-item>
					<el-select v-model="code.queryForm.isTypical" size="small" placeholder="典型问题" clearable>
						<el-option label="是" :value="1"></el-option>
						<el-option label="否" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="code.queryForm.name" size="small" placeholder="名称" clearable show-overflow-tooltip width="150"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="code.queryForm.difficulty" size="small" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="code.queryForm.kpCode" size="small" placeholder="知识点"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="useCrud(code).getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="code.dataListLoading" size="small" :data="code.dataList" border style="width: 100%">
				<el-table-column prop="id" label="编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" header-align="center" align="center" show-overflow-tooltip width="150"></el-table-column>
				<el-table-column
					prop="description"
					label="说明"
					:show-overflow-tooltip="true"
					header-align="center"
					align="center"
					width="200"
				></el-table-column>
				<fast-table-column
					prop="difficulty"
					label="难度"
					width="110"
					dict-type="problem_difficulty"
					header-align="center"
					align="center"
				></fast-table-column>
				<el-table-column prop="kpName" label="知识点" header-align="center" align="center" show-overflow-tooltip width="200"></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
					<template #default="scope">
						<el-button v-if="!has(scope.row.id, 3)" type="text" size="small" @click="addProblem(scope.row, 3)">选择</el-button>
						<span v-else>已选择</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="code.page"
				:page-sizes="code.pageSizes"
				:page-size="code.limit"
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

const has = (id: number, type: number) => {
	for (let i = 0; i < dataList.value.length; i++) {
		if (dataList.value[i].problemId === id && dataList.value[i].problemType === type) {
			return true
		}
	}
	return false
}
const addProblem = (problem: any, type: number) => {
	dataList.value.push({
		sort: 99,
		problemId: problem.id,
		problemName: problem.name,
		problemType: type
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
