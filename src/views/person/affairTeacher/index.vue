<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.username" placeholder="账户" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.mobile" placeholder="手机号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.realName" clearable placeholder="姓名"></el-input>
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
			<el-table-column prop="username" label="账户" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
			<fast-table-column prop="gender" label="性别" dict-type="user_gender" width="100"></fast-table-column>
			<el-table-column prop="mobile" label="手机号" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<!--			<el-table-column prop="email" label="邮箱" show-overflow-tooltip header-align="center" align="center"></el-table-column>-->
			<el-table-column label="职责" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.roleId === '3'">教务老师</el-tag>
					<el-tag v-else-if="scope.row.roleId === '4'" type="success">销售老师</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="orgName" label="所属机构" header-align="center" align="center"></el-table-column>

			<fast-table-column prop="status" label="状态" dict-type="user_status" width="100"></fast-table-column>
			<!--			<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>-->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button v-auth="'sys:user:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button type="primary" link @click="ResetPassword(scope.row.id)">重置密码</el-button>
					<el-button v-auth="'sys:user:delete'" type="primary" link @click="deleteBatchHandle(scope.row.id)">删除</el-button>
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
	</el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl, resetPassword } from '@/api/teach/affairTeacher'
import { ElMessage } from 'element-plus'
import { useUserInfoApi } from '@/api/sys/user'
import { onMounted } from 'vue'

const query = reactive({
	id: '',
	password: ''
})

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		username: '',
		mobile: '',
		realName: '',
		gender: '',
		orgId: ''
	}
})
const ResetPassword = (id: number) => {
	query.id = id.toString()
	query.password = '123456'
	resetPassword(query).then(() => {
		ElMessage.success({
			message: '操作成功',
			duration: 500
		})
	})
}
const getOrgId = async () => {
	const { data: data } = await useUserInfoApi()
	state.queryForm.orgId = data.orgId
	getDataList()
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}
onMounted(() => {
	getOrgId()
})
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
