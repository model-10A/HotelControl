<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
	    				<el-form-item label="名称" prop="name">
					<el-input v-model="dataForm.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="description">
					<el-input v-model="dataForm.description" type="textarea" placeholder="说明"></el-input>
				</el-form-item>
					<el-form-item label="难度" prop="difficulty">
            <fast-select v-model="dataForm.difficulty" dict-type="problem_difficulty" placeholder="难度"></fast-select>
					</el-form-item>
<!--				<el-form-item label="课次" prop="lessonNum">-->
<!--          <el-input-number  v-model="dataForm.lessonNum" :precision="0" :step="1" min="1" />-->
<!--				</el-form-item>-->
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useTeachPlanApi, useTeachPlanSubmitApi } from '@/api/teach/teachplan.ts'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataRules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description:[{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  lessonNum:[ ],
  createTime:[],
})

const dataForm = reactive({
	id: '',
	name: '',
	description: '',
	difficulty: '',
	lessonNum: 0,
	usedNum: '',
	createTime: '',
	updateTime: '',
	status: '',
	deleted: '',
	creator: '',
	updater: '',
	version: '',
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
  console.log(dataForm);
	if (id) {
		getTeachPlan(id)
	}else{
    dataForm.lessonNum=0;
    dataForm.createTime=''
  }
}

const getTeachPlan = (id: number) => {
	useTeachPlanApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}


// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useTeachPlanSubmitApi(dataForm).then(() => {
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
