<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="用户名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="token" label="键" header-align="center" align="center" width="300"></el-table-column>
			<el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ip" label="登录IP" header-align="center" align="center"></el-table-column>
			<el-table-column prop="address" label="登录地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="userAgent" label="User Agent" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="loginTime" label="登录时间" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'monitor:online:all'" type="primary" link @click="forceLogout(scope.row.token)">强退</el-button>
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
</template>

<script setup lang="ts" name="MonitorOnlineIndex">
import { useCrud } from '@/hooks'
import { reactive } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, useForceLogoutApi } from '@/api/monitor/online'
import { ElMessage, ElMessageBox } from 'element-plus'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		username: ''
	}
})
const forceLogout = (token: string) => {
	ElMessageBox.confirm('确定进行强退操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			useForceLogoutApi(token).then(() => {
				ElMessage.success('强退成功')
				getDataList()
			})
		})
		.catch(() => {})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
