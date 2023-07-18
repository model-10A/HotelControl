<template>
	<div>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="账号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.mobile" placeholder="手机号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.realName" placeholder="姓名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<org-select-tree v-model="state.queryForm.orgId" placeholder="机构名称" clearable @changeIt="changeIt"></org-select-tree>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			style="width: 100%"
			row-key="id"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" :reserve-selection="true" width="50"></el-table-column>
			<el-table-column prop="username" label="账号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gender" label="性别" dict-type="user_gender"></fast-table-column>
			<el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="email" label="邮箱" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgName" label="所属机构" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="status" label="状态" dict-type="user_status"></fast-table-column>
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
	</div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import OrgSelectTree from '@/components/org-select-tree'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl } from '@/api/teach/student'

let userList: any[] = []
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		username: '',
		mobile: '',
		gender: '',
		orgArr: [],
		realName: ''
	}
})

const change = () => {
	return userList
}

defineExpose({
	change
})
const selectionChangeHandle = (selections: any[]) => {
	console.log(selections)
	state.dataListSelections = selections.map((item: any) => state.primaryKey && item[state.primaryKey])
	userList = state.dataListSelections
}
const changeIt = (orgArr: []) => {
	state.queryForm.orgArr = orgArr
	console.log(state.queryForm.orgArr)
}
const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 10px;
	padding-top: 5px;
}
</style>
