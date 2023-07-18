<template>
	<div>
		<el-table :data="state.dataList" style="min-height: 300px; max-height: 500px">
			<el-table-column align="center" header-align="center" label="学号" prop="studentNumber" show-overflow-tooltip width="60"> </el-table-column>
			<el-table-column align="center" header-align="center" label="学生姓名" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="系统评价" prop="sysEvaluation"> </el-table-column>
			<el-table-column align="center" header-align="center" label="老师评价" prop="teaEvaluation"> </el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataStudentsListUrl } from '@/api/lessons/attendlog'
import { useCrud } from '@/hooks'

const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const lessonId = ref(props.modelValue)
const state: IHooksOptions = reactive({
	dataListUrl: dataStudentsListUrl,
	queryForm: {
		lessonId: lessonId.value
	},
	isPage: false
})
const { getDataList } = useCrud(state)
const init = () => {
	getDataList()
}
init()

defineExpose({
	init
})
</script>

<style scoped></style>
