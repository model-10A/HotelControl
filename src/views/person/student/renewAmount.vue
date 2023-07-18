<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" draggable width="70%">
		<div class="gradient"></div>
		<el-card style="box-shadow: silver 0px 1px !important; border-radius: 0px 0px 10px 10px">
			<p style="font-size: 20px; font-weight: bold">缴费登记</p>
		</el-card>
		<el-card style="margin-top: 20px; box-shadow: silver 0px 0px 2px !important; border-radius: 10px">
			<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px" @keyup.enter="submitHandle()">
				<div style="font-size: 16px; font-weight: bold; margin-bottom: 20px; border-left: 4px solid #e5880c; padding-left: 6px">
					基础信息
					<!-- <svg-icon class="arrow" icon="icon-arrowdown"></svg-icon> -->
				</div>
				<div class="main_info">
					<el-row>
						<el-col :span="8">
							<el-form-item prop="realName" label="学生姓名">
								<el-input v-model="dataForm.realName" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="8">
							<el-form-item prop="stuNumber" label="学号">
								<el-input v-model="dataForm.stuNumber" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item prop="balance" label="剩余常规课时">
								<el-input v-model="dataForm.normal" readonly>
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="8">
							<el-form-item prop="balance" label="剩余集训课时">
								<el-input v-model="dataForm.training" readonly>
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item prop="balance" label="赠送常规课时">
								<el-input v-model="dataForm.normalPresent" readonly>
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="8">
							<el-form-item prop="balance" label="赠送集训课时">
								<el-input v-model="dataForm.trainingPresent" readonly>
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item prop="totalMoney" label="累计充值">
								<el-input v-model="dataForm.totalMoney" readonly>
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>

				<div style="font-size: 16px; font-weight: bold; margin-bottom: 20px; margin-top: 35px; border-left: 4px solid #e5880c; padding-left: 6px">
					更多信息
					<!-- <svg-icon class="arrow" icon="icon-arrowdown"></svg-icon> -->
				</div>
				<div class="other_info">
					<el-row>
						<el-col :span="8">
							<el-form-item prop="payment" label="应付金额">
								<el-input v-model="dataForm.payment" placeholder="请输入应付金额" type="number" min="0" @blur="getPayable()">
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"></el-col>
						<el-col :span="8">
							<el-form-item prop="discount" label="优惠金额">
								<el-input v-model="dataForm.discount" placeholder="请输入优惠金额" type="number" min="0" :max="dataForm.payment" @blur="getPayable()">
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="8">
							<el-form-item prop="payable" label="实付金额">
								<el-input v-model="dataForm.payable" disabled placeholder="实付金额" type="number">
									<template #append>元</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="8">
							<el-form-item prop="classHours" label="充值课次">
								<el-input v-model="dataForm.classHours" placeholder="请输入对应课次" type="number" min="0">
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"> </el-col>
						<el-col :span="8">
							<el-form-item prop="classType" label="充值类型">
								<el-switch v-model="dataForm.classType" active-text="集训课程" inactive-text="常规课程" active-value="1" inactive-value="0" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item prop="presentHours" label="赠送课次">
								<el-input v-model="dataForm.presentHours" placeholder="请输入对应课次" type="number" min="0">
									<template #append>时</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"> </el-col>
						<el-col :span="8">
							<el-form-item prop="presentType" label="赠送类型">
								<el-switch v-model="dataForm.presentType" active-text="集训课程" inactive-text="常规课程" active-value="1" inactive-value="0" />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item prop="handler" label="经手人">
								<el-input v-model="dataForm.handler" placeholder="请输入经手人姓名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4"> </el-col>
						<el-col :span="8">
							<el-form-item prop="time" label="缴费时间">
								<el-date-picker v-model="dataForm.time" type="datetime" placeholder="请选择缴费时间" readonly />
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="20">
							<el-form-item prop="bz" label="备注">
								<el-input v-model="dataForm.bz" placeholder="请输入备注" type="textarea"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
			</el-form>
		</el-card>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useUserPayApi } from '@/api/sale/user'
import { ElMessage } from 'element-plus/es'
import { useTeachPaySubmitApi } from '@/api/sale/teachpay'
import moment from 'moment'
import { useUserInfoApi } from '@/api/sys/user'

const emit = defineEmits(['refreshDataList', 'refreshFunnelData'])
const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	totalMoney: 0,
	stuNumber: '',
	realName: '',
	payment: '',
	discount: 0,
	payable: 0,
	classHours: '',
	handler: '',
	time: moment().format('YYYY-MM-DD HH:mm:ss'),
	bz: '',
	training: 0,
	normal: 0,
	normalPresent: 0,
	trainingPresent: 0,
	classType: 0,
	presentType: 0,
	presentHours: 0
})

const init = (id: number) => {
	dataForm.id = ''
	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	visible.value = true
	getUser(id)
	getUserId()
}

// 获取信息
const getUser = (id: number) => {
	useUserPayApi(id).then(res => {
		Object.assign(dataForm, res.data)
		if (dataForm.normal === null) {
			dataForm.normal = 0
		}
		if (dataForm.training === null) {
			dataForm.training = 0
		}
		if (dataForm.normalPresent === null) {
			dataForm.normalPresent = 0
		}
		if (dataForm.trainingPresent === null) {
			dataForm.trainingPresent = 0
		}
		if (dataForm.totalMoney === null) {
			dataForm.totalMoney = 0
		}
	})
}
const checkDiscount = (rule: any, value: any, callback: any) => {
	if (value > Number.parseInt(dataForm.payment)) {
		return callback(new Error('优惠金额不得大于应付金额'))
	} else {
		callback()
	}
}
const dataRules = ref({
	payment: [
		{ required: true, message: '请填写应付金额', trigger: 'blur' },
		{
			pattern: /^\d+(\.{0,1}\d+){0,1}$/,
			message: '请输入正数'
		}
	],
	discount: [
		{ pattern: /^\d+(\.{0,1}\d+){0,1}$/, message: '请输入正数' },
		{ validator: checkDiscount, trigger: 'blur' }
	],
	classHours: [
		{ required: true, message: '请填写购买课次', trigger: 'blur' },
		{ pattern: /^[0-9]+$/, message: '请输入正数' }
	],
	handler: [{ required: true, message: '请填写经手人', trigger: 'blur' }],
	time: [{ required: true, message: '请填写缴费时间', trigger: 'blur' }],
	bz: [{ required: true, message: '请填写备注', trigger: 'blur' }],
	presentHours: [{ pattern: /^[0-9]+$/, message: '请输入正数' }]
})
const getPayable = () => {
	dataForm.payable = Number.parseInt(dataForm.payment) - dataForm.discount
}

const getUserId = async () => {
	const { data: data } = await useUserInfoApi()
	console.log(data)
	dataForm.handler = data.realName
}
// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			console.log(valid)
			return valid
		}
		let obj = {
			userId: dataForm.userId,
			payment: dataForm.payment,
			discount: dataForm.discount,
			payable: dataForm.payable,
			classType: dataForm.classType,
			presentType: dataForm.presentType,
			classHours: dataForm.classHours,
			presentHours: dataForm.presentHours,
			handler: dataForm.handler,
			time: dataForm.time,
			bz: dataForm.bz,
			status: 0
		}
		console.log(obj)
		useTeachPaySubmitApi(obj).then(res => {
			if (res.msg === 'success') {
				ElMessage.success({
					message: '缴费成功',
					duration: 500,
					onClose: () => {
						visible.value = false
						emit('refreshDataList')
						emit('refreshFunnelData')
					}
				})
			}
		})
	})
}

defineExpose({
	init
})
</script>
<style scoped>
.gradient {
	width: 100%;
	height: 30px;
	background-image: linear-gradient(#c8f9ff, #b5b9eb);
	border-radius: 5px 5px 0 0;
	transform: translateY(4px);
	z-index: -999;
}
</style>
