<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="点名" width="60%">
		<el-card>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" :max-height="400">
				<el-table-column align="center" header-align="center" label="序号">
					<template #default="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="学生姓名" prop="name"></el-table-column>
				<el-table-column align="center" header-align="center" label="课堂状态" prop="status">
					<template #default="scope">
						<el-tag v-show="scope.row.status === -1" type="danger">未签到</el-tag>
						<el-tag v-show="scope.row.status === 0" type="warning">请假</el-tag>
						<el-tag v-show="scope.row.status === 1" type="success">签到</el-tag>
						<el-tag v-show="scope.row.status === 2">迟到</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="签到时间" prop="checkinTime" width="200px"></el-table-column>
				<el-table-column align="center" header-align="center" label="是否点名" width="100px">
					<template #default="scope">
						<span v-if="scope.row.rollCall === 0">否</span>
						<span v-else-if="scope.row.rollCall !== 0">是</span>
					</template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="是否请假" width="100px">
					<template #default="scope">
						<span v-if="scope.row.status !== 0">否</span>
						<span v-else-if="scope.row.status === 0">是</span>
					</template>
				</el-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="200px">
					<template #default="scope">
						<el-button v-show="scope.row.rollCall === 0" size="small" type="text" @click="callStudentsHandle(scope.row, false)">点名</el-button>
						<el-button v-show="scope.row.rollCall === 1" size="small" type="text" @click="cancelCallStudentsHandle(scope.row, false)"
							>取消点名</el-button
						>
						<el-button v-show="scope.row.status === 0" size="small" type="text" @click="cancelCallStudentsHandle(scope.row, true)"
							>取消请假</el-button
						>
						<el-button v-show="scope.row.status !== 0" size="small" type="text" @click="callStudentsHandle(scope.row, true)">请假</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</el-dialog>
</template>

<script lang="ts" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { useCrud } from '@/hooks'
import { updateStudentsApi, dataStudentsListUrl } from '@/api/lessons/attendlog'
import { ElMessage, ElMessageBox } from 'element-plus'
const visible = ref(false)
const lessonId = ref()
const state: IHooksOptions = reactive({
	dataListUrl: dataStudentsListUrl,
	queryForm: {
		lessonId: 0
	},
	isPage: false,
	createdIsNeed: false
})

const cancelCallStudentsHandle = (data: any, flag: boolean) => {
	if (flag) {
		data.status = -1
	} else {
		data.rollCall = 0
		data.status = -1
	}
	console.log(data)
	updateStudentsApi(data).then(res => {
		ElMessage.success('操作成功！')
		getDataList()
	})
}

const callStudentsHandle = (data: any, flag: boolean) => {
	if (flag) {
		ElMessageBox.confirm('确定进行请假操作?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				data.status = 0
				updateStudentsApi(data).then(res => {
					ElMessage.success('操作成功！')
					getDataList()
				})
			})
			.catch(() => {})
	} else {
		data.rollCall = 1
		data.status = 1
		updateStudentsApi(data).then(res => {
			ElMessage.success('操作成功！')
			getDataList()
		})
	}
}

const init = (id?: number) => {
	visible.value = true
	state.queryForm.lessonId = id
	console.log(state.queryForm.lessonId)
	getDataList()
}

defineExpose({
	init
})

const { getDataList } = useCrud(state)
</script>

<style scoped></style>
