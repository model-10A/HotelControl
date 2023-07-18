<template>
	<el-drawer v-model="visible" size="50%">
		<template #title>
			<h4>资源预览</h4>
		</template>
		<template #default>
			<div v-loading="loading" style="width: 100%; height: 100%; overflow: hidden">
				<iframe ref="iframeRef" :src="pdfUrl + '#toolbar=0'" style="width: 100%; height: 100%; overflow: hidden" height="140px" noresize></iframe>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getPdfUrlApi } from '@/api/file/file'
const pdfUrl = ref()
const visible = ref(false)
const loading = ref(false)
const getResourceUrl = async (path: string) => {
	loading.value = true
	getPdfUrlApi(path)
		.then(res => {
			console.log(res)
			let blob = new Blob([res.data], { type: res.headers['content-type'] })
			pdfUrl.value = URL.createObjectURL(blob)
		})
		.finally(() => {
			loading.value = false
		})
}

const iframeRef = ref()

const oldPath = ref('')

const init = (path: string) => {
	visible.value = true
	if (oldPath.value !== path) {
		getResourceUrl(path)
		oldPath.value = path
	}
}

defineExpose({
	init
})
</script>

<style lang="css" scoped></style>
