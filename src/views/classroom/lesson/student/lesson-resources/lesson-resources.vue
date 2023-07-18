<template>
	<div>
		<el-table v-loading="resource.dataListLoading" :data="resource.dataList" border style="width: 100%">
			<el-table-column align="center" header-align="center" label="序号" width="100">
				<template #default="scope">
					<span>{{ scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="名称" prop="name" show-overflow-tooltip></el-table-column>
			<!--			<el-table-column prop="filePath" label="路径" header-align="center" align="center"></el-table-column>-->
			<el-table-column align="center" header-align="center" label="资源类型" width="100">
				<template #default="scope">
					<span v-show="scope.row.fileType === 1">PDF</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="备注" prop="remark" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
				<template #default="scope">
					<el-button v-if="scope.row.fileType !== 1" size="small" type="text" @click="downloadSampleApi(scope.row.filePath)">下载</el-button>
					<el-button v-else size="small" type="text" @click="previewResourcesHandle(scope.row.filePath)">预览</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<!--  预览-->
	<preview-resource ref="previewResourcesRef"></preview-resource>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useLessonResourceApi } from '@/api/lessons/resource'
import PreviewResource from './preview-resources.vue'
import { downloadSampleApi } from '@/api/file/file'
const resource = reactive({
	dataListLoading: false,
	dataList: []
})

const props = defineProps({
	modelValue: {
		type: [Number, String],
		required: true
	}
})
const lessonId = ref(props.modelValue)
const init = () => {
	useLessonResourceApi(lessonId.value).then((res: any) => {
		resource.dataList = res.data
	})
}

const previewResourcesRef = ref()
const previewResourcesHandle = (path: String) => {
	previewResourcesRef.value.init(path)
}
init()
</script>

<style scoped></style>
