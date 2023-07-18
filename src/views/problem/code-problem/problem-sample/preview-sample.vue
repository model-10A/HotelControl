<template>
	<el-dialog v-model="visible" title="样例预览" width="50%" align="center">
		<el-row :gutter="20">
			<el-col :span="12">
				<h3>输入样例：</h3>
				<br />
				<iframe :src="dataPath.inputPath" width="100%" height="400" frameborder="1"></iframe>
			</el-col>
			<el-col :span="12">
				<h3>输出样例：</h3>
				<br />
				<iframe :src="dataPath.outputPath" width="100%" height="400" frameborder="1"></iframe>
			</el-col>
		</el-row>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { readSampleApi } from '@/api/file/file'

const visible = ref(false)
const loading = ref(false)
const oldInputPath = ref('')
const oldOutputPath = ref('')
const dataPath = reactive({
	inputPath: '',
	outputPath: ''
})

const getResourceUrl = async (path: string, flag: boolean) => {
	loading.value = true
	readSampleApi(path)
		.then(res => {
			console.log(res)
			let blob = new Blob([res.data], { type: res.headers['content-type'] })
			let url = URL.createObjectURL(blob)
			if (flag) {
				dataPath.inputPath = url
			} else {
				dataPath.outputPath = url
			}
		})
		.finally(() => {
			loading.value = false
		})
}

const init = (inputPath: string, outputPath: string) => {
	visible.value = true
	if (oldInputPath.value !== inputPath || oldOutputPath.value !== outputPath) {
		getResourceUrl(inputPath, true)
		getResourceUrl(outputPath, false)
		oldInputPath.value = inputPath
		oldOutputPath.value = outputPath
	}
}

defineExpose({
	init
})
</script>

<style lang="css" scoped></style>
