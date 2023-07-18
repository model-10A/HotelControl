<template>
	<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
		<el-form-item>
			<el-select v-model="state.queryForm.type" placeholder="练习类型" @change="getDataList()">
				<el-option :value="0" label="预习作业"></el-option>
				<el-option :value="1" label="课堂习题"></el-option>
				<el-option :value="2" label="作业列表"></el-option>
			</el-select>
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="getDataList()">刷新</el-button>
		</el-form-item>
	</el-form>
	<el-table
		v-loading="state.dataListLoading"
		:data="state.dataList"
		border
		max-height="700"
		style="width: 100%"
		@selection-change="selectionChangeHandle"
	>
		<el-table-column align="center" header-align="center" label="问题编号" prop="problemId" width="100"> </el-table-column>
		<el-table-column align="center" header-align="center" label="问题名称" prop="problemName" show-overflow-tooltip></el-table-column>
		<fast-table-column
			align="center"
			dict-type="problem_type"
			header-align="center"
			label="问题类型"
			prop="problemType"
			width="100"
		></fast-table-column>
		<fast-table-column
			align="center"
			dict-type="teachItem-paperType"
			header-align="center"
			label="练习类型"
			prop="type"
			width="100"
		></fast-table-column>
		<el-table-column v-if="state.queryForm.type === 1" align="center" header-align="center" label="开始时间" prop="beginTime"></el-table-column>
		<el-table-column v-if="state.queryForm.type === 1" align="center" header-align="center" label="时长0" prop="endTime"></el-table-column>
		<el-table-column
			v-if="state.queryForm.type === 2 || state.queryForm.type === 1"
			align="center"
			header-align="center"
			label="是否启用"
			prop="problemId"
			width="100"
		>
			<template #default="scope">
				<span v-if="scope.row.used === 1">是</span>
        <span v-else>否</span>
			</template>
		</el-table-column>
		<el-table-column align="center" fixed="right" header-align="center" label="操作" width="300">
			<template #default="scope">
				<el-button size="small" type="text" @click="problemRecordHandle(scope.row)">详细信息</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--  完成情况-->
	<problem-record ref="problemRecordRef"></problem-record>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import {  reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl, useLessonProblemApi, useUpdateLessonProblemApi } from '@/api/lessons/problem'
import ProblemRecord from './problem-record.vue'
import moment from 'moment'

const props = defineProps({
	modelValue: {
		type: String,
		required: true
	}
})
const lessonId = ref(props.modelValue)
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		lessonId: lessonId.value,
		type: null
	},
	isPage: false,
	createdIsNeed: false
})


const problemRecordRef = ref()
const problemRecordHandle = (row: any) => {
	problemRecordRef.value.init(row.problemId, row.problemType, row.type, lessonId.value)
}
const init = async (item: any) => {
	let nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	console.log(item.beginTime)
	if (nowTime < item.beginTime) {
		state.queryForm.type = 1
	} else if (nowTime >= item.beginTime && nowTime <= item.endTime) {
		state.queryForm.type = 1
	} else {
		state.queryForm.type = 2
	}
	getDataList()
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
defineExpose({
	init
})
</script>

<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
	margin-left: 15px;
}
</style>
