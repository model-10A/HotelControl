<template>
	<el-dialog v-model="visible" v-loading="loading" width="70%" :close-on-click-modal="false" draggable>
		<div class="gradient"></div>
		<el-card style="box-shadow: silver 0px 1px !important; border-radius: 0px 0px 10px 10px">
			<p style="font-size: 20px; font-weight: bold">数据导入</p>
		</el-card>
		<el-card style="margin-top: 20px; box-shadow: silver 0px 0px 2px !important; border-radius: 10px">
			<el-steps :active="active" finish-status="success" align-center>
				<el-step title="下载模板" description="请下载指定模板" />
				<el-step title="上传文件" description="请上传指定格式" />
				<el-step title="校验数据" description="检查数据格式是否正确" />
				<el-step title="写入数据" description="正在执行写入数据" />
			</el-steps>
			<el-form ref="dataFormRef" class="form">
				<el-form-item v-if="active === 0" class="form-item">
					<el-button type="primary" class="button" @click="downloadStudentTemplate()">下载模板</el-button>
				</el-form-item>
				<el-form-item v-if="active === 1" class="form-item">
					<el-upload
						v-model:file-list="fileList"
						class="upload"
						drag
						accept=".xlsx"
						action="#"
						:limit="1"
						:on-exceed="handleExceedIn"
						:auto-upload="false"
					>
						<!-- <svg-icon style="font-size: 100px;" color="#bcbaba" icon="icon-upload"></svg-icon> -->
						<el-icon class="el-icon--upload"><upload-filled /></el-icon>
						<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
						<template #tip>
							<div class="el-upload__tip">文件格式仅支持xls/xlsx，且不超过5M</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item v-if="active === 2" class="form-item">
					<!--          数据校验-->
					<p v-if="loading === true" style="text-align: center; margin: 0 auto">正在校验，请稍后……</p>
				</el-form-item>
				<el-form-item v-if="active === 3" class="form-item">
					<div v-if="success === 1" style="text-align: center; margin: 0 auto">
						<el-icon style="font-size: 100px; color: green">
							<CircleCheck />
						</el-icon>
						<p>导入成功！</p>
					</div>
					<div v-else style="text-align: center; margin: 0 auto">
						<el-icon style="font-size: 100px; color: red">
							<CircleCloseFilled />
						</el-icon>
						<p>导入失败，请检查后重新导入</p>
					</div>
				</el-form-item>
			</el-form>
			<div class="center">
				<el-button @click="visible = false">取消</el-button>
				<el-button v-if="active < 3" type="primary" :disabled="active === 2" @click="next()">下一步</el-button>
				<el-button v-else type="primary" @click="visible = false">确定</el-button>
			</div>
		</el-card>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import {downloadStudentTemplateApi} from '@/api/file/file'
import { useStudentImportApi } from '@/api/teach/student'
import { UploadFilled, CircleCheck, CircleCloseFilled } from '@element-plus/icons-vue'
const active = ref(0)
const fileList = ref<UploadUserFile[]>([])
const visible = ref(false)
const loading = ref(false)
const emit = defineEmits(['refreshDataList'])
const init = () => {
	success.value = 0
	visible.value = true
	active.value = 0
	fileList.value = []
}
const next = () => {
	if (active.value === 0) {
		active.value++
	} else if (active.value === 1) {
		if (fileList.value.length === 0) {
			ElMessage.warning('文件为空')
			return
		}
		submitHandle()
		active.value++
	} else {
		if (loading.value === false) {
			active.value++
		}
	}
}
const handleExceedIn: UploadProps['onExceed'] = () => {
	ElMessage.warning(`仅限1个文件`)
}
const success = ref(0)
const submitHandle = () => {
	loading.value = true
	const formData = new FormData()
	formData.append('file', fileList.value[0].raw!)
	useStudentImportApi(formData)
		.then(res => {
			// ElMessage.success('导入成功')
			success.value = 1
			fileList.value.slice(0, 1)
			emit('refreshDataList')
		})
		.finally(() => {
			loading.value = false
			next()
		})
}
const downloadStudentTemplate = () => {
	downloadStudentTemplateApi()
}


defineExpose({
	init
})
</script>

<style scoped>
.gradient {
	width: 100%;
	height: 30px;
	background-image: linear-gradient(#c8f9ff, #b5b9eb);
	border-radius: 5px 5px 0px 0px;
	transform: translateY(4px);
	z-index: -999;
}

.center {
	text-align: center;
}

.form {
	width: 60%;
	height: 350px;
	margin: 0 auto;
}

.form-item {
	margin: 0 auto;
	width: 80%;
	height: 350px;
}

.button {
	margin: 0 auto;
	width: 100px;
	height: 100px;
	border-radius: 15px;
}

.upload {
	height: auto;
	width: 80%;
	margin: 0 auto;
	/* color: #bcbaba; */
}
</style>
