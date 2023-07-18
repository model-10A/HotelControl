<template>
	<el-dialog v-model="visible" width="30%" title="学生详情" :close-on-click-modal="false">
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="username" label="学生账号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="学生姓名" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.queryForm.page"
			:page-size="state.queryForm.size"
			layout="total, sizes, prev, pager, next, jumper"
			:total="state.queryForm.total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		>
		</el-pagination>
	</el-dialog>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import { dataListUrl } from '@/api/teach/classuser'
import { useStudentsApi } from '@/api/teach/student'

const state = reactive({
	dataListSelections: [],
	dataListUrl: dataListUrl,
	dataListLoading: false,
	queryForm: {
		size: 10,
		page: 1,
		total: 0,
		classId: 0
	},
	dataList: [
		{
			username: '',
			userId: ''
		}
	]
})
//当前页数的更改
const handleCurrentChange = (val: any) => {
	state.queryForm.page = val
	getList(state.queryForm)
}
//分页的大小
const handleSizeChange = (val: any) => {
	state.queryForm.size = val
	getList(state.queryForm)
}
const classId: any = ref('')
const visible = ref(false)
const init = (classId: number) => {
	state.queryForm.classId = classId
	visible.value = true
	getList(state.queryForm)
}

const getList = (queryForm: any) => {
	useStudentsApi(queryForm).then(res => {
		console.log(res)
		state.dataList = res.data.list
		state.queryForm.total = res.data.total
	})
}

defineExpose({
	init
})
</script>
