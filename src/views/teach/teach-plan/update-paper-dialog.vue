<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="试卷管理" width="80%">
		<teach-plan-paper v-model="dataList"></teach-plan-paper>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import TeachPlanPaper from '@/views/teach/teach-plan/teach-plan-paper.vue'
import { useAddTeachPlanPaperApi, useDeleteTeachPlanPaperApi, useGetTeachPlanPaperApi } from '@/api/teach/teachplanpaper'

const dataList = ref()
const visible = ref(false)
const itemId = ref()
const init = async (id: number) => {
	itemId.value = id
	await getItemPaper(id)
	visible.value = true
}
const getItemPaper = (id: number) => {
	useGetTeachPlanPaperApi(id).then(res => (dataList.value = res.data))
}

const submitHandle = async () => {
	dataList.value.forEach((item?: any) => {
		item.planId = itemId.value
	})
	await useDeleteTeachPlanPaperApi(itemId.value)
	await useAddTeachPlanPaperApi(dataList.value).then(() => ElMessage.success('添加成功'))
	visible.value = false
}

defineExpose({
	init
})
</script>

<style scoped></style>
