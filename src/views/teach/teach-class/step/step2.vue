<template>
	<div>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.difficulty" placeholder="难度" dict-type="problem_difficulty" clearable></fast-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.lessonNum" placeholder="课次" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<div class="myTable">
			<el-table
				ref="taskTableRef"
				v-loading="state.dataListLoading"
				highlight-current-row
				:data="state.dataList"
				border
				style="width: 100%"
				@select="handleCurrentChange"
			>
				<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
				<fast-table-column
					prop="difficulty"
					label="难度"
					dict-type="problem_difficulty"
					header-align="center"
					align="center"
					width="130"
				></fast-table-column>
				<el-table-column prop="lessonNum" label="课次" header-align="center" align="center"></el-table-column>
				<el-table-column prop="usedNum" label="引用次数" header-align="center" align="center"></el-table-column>
				<fast-table-column prop="status" label="状态" dict-type="problem_status" header-align="center" align="center"></fast-table-column>
				<el-table-column label="详情" header-align="center" align="center" width="250">
					<template #default="scope">
						<el-button style="padding: 0" type="text" size="small" @click="editItem(scope.row.id)">教学日历</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
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
		<teach-plan-item ref="planItemRef"></teach-plan-item>
	</div>
</template>

<script setup lang="ts" name="TeachPlanIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, useTeachPlanUpdateStatusApi } from '@/api/teach/teachplan.ts'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import TeachPlanItem from '@/views/teach/teach-class/teach-planItem.vue'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		name: '',
		difficulty: '',
		lessonNum: '',
		status: 1
	}
})
const planItemRef = ref()

const change = () => {
	return selectRow.value
}

defineExpose({
	change
})
let selectRow = ref(null)
let taskTableRef = ref()
const handleCurrentChange = (val: any) => {
	console.log(val[0])
	if (val.length > 1) {
		let del_row = val.shift()
		taskTableRef.value.toggleRowSelection(del_row, false)
	}
	if (val[0] == undefined) {
		selectRow.value = null
	} else {
		selectRow.value = val[0]
	}
	console.log(selectRow.value)
}

const editItem = (id?: any) => {
	planItemRef.value.init(id)
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const updateStatus = (id: number) => {
	console.log(id)
	useTeachPlanUpdateStatusApi(id).then(res => {
		if (res.msg == 'success') {
			ElMessage.success('更新成功！')
			getDataList()
		} else {
			ElMessage.warning('更新失败！')
		}
	})
}

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>

<style scoped>
/deep/.el-table__header-wrapper .el-checkbox {
	display: none;
}
</style>
