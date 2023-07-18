<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="ip范围" prop="ipRange">
				<el-input v-model="dataForm.ipRange" placeholder="例: 127.1.1.1-128.1.1.1 或 127.1.1.1"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useLessonIpApi, useLessonIpSubmitApi } from '@/api/lessons/lessonip.ts'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	id: 0,
	lessonId: 0,
	ipRange: '',
	remark: ''
})

const init = (lessonId: number, id: number) => {
	visible.value = true
	dataForm.lessonId = lessonId
	dataForm.id = id

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getLessonIp(id)
	}
}

const getLessonIp = (id: number) => {
	useLessonIpApi(id).then((res: any) => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	ipRange: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const testIp = (ip: string) => {
	//判断ip是否满足条件
	const re = /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/
	return re.test(ip)
}

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (!testIp(dataForm.ipRange)) {
			//若未拆分不能通过需要进一步拆分判断
			let split = dataForm.ipRange.split('-', 2)
			console.log(split)
			if (split != []) {
				if (!testIp(split[0]) || !testIp(split[1])) {
					ElMessage.warning('地址格式不正确！')
					return false
				}
			}
		}
		useLessonIpSubmitApi(dataForm).then(() => {
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
