<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" width="70%">
		<el-button type="primary" style="margin-bottom: 15px" @click="addHandle()">新增</el-button>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="name" label="课程名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="任课老师" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="planItemName" label="教学日历名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="beginTime" label="开课时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endTime" label="结课时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button type="text" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.pageIndex"
			:page-sizes="state.pageSizes"
			:page-size="state.pageSize"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<template #footer>
			<el-button @click="submit">确定</el-button>
		</template>
		<add-lesson ref="addLesson" @refreshDataList="getDataList"></add-lesson>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import AddLesson from '@/views/affair/auditor-affair/add-lesson.vue'
import { dataListUrl } from '@/api/affair/enrollLesson'
import { deleteUrl } from '@/api/lessons/lesson'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		classId: 0
	}
})
const init = (id?: number) => {
	visible.value = true
	console.log(state.dataList)
}

const addLesson = ref()
const addHandle = (id?: number) => {
	console.log(id)
	addLesson.value.init(id)
}
const dataRules = ref({})

const submit = () => {
	visible.value = false
	emit('refreshDataList')
}

defineExpose({
	init
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
