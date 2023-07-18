<template>
	<el-dialog v-model="visible" title="消息群发" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">    				
			<el-form-item label="内容" prop="content">
				<el-input v-model="dataForm.content" placeholder="内容" type="textarea" :rows="2"></el-input>
			</el-form-item>
			<el-form-item label="接收人员" prop="person">
				<el-select v-model="dataForm.person" placeholder="接收人员">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>			
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
import {useSendBatchMessageApi} from '@/api/teach/wxmsglog'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	content:'',
	person:''
})

const options = [
	{
		value:'1',
		label:'学生'
	},
	{
		value:'2',
		label:'老师'
	},
	{
		value:'3',
		label:'所有人'
	}
]
const init = (id?: number) => {
	visible.value = true
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}	
}



const dataRules = ref({
	content: [
		{ required: true, message: '请输入内容', trigger: 'blur' },		
	],
    person: [
		{ required: true, message: '请选择接收人员', trigger: 'blur' },		
	],
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate(async(valid: boolean) => {
		if (!valid) {
			return false
		}
		//调用发送消息接口
		const data = await useSendBatchMessageApi(dataForm)
		console.log(data)
	})
}

defineExpose({
	init
})
</script>
