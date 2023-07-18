<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" width="70%">
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="realName" label="任课老师" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="name" label="课程名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="planItemName" label="教学日历名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="beginTime" label="开课时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endTime" label="结课时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button type="text" size="small" @click="addHandle(scope.row.id)">加入</el-button>
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
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { useEnrollJoinLessonApi } from '@/api/affair/enrollLesson'
import { dataListUrl, deleteUrl } from '@/api/affair/enrollLesson'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl
})
const data = reactive({
	tryLesson: '',
	id: ''
})
const init = (id?: any) => {
	getDataList()
	visible.value = true
	data.id = id
}

const addHandle = (id: any) => {
	data.tryLesson = id
	console.log(data.id)
	console.log(data)
	useEnrollJoinLessonApi(data).then(res => {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				visible.value = false
				emit('refreshDataList')
			}
		})
	})
}
const dataRules = ref({})

defineExpose({
	init
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
