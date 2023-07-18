<template>
	<el-dialog v-model="visible" width="60%" title="ip白名单" :close-on-click-modal="false">
		<div style="margin-bottom: 10px">默认不限制IP</div>
		<el-card>
			<el-button type="primary" @click="addOrUpdateHandle(state.queryForm.lessonId)">新增</el-button>
			<br />
			<br />
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
				<el-table-column label="序号" header-align="center" align="center">
					<template #default="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="ipRange" label="ip范围" header-align="center" align="center"></el-table-column>
				<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center">
					<template #default="scope">
						<el-button type="text" size="small" @click="addOrUpdateHandle(state.queryForm.lessonId, scope.row.id)">修改</el-button>
						<el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--    添加或删除-->
			<ip-add-or-update ref="ipAddOrUpdateRef" @refreshDataList="getDataList"></ip-add-or-update>
		</el-card>
	</el-dialog>
</template>

<script lang="ts" setup name="ip-restriction">
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataListUrl, deleteUrl } from '@/api/lessons/lessonip.ts'
import { useCrud } from '@/hooks'
import IpAddOrUpdate from './ip-add-or-update.vue'
const visible = ref(false)
const lessonId = ref()
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		lessonId: 0
	},
	isPage: false
})

const ipAddOrUpdateRef = ref()
const addOrUpdateHandle = (lessonId: number, id?: number) => {
	ipAddOrUpdateRef.value.init(lessonId, id)
}

const init = (id?: number) => {
	visible.value = true
	state.queryForm.lessonId = id
	console.log(state.queryForm.lessonId)
	getDataList()
}

defineExpose({
	init
})

const { getDataList, deleteBatchHandle } = useCrud(state)
</script>

<style scoped></style>
