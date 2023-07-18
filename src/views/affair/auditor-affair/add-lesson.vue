<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" width="70%">
		<el-card>
			<el-steps :active="active" align-center finish-status="success" style="margin: 30px 0">
				<el-step title="选择教学计划"></el-step>
				<el-step title="填写相关信息"></el-step>
			</el-steps>

			<el-card :bordered="false" style="margin-top: 5px">
				<!--				<step1 v-show="active === 1" ref="step1Ref"></step1>-->
				<!--				<step2 v-show="active === 2" ref="step2Ref"></step2>-->
				<step1 v-show="active === 1" ref="step1Ref"></step1>
				<step2 v-show="active === 2" ref="step2Ref"></step2>
				<div style="margin-top: 10px; text-align: center">
					<el-button v-show="active > 1" style="margin-right: 10px" type="primary" @click="previous">上一步</el-button>
					<el-button v-show="active < 2" style="margin-left: 10px" type="primary" @click="next">下一步</el-button>
					<el-button v-show="active == 2" style="margin-left: 10px" type="primary" @click="finish">完成</el-button>
				</div>
			</el-card>
		</el-card>
	</el-dialog>
</template>
<script setup lang="ts">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useRouter } from 'vue-router'
import { useEnrollLessonApi, useEnrollLessonSubmitApi } from '@/api/affair/enrollLesson'
import Step1 from '@/views/affair/auditor-affair/step/step1.vue'
import Step2 from '@/views/affair/auditor-affair/step/step2.vue'
import { ElMessage } from 'element-plus'
const state: IHooksOptions = reactive({})
const step1Ref = ref()
const step2Ref = ref()
const step3Ref = ref()
const plan = ref(null)
const userList = ref()
const active = ref(1)
const dataFormRef = ref()
const emit = defineEmits(['refreshDataList'])
let dataForm = reactive({
	id: '',
	teacherId: '',
	planItemId: '',
	realName: '',
	name: '',
	place: '',
	beginTime: '',
	endTime: ''
})
const getEnrollLesson = (id: number) => {
	useEnrollLessonApi(id).then((res: { data: any }) => {
		Object.assign(dataForm, res.data)
		console.log(dataForm)
	})
}
const visible = ref(false)
const init = (id?: number) => {
	visible.value = true

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getEnrollLesson(id)
	}
}
//下一步
const next = () => {
	if (active.value == 1) {
		plan.value = step1Ref.value.change(plan.value)
		console.log(plan.value)
		if (plan.value != null) {
			dataForm.planItemId = plan.value
			active.value++
		}
	}
}
//上一步
const previous = () => {
	console.log(active.value)
	active.value--
}
const router = useRouter()
const submitHandle = () => {
	useEnrollLessonSubmitApi(dataForm).then(() => {
		ElMessage.success({
			message: '操作成功',
			duration: 500,
			onClose: () => {
				// goto()
			}
		})
	})
}
//完成
const finish = () => {
	console.log('完成')
	dataForm = step2Ref.value.change(dataForm.planItemId)
	if (dataForm.place != '' && dataForm.name != '' && dataForm.beginTime != '' && dataForm.endTime != '' && dataForm.teacherId != '') {
		submitHandle()
		emit('refreshDataList')
		visible.value = false
	} else {
		ElMessage.error('请填写所有选项！')
	}
}
defineExpose({
	init
})
</script>
