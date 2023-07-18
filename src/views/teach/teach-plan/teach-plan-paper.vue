<template>
	<el-row :gutter="20">
		<el-col :span="12">
			<el-table :data="modelValue" :model-value="modelValue" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="试卷名称" prop="paperName"></el-table-column>
				<el-table-column align="center" label="备注">
					<template #default="scope">
						<el-input v-model="scope.row.remark" clearable placeholder="备注"></el-input>
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
			<el-form :inline="true" :model="state.queryForm" size="small" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" clearable placeholder="试卷名称"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="state.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度"></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="state.queryForm.kpId" clearable placeholder="知识点"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="试卷编号" prop="id"></el-table-column>
				<el-table-column align="center" header-align="center" label="试卷名称" prop="name"></el-table-column>
				<el-table-column align="center" header-align="center" label="知识点" prop="kpName"></el-table-column>
				<fast-table-column
					align="center"
					dict-type="problem_difficulty"
					header-align="center"
					label="难度"
					prop="difficulty"
					width="130"
				></fast-table-column>
				<el-table-column align="center" header-align="center" label="操作">
					<template #default="scope">
						<el-button :disabled="hasPaper(scope.row.id)" link size="small" type="primary" @click.prevent="onAddItem(scope.row.id, scope.row.name)">
							添加
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="state.page"
				:page-size="state.limit"
				:page-sizes="state.pageSizes"
				:total="state.total"
				layout="total, prev, pager, next"
				size="small"
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { reactive, ref, toRef } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import KpSelectTree from '@/components/kp-select-tree'
import { dataListUrl } from '@/api/problem/paper'

const props = defineProps({
	modelValue: {
		type: Array,
		required: true
	}
})

const dataList = toRef(props as any, 'modelValue')
const remark = ref()
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		name: '',
		status: 1,
		difficulty: '',
		kpId: ''
	}
})

const cancel = (index: number) => {
	dataList.value.splice(index, 1)
}

const onAddItem = (id: number, name: any) => {
	dataList.value.push({
		paperName: name,
		paperId: id,
		planId: 0,
		remark: ''
	})
}

const hasPaper = (id: any) => {
	for (let i = 0; i < dataList.value.length; i++) {
		if (dataList.value[i].paperId === id) {
			return true
		}
	}

	return false
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
