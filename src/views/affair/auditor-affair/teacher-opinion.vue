<template>
	<el-dialog v-model="visible" title="评价" :close-on-click-modal="false" width="50%">
		<el-card style="margin-bottom: 15px; background-color: #efeeee">
			<p style="margin-bottom: 10px; font-size: large">教师评语：</p>
			<el-input
				v-model="dataForm.teacherOpinion"
				type="textarea"
				resize="none"
				input-style="height: 150px"
				placeholder="在此处填写教师评价反馈"
				style="font-size: 18px; font-family: 'Microsoft YaHei'"
			></el-input>
			<br /><br />
			<p style="margin-bottom: 10px; font-size: large">学生反馈：</p>
			<el-input
				v-model="dataForm.parentOpinion"
				type="textarea"
				input-style="height: 150px"
				placeholder="暂无反馈"
				readonly="true"
				:disabled="true"
				resize="none"
				style="font-size: 18px; font-family: 'Microsoft YaHei'"
			></el-input>
		</el-card>
		<template #footer>
			<el-button v-show="dataForm.teacherOpinion == null" type="primary" @click="submit">确定</el-button>
			<el-button v-show="dataForm.teacherOpinion != null" type="primary" @click="submit">修改</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useEnrollJoinLessonApi, useEnrollupdateOpinionApi } from '@/api/affair/enrollLesson'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)

const dataForm = reactive({
	studentId: 0,
	teacherOpinion: null,
	parentOpinion: null
})

const init = (id: number, teacherOpinion: any, parentOpinion: any) => {
	visible.value = true
	console.log(parentOpinion)
	dataForm.studentId = id
	dataForm.teacherOpinion = teacherOpinion
	dataForm.parentOpinion = parentOpinion
}

const submit = () => {
	if (dataForm.teacherOpinion != null && dataForm.teacherOpinion != '') {
		useEnrollupdateOpinionApi(dataForm).then(res => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	} else {
		ElMessage.error('不能填入空白评语！')
	}
}

defineExpose({
	init
})
</script>
