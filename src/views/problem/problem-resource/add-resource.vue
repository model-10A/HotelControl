<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="添加资源" draggable>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px">
			<el-form-item label="文件" prop="description" required>
				<div style="max-height: 60vh; overflow: auto">
					<el-upload v-model:file-list="fileList" class="upload-demo" action="#" :limit="1" :on-exceed="handleExceedIn" :http-request="uploadFile">
						<el-button type="primary">选择文件</el-button>
						<template #tip>
							<div class="el-upload__tip">仅支持一个文件上传</div>
						</template>
					</el-upload>
				</div>
			</el-form-item>

			<el-form-item label="类型" prop="fileType">
				<fast-select v-model="dataForm.fileType" dict-type="file_type" placeholder="类型" clearable></fast-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" type="textarea" placeholder="备注"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button v-loading="fileLoad" type="primary" @click="submitHandle">上传</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import service from '@/utils/request'
import constant from '@/utils/constant'
import { uploadProblemResourceApi } from '@/api/problem/problemresource'

const visible = ref(false)
const progressPercent = ref(0)
const fileList = ref<UploadUserFile[]>([])
const fileLoad = ref(false)
const emit = defineEmits(['refreshDataList'])
const handleExceedIn: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`上限1个文件`)
}
const uploadUrl = constant.upload2Url
const uploadFile = (param: any) => {
	const formData = new FormData()
	formData.append('file', param.file)
	fileLoad.value = true
	service
		.post(uploadUrl, formData)
		.then(res => {
			dataForm.filePath = res.data.url
			dataForm.name = res.data.name
			ElMessage.success('文件已上传！')
		})
		.finally(() => {
			fileLoad.value = false
		})
}

const dataForm = reactive({
	problemId: 0,
	problemType: 0,
	fileType: '',
	filePath: '',
	name: '',
	remark: ''
})
const dataRules = ref({
	fileType: [{ required: true, message: '类型不可为空', trigger: 'blur' }],
	filePath: [{ required: true, message: '文件不可为空', trigger: 'blur' }]
})

const init = (id: number, type: number) => {
	progressPercent.value = 0
	dataForm.problemId = id
	dataForm.problemType = type
	visible.value = true
}

const submitHandle = () => {
	progressPercent.value = 0
	if (dataForm.filePath.length === 0) {
		ElMessage.warning('未选择文件')
		return
	}
	uploadProblemResourceApi(dataForm).then((res: any) => {
		if ((res.msg = 'success')) {
			ElMessage.success('文件上传成功！')
			emit('refreshDataList')

			visible.value = false
		}
	})
}

defineExpose({
	init
})
</script>
