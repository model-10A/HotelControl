<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
			  <el-input v-model="queryForm.id" placeholder="班级id" clearable></el-input>
			</el-form-item> -->
			<el-form-item>
				<el-input v-model="state.queryForm.className" placeholder="班级名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>

		<el-button type="primary" style="margin-bottom: 15px" @click="addOrUpdateHandle()">新增</el-button>

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<!--			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>-->
			<!-- <el-table-column prop="id" label="班级id" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="className" label="班级名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="object" label="面向对象" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseType" label="课程类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="target" label="课程目标" header-align="center" align="center" width="300"></el-table-column>
			<el-table-column prop="classDate" label="开课日期" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column prop="classEnd" label="结课日期" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column prop="startTime" label="开始时间" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="90">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 0" type="danger" size="large">未发布</el-tag>
					<el-tag v-else type="success" size="large">已发布</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button style="margin-right: 10px" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button style="margin-right: 10px" type="text" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					<el-button v-if="scope.row.status === 0" type="text" @click="publish(scope.row)">发布</el-button>
					<el-button v-else type="text" @click="publish(scope.row)">取消发布</el-button>
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
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList()"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="EnrollClassIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useEnrollClassStatusApi, dataListUrl, deleteUrl } from '@/api/affair/enrollclass'
import { ElMessage, ElMessageBox } from 'element-plus'
import { value } from 'dom7'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		className: ''
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

//发布
const publish = (row: any) => {
	console.log('发布', row)
	if (row.status === 0) {
		ElMessageBox.confirm('确认要发布此班级吗?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			useEnrollClassStatusApi(row.id).then(() => {
				ElMessage({
					type: 'success',
					message: '发布成功'
				})
				getDataList()
			})
		})
	} else {
		ElMessageBox.confirm('确认要取消发布此班级吗?', '提示', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			useEnrollClassStatusApi(row.id).then(res => {
				ElMessage({
					type: 'success',
					message: '取消发布成功'
				})
				getDataList()
			})
		})
	}
}

//挂载前完成获取数据
onMounted(() => {
	// console.log(123)
	getDataList()
})

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
