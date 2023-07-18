<template>
	<el-row :gutter="20">
		<el-col :span="12">
			<el-table size="small" border :model-value="modelValue" :data="modelValue" style="width: 100%">
				<el-table-column prop="paperName" label="试卷名称" header-align="center" align="center"></el-table-column>
				<el-table-column label="试卷类型" align="center">
					<template #default="scope">
						<fast-select v-model="scope.row.paperType" size="small" dict-type="teachItem-paperType"></fast-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
					<template #default="scope">
						<el-button size="small" type="text" @click="cancel(scope.$index)">取消</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-col>
		<el-col :span="12">
			<el-form :inline="true" :model="state.queryForm" size="small" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" placeholder="试卷名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="state.queryForm.difficulty" dict-type="problem_difficulty" placeholder="难度" clearable></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="state.queryForm.kpId" placeholder="知识点" clearable></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" size="small">
				<el-table-column prop="id" label="试卷编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="name" label="试卷名称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="kpName" label="知识点" header-align="center" align="center"></el-table-column>
				<fast-table-column
					prop="difficulty"
					dict-type="problem_difficulty"
					label="难度"
					header-align="center"
					align="center"
					width="130"
				></fast-table-column>
				<el-table-column label="操作" header-align="center" align="center">
					<template #default="scope">
						<el-button link type="primary" size="small" @click.prevent="onAddItem(scope.row.id, scope.row.name)"> 添加 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="state.page"
				:page-sizes="state.pageSizes"
				:page-size="state.limit"
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

<script setup lang="ts">
import { reactive, toRef } from 'vue'
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
const dataList = toRef(props, 'modelValue')

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

const onAddItem = (id: number, name: number) => {
	dataList.value.push({
		itemId: '',
		paperId: id,
		paperName: name,
		paperType: 0
	})
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
