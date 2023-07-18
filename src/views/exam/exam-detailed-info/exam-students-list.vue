<template>
	<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
		<el-form-item>
			<el-input v-model="state.queryForm.name" placeholder="姓名"></el-input>
		</el-form-item>
		<el-form-item>
			<el-select v-model="state.queryForm.status" clearable placeholder="状态">
				<el-option :value="1" label="进行中"></el-option>
				<el-option :value="2" label="已交卷"></el-option>
				<el-option :value="0" label="未开始"></el-option>
				<!--				<el-option :value="-1" label="缺考"></el-option>-->
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-select v-model="state.queryForm.isCorrecting" clearable placeholder="是否批改完成">
				<el-option :value="1" label="是"></el-option>
				<el-option :value="0" label="否"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
		</el-form-item>
	</el-form>
	<el-form-item>
		<el-button :disabled="userIdList.length == 0" style="margin-left: 10px" type="primary" @click="exportUserExamExcel()">导出答题详情</el-button>
	</el-form-item>
	<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
		<el-table-column :selectable="selectable" align="center" header-align="center" type="selection" width="50"></el-table-column>
		<el-table-column align="center" header-align="center" label="姓名" prop="name"></el-table-column>
		<el-table-column align="center" header-align="center" label="参加时间" prop="joinTime"></el-table-column>
		<el-table-column align="center" header-align="center" label="交卷时间" prop="quitTime"></el-table-column>
		<el-table-column align="center" header-align="center" label="状态" prop="status" width="150">
			<template #default="scope">
				<el-tag v-if="scope.row.status === 0" type="info">未开始</el-tag>
				<el-tag v-else-if="scope.row.status === 1">进行中</el-tag>
				<el-tag v-else-if="scope.row.status === 2" type="success">已交卷</el-tag>
			</template>
		</el-table-column>
		<el-table-column align="center" header-align="center" label="得分" prop="score" width="200">
			<template #default="scope">
				<span>{{ scope.row.score }}/{{ scope.row.totalScore }}</span>
			</template>
		</el-table-column>
		<el-table-column align="center" header-align="center" label="批改" prop="isCorrecting" width="80">
			<template #default="scope">
				<div v-if="scope.row.isCorrecting === 0">否</div>
				<div v-else>是</div>
			</template>
		</el-table-column>
		<el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
			<template #default="scope">
				<el-button v-if="scope.row.isCorrecting === 0 && scope.row.status === 2" link type="primary" @click="makePaper(scope.row.userId)"
					>批卷</el-button
				>
				<el-button link type="primary" @click="deleteStu(scope.row.id)">移除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<el-pagination
		:current-page="state.page"
		:page-size="state.limit"
		:page-sizes="state.pageSizes"
		:total="state.total"
		layout="total, sizes, prev, pager, next, jumper"
		@size-change="sizeChangeHandle"
		@current-change="currentChangeHandle"
	>
	</el-pagination>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'

import { IHooksOptions } from '@/hooks/interface'
import { examAttendLogDeleteUrl, examAttendLogUrl, useUserExamExcelApi } from '@/api/lessons/exam'
import { router } from '@/router'
const userIdList = ref([] as any)
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const examId = ref(props.modelValue)

const state: IHooksOptions = reactive({
	dataListUrl: examAttendLogUrl,
	deleteUrl: examAttendLogDeleteUrl,
	queryForm: {
		name: '',
		examId: examId.value,
		joinTime: '',
		quitTime: '',
		status: '',
		isCorrecting: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const deleteStu = (id: any) => {
	deleteBatchHandle(id)
}
const makePaper = (userId: any) => {
	router.push({ path: '/exam/make-paper/' + examId.value + '/' + userId })
}

const selectionChangeHandle = (selections: any[]) => {
	userIdList.value = []
	selections.forEach((item: any) => {
		userIdList.value.push(item.userId)
	})
}
const exportUserExamExcel = () => {
	let data = {
		examId: examId.value,
		userIdList: userIdList.value
	}
	useUserExamExcelApi(data)
}

const selectable = (row: any, index: any) => {
	if (row.status === 2) {
		return true
	}
	return false
}

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<style scoped></style>
