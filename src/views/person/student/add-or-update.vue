<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
      <el-alert :closable="false" style="margin-bottom: 25px" type="info">
        <h1 slot="title" style="color: #242424">基本信息</h1>
      </el-alert>
			<el-form-item prop="username" label="账户">
				<el-input v-model="dataForm.username" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item prop="realName" label="真实姓名">
				<el-input v-model="dataForm.realName" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item prop="orgId" label="所属机构">
				<org-select-tree v-model="dataForm.orgId" placeholder="机构名称" clearable @changeIt="changeIt"></org-select-tree>
			</el-form-item>
			<el-form-item prop="gender" label="性别">
				<fast-radio-group v-model="dataForm.gender" dict-type="user_gender"></fast-radio-group>
			</el-form-item>
			<el-form-item prop="mobile" label="手机号">
				<el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
			</el-form-item>
			<el-form-item prop="email" label="邮箱">
				<el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
			</el-form-item>
			<el-form-item label="所在区域" prop="area">
        <el-select v-model="dataForm.area" placeholder="请选择居住地">
          <el-option value="浙江省宁波市鄞州区" label="浙江省宁波市鄞州区">鄞州区</el-option>
          <el-option value="浙江省宁波市海曙区" label="浙江省宁波市海曙区">海曙区</el-option>
          <el-option value="浙江省宁波市江北区" label="浙江省宁波市江北区">江北区</el-option>
          <el-option value="浙江省宁波市北仑区" label="浙江省宁波市北仑区">北仑区</el-option>
        </el-select>
			</el-form-item>

			<el-form-item prop="address" label="地址">
				<el-input v-model="dataForm.address" placeholder="地址"></el-input>
			</el-form-item>
			<el-form-item prop="age" label="年龄">
				<el-input v-model="dataForm.age" placeholder="年龄" type="number"></el-input>
			</el-form-item>
			<el-form-item prop="grade" label="年级">
				<fast-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></fast-select>
			</el-form-item>
			<el-form-item prop="integral" label="积分">
				<el-input v-model="dataForm.integral" placeholder="积分"></el-input>
			</el-form-item>
<!--			<el-form-item prop="balance" label="余额">-->
<!--				<el-input v-model="dataForm.balance" placeholder="余额"></el-input>-->
<!--			</el-form-item>-->
			<!-- <el-form-item prop="password" label="密码">
				<el-input v-model="dataForm.password" type="password" placeholder="密码" show-password></el-input>
			</el-form-item> -->
			<!-- <el-form-item prop="roleIdList" label="所属角色">
				<el-select v-model="dataForm.roleIdList" multiple placeholder="所属角色" style="width: 100%">
					<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
				</el-select>
			</el-form-item> -->
			<!-- <el-form-item prop="postIdList" label="所属岗位">
				<el-select v-model="dataForm.postIdList" multiple placeholder="所属岗位" style="width: 100%">
					<el-option v-for="post in postList" :key="post.id" :label="post.postName" :value="post.id"></el-option>
				</el-select>
			</el-form-item> -->
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
import OrgSelectTree from '@/components/org-select-tree'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useOrgListApi } from '@/api/sys/orgs'
import { useUserApi, useUserSubmitApi } from '@/api/teach/student'
import { useRoleListApi } from '@/api/sys/role'
import { EluiChinaAreaDht } from 'elui-china-area-dht'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const postList = ref<any[]>([])
const roleList = ref<any[]>([])
const orgList = ref([])
const dataFormRef = ref()
const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
// let selectedOptions = ref(['330000', '330200', '330203'])
const onChange = (e: any) => {
	console.log(e)
}
const dataForm = reactive({
	id: '',
	username: '',
	realName: '',
	orgId: '',
	orgName: '',
	password: '123456',
	gender: 0,
	email: '',
	mobile: '',
	roleIdList: [2],
	// postIdList: [] as any[],
	status: 1,
	address: '',
	age: '',
	grade: '',
	integral: '',
	balance: '',
	list: [],
	city: '',
	province: '',
	district: '',
	area: ''
})

const init = (id?: number) => {
	dataForm.id = ''
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	visible.value = true
	// id 存在则为修改
	if (id) {
		getUser(id)
	}
	// getOrgList()
	//getPostList()
}

const changeIt = (orgArr: []) => {
	if (orgArr.length > 0) {
		console.log(orgArr[0])
		dataForm.orgId = orgArr[0]
	} else {
		dataForm.orgId = ''
	}
	console.log(dataForm.orgId)
}

// // 获取岗位列表
// const getPostList = () => {
// 	return usePostListApi().then(res => {
// 		postList.value = res.data
// 	})
// }

// 获取角色列表
const getRoleList = () => {
	return useRoleListApi().then(res => {
		roleList.value = res.data
	})
}

// 获取机构列表
const getOrgList = () => {
	return useOrgListApi().then(res => {
		orgList.value = res.data
	})
}

// 获取信息
const getUser = (id: number) => {
	useUserApi(id).then(res => {
		Object.assign(dataForm, res.data)
		const listAddr = [] //这里需要重新定义新数组再赋值否则页面不显示
		listAddr.push(dataForm.province) //后台省市区三个字段存值
		listAddr.push(dataForm.city)
		listAddr.push(dataForm.district)
		dataForm.list = listAddr
	})
}

const dataRules = ref({
	username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
	realName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }],
	mobile: [
		{ required: true, message: '请填写手机号码', trigger: 'blur' },
		{
			pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
			message: '请输入正确的手机号码'
		}
	],
	orgId: [{ required: true, message: '请填写所属机构', trigger: 'blur' }],
	roleIdList: [{ required: true, message: '请填写所属角色', trigger: 'blur' }],
	email: [
		{
			pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			message: '请输入正确的邮箱地址'
		}
	],
	password: [
		{ required: true, message: '请填写密码', trigger: 'blur' },
		{ min: 5, max: 15, message: '请输入5到15位的密码', trigger: 'blur' }
	],
	// area: [{ required: true, message: '请选择区域', trigger: 'blur' }],
	grade: [{ required: true, message: '请选择年级', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	// dataForm.username = dataForm.mobile

	console.log('前', dataForm)

	if (dataForm.list.length === 0 || dataForm.list[1] == '') {
		dataForm.area = ''
		dataForm.province = ''
		dataForm.city = ''
		dataForm.district = ''
	} else {
		dataForm.province = dataForm.list[0]
		dataForm.city = dataForm.list[1]
		dataForm.district = dataForm.list[2]
		dataForm.area = chinaData[dataForm.list[0]].label + chinaData[dataForm.list[1]].label + chinaData[dataForm.list[2]].label
	}
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			console.log(valid)
			return valid
		}
		console.log('后', dataForm)

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
