<template>
	<div>
		<el-table :data="state.dataList" style="min-height: 300px; max-height: 500px">
			<el-table-column align="center" header-align="center" label="学号" prop="studentNumber" show-overflow-tooltip width="60"> </el-table-column>
			<el-table-column align="center" header-align="center" label="学生姓名" prop="name"></el-table-column>
			<el-table-column label="学生等级" prop="ability" show-overflow-tooltip>
				<template #default="scope">
					<span>{{ scope.row.ability }} | {{ scope.row.abilityItem == null ? '无' : scope.row.abilityItem }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="请假" width="60px">
				<template #default="scope">
					<span v-if="scope.row.status !== 0">否</span>
					<span v-else-if="scope.row.status === 0">是</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="签到" prop="status">
				<template #default="scope">
					<el-tag v-show="scope.row.status === -1" type="danger">未签到</el-tag>
					<el-tag v-show="scope.row.status === 0" type="warning">请假</el-tag>
					<el-tag v-show="scope.row.status === 1" type="success">签到</el-tag>
					<el-tag v-show="scope.row.status === 2">迟到</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="点名状态" prop="">
				<template #default="scope">
					<span v-if="scope.row.rollCall !== 0">是</span>
					<span v-else-if="scope.row.rollCall === 0">否</span>
				</template>
			</el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="300px">
				<template #default="scope">
					<el-button v-show="scope.row.rollCall === 0" size="small" type="text" @click="callStudentsHandle(scope.row, false)">点名</el-button>
					<el-button v-show="scope.row.rollCall === 1" size="small" type="text" @click="cancelCallStudentsHandle(scope.row, false)"
						>取消点名</el-button
					>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataStudentsListUrl, updateStudentsApi } from '@/api/lessons/attendlog'
import { useCrud } from '@/hooks'
import { ElMessage, ElMessageBox } from 'element-plus'

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
				})
			})
			.catch(() => {})
	} else {
		data.rollCall = 1
		data.status = 1
		updateStudentsApi(data).then(res => {
			ElMessage.success('操作成功！')
		})
	}
}

defineExpose({
	init
})
</script>

<style scoped></style>
