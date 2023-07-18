<template>
	<el-dialog v-model="visible" title="引入" :close-on-click-modal="false">
		<el-table v-loading="loading" max-height="400" row-key="id" :data="list" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="username" label="账号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
		</el-table>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useInsertTeacherApi, useInsertTeacherRole, useUserSubmitApi } from '@/api/teach/teacher.ts'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const loading = ref(false)

const init = () => {
	visible.value = true
	multipleSelection.value = []
	loading.value = false
	// 重置表单数据

	getUser()
}
const list = reactive([])
// 获取信息
const getUser = () => {
	loading.value = true
	useInsertTeacherApi().then((res: { data: any }) => {
		Object.assign(list, res.data)

		console.log(list)
		loading.value = false
	})
}
const multipleSelection = ref([])
const selectionChangeHandle = (val: []) => {
	multipleSelection.value = val
	console.log(multipleSelection.value)
}
const dataRules = ref({})

// 表单提交
const submitHandle = () => {
	let userList: number[] = []
	multipleSelection.value.forEach(item => {
		userList.push(item.id)
	})
	console.log(userList)
	useInsertTeacherRole(userList).then((res: any) => {
		console.log(res)
		if (res.code === 0) {
			ElMessage.success('引入成功')
			visible.value = false
		}
	})
}

defineExpose({
	init
})
</script>
