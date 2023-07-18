<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="操作人" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.type" dict-type="request_type" placeholder="请求类型" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.status" dict-type="success_fail" placeholder="操作状态" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-form v-if="state.dataListSelections.length > 0" :inline="true">
			<el-form-item>
				<el-button v-auth="'sys:log:operation:delete'" type="danger" @click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="module" label="系统模块" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="url" label="请求路径" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<fast-table-column prop="type" label="状态" header-align="center" align="center" dict-type="request_type" width="100"></fast-table-column>
			<el-table-column prop="username" label="操作人" header-align="center" align="center" width="130"></el-table-column>
			<el-table-column prop="ip" label="主机" header-align="center" align="center" width="150"></el-table-column>
			<fast-table-column prop="status" label="状态" header-align="center" align="center" dict-type="success_fail" width="100"></fast-table-column>
			<el-table-column prop="times" label="时长（毫秒）" header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="createTime" label="操作时间" header-align="center" align="center" width="180"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="120">
				<template #default="scope">
					<el-button v-auth="'sys:log:operation'" type="primary" link @click="detailHandle(scope.row)">详情</el-button>
					<el-button v-auth="'sys:log:operation:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
	</el-card>

	<detail ref="detailRef"></detail>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import Detail from './detail.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl } from '@/api/sys/log-operation'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		username: '',
		type: '',
		status: ''
	}
})

const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
