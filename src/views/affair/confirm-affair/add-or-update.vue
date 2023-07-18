<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '核对'" :close-on-click-modal="false">
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px"
			@keyup.enter="submitHandle()">
			<el-form-item label="真实姓名" prop="name">
				<el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
			</el-form-item>
			<el-form-item label="手机号码" prop="phone">
				<el-input v-model="dataForm.phone" placeholder="手机号码" oninput="value=value.replace(/[^\d]/g,'')">
				</el-input>
			</el-form-item>
			<el-form-item label="所在区域" prop="area">
				<elui-china-area-dht v-model="selectedOptions" clearable @change="onChange"></elui-china-area-dht>
			</el-form-item>
			<el-form-item label="详细地址" prop="address">
				<el-input v-model="dataForm.address" placeholder="详细地址"></el-input>
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="dataForm.age" placeholder="年龄" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
			</el-form-item>
			<el-form-item label="年级" prop="grade">
				<fast-select v-model="dataForm.grade" placeholder="年级" dict-type="grade"></fast-select>
			</el-form-item>

			<el-form-item label="意向说明" prop="purpose">
				<el-input v-model="dataForm.purpose" type="textarea" placeholder="意向说明"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" placeholder="备注"></el-input>
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
import { useEnrollUserApi, useEnrollUserSubmitApi } from '@/api/affair/enrolluser'
import { ElMessage } from 'element-plus/es'
import { FormRules } from 'element-plus'
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import FastSelect from '@/components/fast-select/src/fast-select.vue'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataFormRef = ref()

const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
let selectedOptions = ref(['110000', '110100', '110001'])
const onChange = (e: any) => {
	if (e != null) {
		dataForm.area = chinaData[e[0]].label + chinaData[e[1]].label + chinaData[e[2]].label
	}
}
const dataForm = reactive({
	id: '',
	wxName: '',
	realName: '',
	phone: '',
	unionId: '',
	openId: '',
	area: '',
	address: '',
	age: '',
	grade: '',
	purpose: '',
	status: '',
	createTime: '',
	updateTime: '',
	loginTime: '',
	startNumber: '',
	endNumber: '',
	remark: '',
	integral: '',
	balance: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getEnrollUser(id)
	}
}

const getEnrollUser = (id: number) => {
	useEnrollUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = reactive<FormRules>({
	name: [
		{
			required: true,
			message: '请输入真实姓名',
			trigger: 'blur'
		}
	],
	age: [
		{
			required: true,
			message: '请输入一个整数',
			trigger: 'blur'
		}
	],
	phone: [
		{ required: true, message: '请输入联系方式', trigger: 'blur' },
		{ min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
		{
			pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
			message: '请输入正确的手机号码'
		}
	],
	address: [
		{
			required: true,
			message: '请输入详细地址',
			trigger: 'blur'
		}
	],
	purpose: [
		{
			required: true,
			message: '请输入意向说明',
			trigger: 'blur'
		}
	],
	remark: [
		{
			required: true,
			message: '请输入备注',
			trigger: 'blur'
		}
	]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		useEnrollUserSubmitApi(dataForm).then(() => {
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
