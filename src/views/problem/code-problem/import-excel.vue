<template>
	<el-dialog v-model="visible" v-loading="loading" title="Excel导入" width="40%" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" style="max-height: 60vh; overflow: auto" label-width="100px">
			<el-form-item label="模板">
				<el-button type="primary" @click="downloadProblemTemplate(3)">下载模板</el-button>
			</el-form-item>
			<el-form-item label="上传">
				<el-upload
					v-model:file-list="fileList"
					accept=".xlsx"
					class="upload-demo"
					action="#"
					:limit="1"
					:on-exceed="handleExceedIn"
					:auto-upload="false"
				>
					<el-button type="primary">选择EXCEL</el-button>

					<template #tip>
						<div class="el-upload__tip">.xlsx格式文件</div>
					</template>
				</el-upload>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import { useImportExcelApi } from '@/api/problem/codeproblem'
import { downloadProblemTemplateApi } from '@/api/file/file'
const fileList = ref<UploadUserFile[]>([])
const visible = ref(false)
const loading = ref(false)
const emit = defineEmits(['refreshDataList'])
const init = () => {
	visible.value = true
}
const handleExceedIn: UploadProps['onExceed'] = () => {
	ElMessage.warning(`仅限1个文件`)
}
const submitHandle = () => {
	if (fileList.value.length === 0) {
		ElMessage.warning('文件为空')
		return
	}
	loading.value = true
	const formData = new FormData()
	formData.append('file', fileList.value[0].raw!)
	useImportExcelApi(formData)
		.then(res => {
			ElMessage.success('导入成功')
			fileList.value.slice(0, 1)
			emit('refreshDataList')
		})
		.finally(() => {
			loading.value = false
		})
}
const downloadProblemTemplate = (type: number) => {
	downloadProblemTemplateApi(type)
}
defineExpose({
	init
})
</script>

<style scoped></style>
