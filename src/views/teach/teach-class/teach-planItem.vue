<template>
	<el-dialog v-model="visible" width="30%" title="教学日历详情" :close-on-click-modal="false">
		<br />
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="description" label="说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="sort" label="子项顺序" header-align="center" align="center"></el-table-column>
			<el-table-column prop="duration" label="时长（分钟）" header-align="center" align="center"></el-table-column>
		</el-table>
		<template #footer>
			<el-button @click="visible = false">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTeachPlanApi } from '@/api/teach/teachplan'
import service from '@/utils/request'
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

const visible = ref(false)
const init = (planId: any) => {
	visible.value = true
	getPlan(planId)
	state.planId = planId
	getList()
}
// onMounted(() => {
// 	getPlan(planId.value)
// 	state.planId = planId.value
// 	getList()
// })

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
defineExpose({
	init
})
</script>
