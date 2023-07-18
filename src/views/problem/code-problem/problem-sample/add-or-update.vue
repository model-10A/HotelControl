<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="添加样例文件" draggable>
		<div style="max-height: 60vh; overflow: auto">
			支持批量上传，一次最多上传5组输入/输出文件，上传时请确保输入输出文件添加顺序一致
			<br />
			<el-upload
				v-model:file-list="inputList"
				accept=".in"
				class="upload-demo"
				action="#"
				:limit="5"
				multiple
				:on-exceed="handleExceedIn"
				:auto-upload="false"
			>
				<el-button type="primary">输入样例上传</el-button>
				<template #tip>
					<div class="el-upload__tip">.in格式文件</div>
				</template>
			</el-upload>
			<el-upload
				v-model:file-list="outputList"
				accept=".out"
				class="upload-demo"
				action="#"
				:limit="5"
				multiple
				:on-exceed="handleExceedOut"
				:auto-upload="false"
			>
				<el-button type="primary">输出样例上传</el-button>
				<template #tip>
					<div class="el-upload__tip">.out格式文件</div>
				</template>
			</el-upload>
			<div v-if="loading">
				<el-progress :percentage="progressPercent" :text-inside="true" :stroke-width="24" status="success"> </el-progress>
			</div>
		</div>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" :disabled="loading" @click="submitHandle()">上传</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, UploadInstance } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import { uploadSampleProblemApi } from '@/api/problem/problemsample'
const problemId = ref()
const inputList = ref<UploadUserFile[]>([])
const outputList = ref<UploadUserFile[]>([])
const loading = ref(false)
const progressPercent = ref(0)
const emit = defineEmits(['refreshDataList'])
const handleExceedIn: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`上限5，当前选择 ${files.length} 个，共 ${files.length + uploadFiles.length} 个`)
}
const handleExceedOut: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`上限5，当前选择 ${files.length} 个，共 ${files.length + uploadFiles.length} 个`)
}
const visible = ref(false)

const init = (id: number) => {
	progressPercent.value = 0
	loading.value = false
	problemId.value = id
	visible.value = true
}
const submitHandle = () => {
	progressPercent.value = 0
	if (inputList.value.length === 0) {
		ElMessage.warning('输入文件为空')
		return
	}
	if (outputList.value.length === 0) {
		ElMessage.warning('输出文件为空')
		return
	}
	if (inputList.value.length !== outputList.value.length) {
		ElMessage.warning('输入/输出文件个数不匹配')
		return
	}
	const formData = new FormData()
	inputList.value.forEach((item?: any) => {
		formData.append('input', item.raw)
	})
	outputList.value.forEach((item?: any) => {
		formData.append('output', item.raw)
	})
	formData.append('problemId', problemId.value)
	loading.value = true
	let timer = setInterval(() => {
		progressPercent.value++
		if (progressPercent.value == 90) {
			clearInterval(Number(timer))
		}
	}, 50)
	uploadSampleProblemApi(formData).then(res => {
		clearInterval(Number(timer))
		let finishtimer = setInterval(() => {
			if (progressPercent.value < 100) {
				progressPercent.value++
				if (progressPercent.value == 100) {
					ElMessage.success('上传成功')
					clearInterval(Number(finishtimer))
					emit('refreshDataList')
					setTimeout(() => {
						loading.value = false
						progressPercent.value = 0
					}, 2000)
				}
			}
		}, 1)
	})
}

defineExpose({
	init
})
</script>

<style scoped></style>
