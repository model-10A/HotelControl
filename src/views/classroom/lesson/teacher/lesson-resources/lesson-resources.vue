<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="addResourceHandle()">新增</el-button>
			</el-form-item>
		</el-form>
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
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="300">
				<template #default="scope">
					<el-button size="small" type="text" @click="downloadSampleApi(scope.row.filePath)">下载</el-button>
					<el-button v-if="scope.row.fileType === 1" size="small" type="text" @click="previewResourcesHandle(scope.row.filePath)">预览</el-button>
					<el-button size="small" type="text" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-resource ref="addResourceRef" @refreshDataList="init()"></add-resource>
		<!--		<add-resource v-model="addResourceVisible"></add-resource>-->
		<!--    预览-->
		<preview-resources ref="previewResourcesRef"></preview-resources>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { deleteLessonResourceApi, useLessonResourceApi } from '@/api/lessons/resource'
import AddResource from '@/views/classroom/lesson/teacher/lesson-resources/add-resource.vue'
import PreviewResources from './preview-resources.vue'
import { downloadSampleApi } from '@/api/file/file'

import { ElMessage, ElMessageBox } from 'element-plus'
const visible = ref(true)
const resource = reactive({
	dataListLoading: false,
	dataList: []
})
let props = defineProps({
	modelValue: {
		type: [Number, String],
		required: true
	}
})
const deleteBatchHandle = (id: number) => {
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		deleteLessonResourceApi(id).then(() => {
			ElMessage.success('删除成功')
			init()
		})
	})
}

const lessonId = ref(props.modelValue)
const init = () => {
	useLessonResourceApi(lessonId.value).then((res: any) => {
		resource.dataList = res.data
	})
}
init()
const addResourceRef = ref()
const addResourceHandle = () => {
	addResourceRef.value.init(lessonId.value)
}

const previewResourcesRef = ref()
const previewResourcesHandle = (path: String) => {
	previewResourcesRef.value.init(path)
}
</script>

<style scoped></style>
