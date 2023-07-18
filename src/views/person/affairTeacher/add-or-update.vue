<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
			<el-form-item prop="username" label="账号">
				<el-input v-model="dataForm.username" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item prop="mobile" label="手机号">
				<el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item prop="realName" label="姓名">
				<el-input v-model="dataForm.realName" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<fast-radio-group v-model="dataForm.gender" dict-type="user_gender"></fast-radio-group>
			</el-form-item>
			<el-form-item prop="roleIdList" label="所属角色">
				<el-select v-model="dataForm.roleIdList" placeholder="所属角色" style="width: 100%" multiple>
					<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
				</el-select>
			</el-form-item>
			<!--      <el-form-item prop="orgId" label="所属机构">-->
			<!--        <el-tree-select v-model="dataForm.orgId" check-strictly :data="orgList" value-key="id"-->
			<!--                        :props="{ label: 'name', children: 'children' }" style="width: 100%" />-->
			<!--      </el-form-item>-->
			<el-form-item prop="email" label="邮箱">
				<el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
			</el-form-item>
			<el-form-item prop="status" label="状态">
				<fast-radio-group v-model="dataForm.status" dict-type="user_status"></fast-radio-group>
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
import { useOrgListApi } from '@/api/sys/orgs'
import { useUserApi, useUserSubmitApi } from '@/api/teach/affairTeacher'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const orgList = ref([])
const dataFormRef = ref()

const roleList = ref([
	{
		id: 1,
		name: '老师'
	},
	{
		id: 3,
		name: '教务'
	},
	{
		id: 4,
		name: '销售'
	}
])

const dataForm = reactive({
	id: '',
	username: '',
	realName: '',
	orgId: 3,
	orgName: '',
	password: '',
	gender: 0,
	email: '',
	mobile: '',
	roleId: null,
	roleIdList: [] as any,
	status: 1,
	totalMoney: 0.0
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	if (id) {
		getUser(id)
	}
}

// 获取信息
const getUser = (id: number) => {
	useUserApi(id).then((res: { data: any }) => {
		Object.assign(dataForm, res.data)
		console.log(dataForm)
	})
}

const dataRules = ref({
	realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	mobile: [
		{ required: true, message: '请输入联系方式', trigger: 'blur' },
		{ min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
		{
			pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
			message: '请输入正确的手机号码'
		}
	],
	email: [
		{
			pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			message: '请输入正确的邮箱地址'
		}
	],
	roleIdList: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	orgId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (dataForm.roleIdList[0] === 1) {
			dataForm.roleIdList.shift()
		}
		console.log(dataForm)
		useUserSubmitApi(dataForm).then(() => {
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
