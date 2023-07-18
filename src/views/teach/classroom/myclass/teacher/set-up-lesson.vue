<template>
	<el-dialog v-model="visible" title="设置下一次课堂" :close-on-click-modal="false" width="600px">
		<el-select v-model="dataForm.nextLesson" style="width: 400px" class="m-2" placeholder="Select" size="large">
			<el-option
				v-for="item in state.dataList"
				:key="item.id"
				:label="item.name + '( ' + item.beginTime + '~' + item.endTime + ' )'"
				:value="item.id"
			/>
		</el-select>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl } from '@/api/lessons/lesson'
import { useCrud } from '@/hooks'
import { useTeachClassSubmitApi } from '@/api/teach/class'
import { ElMessage } from 'element-plus'
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		classId: 0,
		page: 1,
		limit: 100
	},
	createdIsNeed: false,
	isPage: false
})
const dataForm = reactive({
	id: 0,
	nextLesson: 0
})
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const init = (classId: number, lessonId: number) => {
	console.log(classId, lessonId)
	visible.value = true
	dataForm.id = classId
	state.queryForm.classId = classId
	dataForm.nextLesson = lessonId
	getDataList()
}
const submitHandle = () => {
	useTeachClassSubmitApi(dataForm).then(res => {
		ElMessage.success('操作成功')
		emit('refreshDataList')
		visible.value = false
	})
}
defineExpose({
	init
})
const { getDataList } = useCrud(state)
</script>
