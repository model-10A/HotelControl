<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增题解' : '修改题解'" width="1200px">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules">
			<el-form-item prop="title">
				<h3>标题</h3>
				<el-input v-model="dataForm.title" placeholder="标题"></el-input>
			</el-form-item>
			<el-form-item prop="content">
				<h3>内容</h3>
				<WangEditor v-model="dataForm.content" placeholder="请输入..." style="height: 200px; border: 0px"></WangEditor>
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
import WangEditor from '@/components/wang-editor/index.vue'
import { useCodeProblemApi, useCodeProblemSubmitApi } from '@/api/problem/codeproblem'
import FastUploadImg from '@/components/fast-upload-img/fast-upload-img.vue'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'
import { getProblemSolving, useProblemExplanationSubmitApi } from '@/api/problem/problemExplanation'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	title: '',
	content: '',
	problemId: 0,
	problemType: 0
})

const init = (id?: number, problemId: number, problemType: number) => {
	visible.value = true
	dataForm.id = ''
	dataForm.problemId = problemId
	dataForm.problemType = problemType
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getCodeProblem(id)
	} else {
		dataForm.title = ''
		dataForm.content = ''
	}
}

const getCodeProblem = (id: number) => {
	getProblemSolving(id).then(res => {
		Object.assign(dataForm, res.data)
		if (dataForm.content.substring(0, 3) !== '<p>') {
			dataForm.content = '<p>' + dataForm.content + '</p>'
		}
	})
}

const dataRules = ref({
	title: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		console.log(dataForm)
		useProblemExplanationSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
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
