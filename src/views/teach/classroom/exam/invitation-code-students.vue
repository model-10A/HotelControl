<template>
	<el-dialog v-model="visible" width="400px" title="考试邀请码" :close-on-click-modal="false">
		<el-form ref="dataFormRef" style="text-align: center" :model="dataForm" label-width="100px">
			<el-form-item label="邀请码" prop="place">
				<el-input v-model="dataForm.code" style="width: 200px" />
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
import { useLessonApi, useLessonSubmitApi } from '@/api/lessons/lesson'
import moment from 'moment'
import { receiveExamInvitationApi } from '@/api/lessons/exam'
const visible = ref(false)
const dataFormRef = ref()

const dataForm = reactive({
	code: ''
})

const init = () => {
	visible.value = true
}
const emit = defineEmits(['refreshDataList', 'refreshDataList2'])

const submitHandle = () => {
	receiveExamInvitationApi(dataForm).then((res: any) => {
		ElMessage.success('加入成功！')
		visible.value = false
		emit('refreshDataList')
		emit('refreshDataList2')
	})
}

defineExpose({
	init
})
</script>
