<template>
	<el-drawer v-model="visible" :title="!dataForm.id ? '新增' : '修改'" size="50%">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-alert :closable="false" style="margin-bottom: 25px" type="info">
				<h1 slot="title" style="color: #242424">基本信息</h1>
			</el-alert>
			<el-form-item label="名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item label="题干" prop="description">
				<WangEditor v-model="dataForm.description" placeholder="请输入..." style="height: 200px; border: 0px"></WangEditor>
			</el-form-item>
			<el-row>
				<el-alert :closable="false" style="margin-bottom: 25px" type="info">
					<h1 slot="title" style="color: #242424">类型限制</h1>
				</el-alert>
				<el-col :span="12">
					<el-form-item label="典型问题" prop="isTypical">
						<fast-select v-model="dataForm.isTypical" dict-type="yes_or_no" placeholder="请选择" clearable></fast-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="建议用时" prop="adviceTime">
						<el-input-number v-model="dataForm.adviceTime" :precision="0" :step="1" />
						<span style="padding-left: 20px; font-size: 15px">(分)</span>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="难度" prop="difficulty">
						<fast-select v-model="dataForm.difficulty" dict-type="problem_difficulty" placeholder="难度"></fast-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="知识点" prop="kpCode">
						<kp-select-tree v-model="dataForm.kpCode" clearable></kp-select-tree>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="参考答案" prop="answer">
				<el-input v-model="dataForm.answer" type="textarea"></el-input>
			</el-form-item>
			<el-alert :closable="false" style="margin-bottom: 25px" type="info">
				<h1 slot="title" style="color: #242424">其他</h1>
			</el-alert>
			<el-form-item label="图片" prop="img">
				<fast-upload-img v-model="dataForm.img" img-width="100px"></fast-upload-img>
			</el-form-item>
			<el-form-item label="来源" prop="source">
				<el-input v-model="dataForm.source" placeholder="来源"></el-input>
			</el-form-item>
			<el-form-item label="提示" prop="tips">
				<el-input v-model="dataForm.tips" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useFillProblemApi, useFillProblemSubmitApi } from '@/api/problem/fillproblem'
import WangEditor from '@/components/wang-editor/index.vue'
import FastUploadImg from '@/components/fast-upload-img/fast-upload-img.vue'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: '',
	name: '',
	description: '',
	source: '',
	tips: '',
	adviceTime: '',
	img: '',
	difficulty: '',
	submitTimes: '',
	correctTimes: '',
	isTypical: '',
	usedNum: '',
	createTime: '',
	updateTime: '',
	operator: '',
	isDeleted: '',
	answer: '',
	status: '',
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
		getFillProblem(id)
	} else {
		dataForm.kpCode = ''
	}
}

const getFillProblem = (id: number) => {
	useFillProblemApi(id).then(res => {
		Object.assign(dataForm, res.data)
		if (dataForm.description.substring(0, 3) !== '<p>') {
			dataForm.description = '<p>' + dataForm.description + '</p>'
		}
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	adviceTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	difficulty: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	isTypical: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useFillProblemSubmitApi(dataForm).then(() => {
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
