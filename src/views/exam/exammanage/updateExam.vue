<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="修改" width="800px">
		<el-form ref="dataFormRef" :model="data.dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-form-item label="考试名称" prop="name">
				<el-col :span="20">
					<el-input v-model="data.dataForm.name" placeholder="考试名称"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="开始时间" prop="beginTime">
				<el-date-picker
					v-model="data.dataForm.beginTime"
					:disabled="disabled"
					:disabled-date="disabledDate"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					@blur="dateChange()"
				/>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime">
				<el-date-picker
					v-model="data.dataForm.endTime"
					:disabled-date="disabledDate"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					@blur="dateChange()"
				/>
			</el-form-item>
			<el-form-item label="考试时长" prop="timeLimit">
				<el-col :span="20">
					<el-input v-model.number="data.dataForm.timeLimit" :max="12" :min="1" placeholder="考试时长（分钟）" type="text"> </el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="考试班级" prop="className">
				<el-col :span="20">
					<el-input v-model="data.dataForm.className" disabled></el-input>
				</el-col>
			</el-form-item>

			<el-form-item label="考试地点" prop="place">
				<el-col :span="20">
					<el-input v-model="data.dataForm.place" placeholder="考试地点"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="考试说明" prop="description">
				<el-col :span="20">
					<el-input v-model="data.dataForm.description" placeholder="考试说明" type="textarea"></el-input>
				</el-col>
			</el-form-item>
		</el-form>
		<template #footer>
			<div>
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="submitHandle()">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'
import dayjs from 'dayjs'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'
import moment from 'moment'
import { useExamSubmitApi } from '@/api/lessons/exam'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const disabled = ref(false)

const data = reactive({
	dataForm: {
		id: '',
		name: '',
		classListName: [],
		className: '',
		place: '',
		description: '',
		beginTime: '',
		endTime: '',
		kpCode: '',
		classId: '',
		problemNum: '',
		paperId: '',
		score: '',
		timeLimit: null as any
	}
})

const init = (item: any) => {
	visible.value = true
	data.dataForm = item
	if (data.dataForm.classListName.length > 0) {
		data.dataForm.className = data.dataForm.classListName.join('、')
	}
	if (data.dataForm.beginTime < moment(new Date()).format('YYYY-MM-DD HH:mm:ss')) {
		disabled.value = true
	} else {
		disabled.value = false
	}
}

const checkTimeLimit = (rule: any, value: any, callback: any) => {
	if (value > dayjs(new Date(data.dataForm.endTime)).diff(dayjs(new Date(data.dataForm.beginTime)), 'minutes')) {
		callback(new Error('时间限制不得超出时间范围'))
	} else {
		callback()
	}
}

const checkBeginTime = (rule: any, value: any, callback: any) => {
	if (data.dataForm.endTime != '') {
		if (value >= data.dataForm.endTime) {
			callback(new Error('开始时间不得大于结束时间'))
		} else {
			callback()
		}
	} else {
		callback()
	}
}
const dataFormRef = ref()
const checkEndTime = (rule: any, value: any, callback: any) => {
	if (data.dataForm.beginTime != '') {
		if (value <= data.dataForm.beginTime) {
			callback(new Error('结束时间不得小于开始时间'))
		} else {
			callback()
		}
	} else {
		callback()
	}
}

const dataRules = ref({
	beginTime: [
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
		{ validator: checkBeginTime, trigger: 'blur' }
	],
	endTime: [
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
		{ validator: checkEndTime, trigger: 'blur' }
	],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	timeLimit: [
		{ required: true, message: '必填项不能为空' },
		{ type: 'number', message: '请填写数字' },
		{ validator: checkTimeLimit, trigger: 'blur' }
	],
	classId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

const dateChange = () => {
	if (data.dataForm.endTime != '' && data.dataForm.beginTime != '') {
		data.dataForm.timeLimit = dayjs(new Date(data.dataForm.endTime)).diff(dayjs(new Date(data.dataForm.beginTime)), 'minutes')
	}
}

const disabledDate = (time: Record<string, any>): boolean => {
	return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		useExamSubmitApi(data.dataForm).then(() => {
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

<style scoped></style>
