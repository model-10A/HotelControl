<template>
	<el-card>
		<h3>{{ planId }}:{{ planName }}</h3>
		<br />
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="addHandle(planId)">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="description" label="说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="sort" label="子项顺序" header-align="center" align="center"></el-table-column>
			<el-table-column prop="duration" label="时长（分钟）" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="500">
				<template #default="scope">
					<el-button type="text" size="small" @click="editPaper(scope.row.id)">试卷管理</el-button>
					<el-button type="text" size="small" @click="editResources(scope.row.id)">资源管理</el-button>
					<el-button type="text" size="small" @click="updateHandle(scope.row.planId, scope.row.id)">修改</el-button>
					<el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 弹窗, 新增 / 修改 -->
		<add-item ref="addItemRef" @refreshDataList="getList"></add-item>
		<update-item ref="updateItemRef" @refreshDataList="getList"></update-item>
		<!--    试卷管理弹窗-->
		<update-paper-dialog ref="editPaperRef"> </update-paper-dialog>
		<!--    资源管理弹窗-->
		<item-resource ref="editResourceRef"></item-resource>

	</el-card>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import AddItem from './add-item.vue'
import UpdateItem from './update-item.vue'
import { useRoute } from 'vue-router'
import { useTeachPlanApi } from '@/api/teach/teachplan'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import UpdatePaperDialog from '@/views/teach/teach-item/item-paper/update-paper-dialog.vue'
import ItemResource from './item-resource/item-resource.vue'
import { dataListUrl, deleteUrl } from '@/api/teach/teachplanitem'

const state = reactive({
	dataListSelections: [],
	dataListLoading: false,
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	planId: '',
	dataList: []
})

const route = useRoute()
const planId: any = ref('')
let planName: any = ref('')

onMounted(() => {
	planId.value = route.path.split('/').pop()
	getPlan(planId.value)
	state.planId = planId.value
	getList()
})
const editPaperRef = ref()
const editPaper = (id?: number) => {
	editPaperRef.value.init(id)
}

const editResourceRef = ref()
const editResources = (id?: number) => {
	editResourceRef.value.init(id)
}

const addItemRef = ref()
const addHandle = (planId: number, id?: number) => {
	addItemRef.value.init(planId, id)
}

const updateItemRef = ref()
const updateHandle = (planId: number, id?: number) => {
	updateItemRef.value.init(planId, id)
}

const getList = () => {
	state.dataListLoading = true
	service
		.get(state.dataListUrl + state.planId)
		.then((res: any) => {
			state.dataList = res.data
		})
		.finally(() => {
			state.dataListLoading = false
		})
}
const getPlan = (id: number) => {
	useTeachPlanApi(id).then(res => {
		planName.value = res.data.name
		console.log(planName)
	})
}

const deleteBatchHandle = (key?: number | string) => {
	let data: any[] = []
	if (key) {
		data = [key]
	} else {
		data = state.dataListSelections ? state.dataListSelections : []
		if (data.length === 0) {
			ElMessage.warning('请选择删除记录')
			return
		}
	}
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			if (state.deleteUrl) {
				service.delete(state.deleteUrl, { data }).then(() => {
					ElMessage.success('删除成功')
					getList()
				})
			}
		})
		.catch(() => {})
}
</script>
