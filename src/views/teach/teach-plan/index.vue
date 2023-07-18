<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" clearable placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.lessonNum" clearable placeholder="课次"></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.status" clearable dict-type="problem_status" placeholder="计划状态"></fast-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
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
			<el-table-column align="center" header-align="center" type="selection" width="50"></el-table-column>
			<el-table-column align="center" header-align="center" label="名称" prop="name" show-overflow-tooltip></el-table-column>
			<fast-table-column
				align="center"
				dict-type="problem_difficulty"
				header-align="center"
				label="难度"
				prop="difficulty"
				width="130"
			></fast-table-column>
			<el-table-column align="center" header-align="center" label="课次" prop="lessonNum"></el-table-column>
			<el-table-column align="center" header-align="center" label="引用次数" prop="usedNum" width="100"></el-table-column>
			<el-table-column align="center" header-align="center" label="创建时间" prop="createTime"></el-table-column>
			<el-table-column align="center" header-align="center" label="状态">
				<template #default="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{
						getDictLabel(store.appStore.dictList, 'problem_status', scope.row.status)
					}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="350">
				<template #default="scope">
					<el-button v-if="scope.row.status === 1" style="padding: 0" size="small" type="text" @click="updateStatus(scope.row.id)">下架</el-button>
					<span v-else>
						<el-button size="small" style="padding: 0" type="text" @click="editItem(scope.row.id)">日历管理</el-button>
						<el-divider direction="vertical" />
						<el-button size="small" style="padding: 0" type="text" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
						<el-divider direction="vertical" />
						<el-button size="small" style="padding: 0" type="text" @click="updateStatus(scope.row.id)">发布</el-button>
					</span>
					<el-divider direction="vertical" />
					<el-button size="small" style="padding: 0" type="text" @click="editPaper(scope.row.id)">考卷管理</el-button>
					<el-divider v-if="scope.row.status !== 1" direction="vertical" />
					<el-button v-if="scope.row.status !== 1" size="small" style="padding: 0" type="text" @click="deleteBatchHandle(scope.row.id)"
						>删除</el-button
					>
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>

		<update-paper-dialog ref="editPaperRef"> </update-paper-dialog>
	</el-card>
</template>

<script lang="ts" name="TeachPlanIndex" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useTeachPlanUpdateStatusApi } from '@/api/teach/teachplan.ts'
import { ElMessage } from 'element-plus'
import { router } from '@/router'
import { dataListUrl, deleteUrl } from '@/api/teach/teachplan.ts'
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import UpdatePaperDialog from '@/views/teach/teach-plan/update-paper-dialog.vue'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		name: '',
		difficulty: '',
		lessonNum: '',
		status: ''
	}
})

const editItem = (id?: number) => {
	router.push({ path: '/teach/planItem/' + id })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const updateStatus = (id: number) => {
	console.log(id)
	useTeachPlanUpdateStatusApi(id).then((res: any) => {
		if (res.msg == 'success') {
			ElMessage.success('更新成功！')
			getDataList()
		} else {
			ElMessage.warning('更新失败！')
		}
	})
}

const editPaperRef = ref()
const editPaper = (id?: number) => {
	editPaperRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
