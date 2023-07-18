<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="!dataForm.id ? '新增' : '修改'">
		<el-form
			ref="dataFormRef"
			:model="dataForm"
			:rules="dataRules"
			label-width="100px"
			style="max-height: 60vh; overflow: auto"
			@keyup.enter="submitHandle()"
		>
			<el-form-item label="试卷名称" prop="name">
				<el-input v-model="dataForm.name" placeholder=""></el-input>
			</el-form-item>
			<el-form-item label="知识点" prop="kpCode">
				<kp-select-tree v-model="dataForm.kpCode" clearable></kp-select-tree>
			</el-form-item>
			<el-form-item label="说明" prop="description">
				<el-input v-model="dataForm.description" type="textarea"></el-input>
			</el-form-item>
			<el-form-item label="难度" prop="difficulty">
				<fast-select v-model="dataForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度"></fast-select>
			</el-form-item>
			<el-form-item label="题目数量" prop="problemNum">
				<el-input v-model="dataForm.problemNum" disabled placeholder="题目数量"></el-input>
			</el-form-item>
			<el-form-item label="总分" prop="score">
				<el-input v-model="dataForm.score" disabled placeholder="总分"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useProblemPaperApi, useProblemPaperSubmitApi } from '@/api/problem/paper'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	difficulty: '',
	problemNum: '',
	score: '',
	description: '',
	createTime: '',
	updateTime: '',
	status: '',
	deleted: '',
	updater: '',
	creator: '',
	version: '',
	kpCode: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getProblemPaper(id)
	}
}

const getProblemPaper = (id: number) => {
	useProblemPaperApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	difficulty: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		useProblemPaperSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					dataFormRef.value.resetFields()
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
