<template>
	<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
		<el-form-item>
			<el-select v-model="state.queryForm.type" placeholder="练习类型" @change="getDataList()">
				<!--				<el-option :value="null" label="全部"></el-option>-->
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
		<!--		<el-table-column prop="score" label="分数" header-align="center" align="center"></el-table-column>-->
		<el-table-column v-if="state.queryForm.type === 1" align="center" header-align="center" label="开始时间" prop="beginTime"></el-table-column>
		<el-table-column v-if="state.queryForm.type === 1" align="center" header-align="center" label="时长">
			<template #default="scope">
				{{
					dayjs(new Date(scope.row.endTime)).diff(dayjs(new Date(scope.row.beginTime)), 'minutes') != 0
						? dayjs(new Date(scope.row.endTime)).diff(dayjs(new Date(scope.row.beginTime)), 'minutes')
						: ''
				}}
			</template>
		</el-table-column>
		<el-table-column
			v-if="state.queryForm.type === 2 || state.queryForm.type === 1"
			align="center"
			header-align="center"
			label="是否启用"
			prop="problemId"
			width="100"
		>
			<template #default="scope">
				<el-switch
					v-model="scope.row.used"
					:active-value="1"
					:inactive-value="0"
					active-text="是"
					inactive-text=" 否"
					inline-prompt
					@change="updateUsed(scope.row)"
				/>
			</template>
		</el-table-column>
		<el-table-column align="center" fixed="right" header-align="center" label="操作" width="300">
			<template #default="scope">
				<el-button size="small" type="text" @click="problemRecordHandle(scope.row)">讲题</el-button>
				<el-button v-if="scope.row.type === 1" size="small" type="text" @click="addOrUpdateHandle(scope.row)">发布</el-button>
				<el-dropdown trigger="click">
					<el-button class="el-dropdown-link" link size="small" type="primary">更多</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="joinHomeWorkHandle(scope.row)">加入作业</el-dropdown-item>
							<el-dropdown-item @click="deleteBatchHandle(scope.row.id)">删除</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</template>
		</el-table-column>
	</el-table>
	<!--修改 -->
	<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	<!--  完成情况-->
	<problem-record ref="problemRecordRef"></problem-record>
	<!--发布课后作业-->
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useCrud } from '@/hooks'
import { inject, reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl, useLessonProblemApi, useUpdateLessonProblemApi } from '@/api/lessons/problem'
import ProblemRecord from '@/views/classroom/lesson/teacher/lesson-problem/problem-record.vue'

import { ElMessage } from 'element-plus'
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
		type: 1
	},
	isPage: false,
	createdIsNeed: false
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (row: number) => {
	addOrUpdateRef.value.init(row)
}

const problemRecordRef = ref()
const problemRecordHandle = (row: any) => {
	problemRecordRef.value.init(row.problemId, row.problemType, row.type, lessonId.value)
}

const joinHomeWorkHandle = (row: any) => {
	let item = JSON.parse(JSON.stringify(row))
	item.type = 2
	item.id = ''
	useLessonProblemApi(item).then(res => {
		ElMessage.success('添加成功！')
	})
}
const updateUsed = (item: any) => {
	// item.used = 1 - item.used
	let data: any[] = []
	data = [item]
	useUpdateLessonProblemApi(data)
}
const init = async (item: any) => {
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
