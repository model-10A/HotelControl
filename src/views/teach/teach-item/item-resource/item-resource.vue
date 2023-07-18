<template>
	<el-dialog v-model="visible" width="80%" title="资源管理" :close-on-click-modal="false">
		<el-card>
			<el-form :inline="true">
				<h3>{{ teachItemName }}</h3>
				<br />
				<el-form-item>
					<el-button type="primary" @click="addOrUpdateHandle(state.itemId)">新增</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
				<el-table-column label="序号" header-align="center" align="center">
					<template #default="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="filePath" label="路径" header-align="center" align="center"></el-table-column>
				<el-table-column label="资源类型" header-align="center" align="center">
					<template #default="scope">
						<span v-show="scope.row.fileType === 1">PDF</span>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
					<template #default="scope">
						<el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 弹窗, 新增 / 修改 -->
			<add-resource ref="addOrUpdateRef" @refreshDataList="getList"></add-resource>
		</el-card>
	</el-dialog>
</template>

<script setup lang="ts" name="ProblemCodeSampleIndex">
import { onMounted, reactive, ref } from 'vue'
import AddResource from './add-resource.vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteItemResourceApi, getItemResourceApi, getTeachPlanItemApi, resourceDataListUrl, resourceDeleteUrl } from '@/api/teach/teachplanitem'

const value = ref('')
const route = useRoute()
let teachItemName: any = ref('')
const visible = ref(false)

const state = reactive({
	dataListSelections: [],
	dataListLoading: false,
	deleteUrl: resourceDeleteUrl,
	itemId: 0,
	dataList: []
})
const getList = () => {
	state.dataListLoading = true
	getItemResourceApi(state.itemId).then((res: any) => {
		state.dataList = res.data
	})
	state.dataListLoading = false
}

const deleteBatchHandle = (key?: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			if (state.deleteUrl) {
				deleteItemResourceApi(key).then(() => {
					ElMessage.success('删除成功')
					getList()
				})
			}
		})
		.catch(() => {})
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id: number) => {
	addOrUpdateRef.value.init(id)
}

const getTeachPlanItem = async (id: number) => {
	await getTeachPlanItemApi(id).then(res => {
		teachItemName.value = res.data.name
		console.log(teachItemName)
	})
}

const init = (itemId: number) => {
	visible.value = true
	state.itemId = itemId
	console.log(state.itemId)
	getTeachPlanItem(state.itemId)
	getList()
}

defineExpose({
	init
})
</script>
