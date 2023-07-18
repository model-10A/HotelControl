<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.jobId" placeholder="任务ID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.jobName" placeholder="任务名称"></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.jobGroup" dict-type="schedule_group" clearable placeholder="任务组名"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="jobId" label="任务ID" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="jobName" label="任务名称" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="jobGroup" label="任务组名" dict-type="schedule_group"></fast-table-column>
			<el-table-column prop="beanName" label="执行方法" show-overflow-tooltip dict-type="schedule_group">
				<template #default="scope"> {{ scope.row.beanName }}.{{ scope.row.method }}() </template>
			</el-table-column>
			<fast-table-column prop="status" label="状态" header-align="center" align="center" dict-type="success_fail" width="100"></fast-table-column>
			<el-table-column prop="times" label="时长（毫秒）" header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="createTime" label="执行时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="60">
				<template #default="scope">
					<el-button v-auth="'schedule:log'" type="primary" link @click="detailHandle(scope.row)">详情</el-button>
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
import { dataListLogUrl } from '@/api/quartz/schedule'

const state: IHooksOptions = reactive({
	dataListUrl: dataListLogUrl,
	queryForm: {
		jobName: '',
		jobGroup: '',
		jobId: ''
	}
})

const detailRef = ref()
const detailHandle = (row: any) => {
	detailRef.value.init(row)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
