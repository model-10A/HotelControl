<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="考试邀请码" width="30%">
		<el-form :model="dataForm" label-width="100px" size="large">
			<el-form-item label="邀请码">
				<el-input v-model="dataForm.code" disabled style="width: 250px">
					<template #append>
						<el-button type="primary" @click="getCode()">生成邀请码</el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="有效时长">
				<el-input-number v-model="dataForm.time" :min="0" :precision="0" />
			</el-form-item>
			<el-form-item v-show="dataForm.flag" label="距离过期">
				<count-down ref="examCountDownRef" style="color: red"></count-down>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
			<el-button @click="visible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { genExamInvitationCodeApi } from '@/api/lessons/exam'
import CountDown from '@/components/count-down/count-down.vue'
import moment from 'moment'

const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	examId: 0,
	time: 0,
	code: '',
	dateTime: '',
	flag: false
})

const init = (id: number) => {
	visible.value = true
	dataForm.examId = id
}
const examCountDownRef = ref()

const submitHandle = () => {
	if (dataForm.time > 0 && dataForm.code != '') {
		genExamInvitationCodeApi(dataForm).then((res: any) => {
			ElMessage.success('设置成功！')
			dataForm.flag = true
			let date = new Date()
			date.setMinutes(date.getMinutes() + dataForm.time)
			console.log(moment(date).format('YYYY-MM-DD HH:mm:ss'))
			examCountDownRef.value.init(moment(date).format('YYYY-MM-DD HH:mm:ss'))
		})
		return
	}
	ElMessage.warning('有效时长/邀请码不可为空！')
}
const getCode = () => {
	dataForm.code = ''
	for (var i = 0; i < 6; i++) {
		var type = Math.round(Math.random() * 1 + 1)
		switch (type) {
			case 1:
				dataForm.code += String.fromCharCode(Math.round(Math.random() * 9 + 48)) //数字
				break
			case 2:
				dataForm.code += String.fromCharCode(Math.round(Math.random() * 25 + 65)) //大写字母
				break
		}
	}
}
defineExpose({
	init
})
</script>

<style scoped></style>
