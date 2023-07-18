<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span class="title">{{ props.index !== undefined ? props.index + '、' : '' }}{{ fillProblem.name }} </span>
			</div>
		</template>
		<div v-html="fillProblem.description"></div>
		<el-col>
			<div style="width: 100%; margin-top: 30px">
				<el-input v-model="answer.submitContent" :rows="5" placeholder="请输入答案" style="width: 100%" type="textarea" />
			</div>
		</el-col>

		<div v-if="props.downloadFlag">
			<el-upload v-model:file-list="fileList_2" :http-request="uploadFile" :limit="1" :on-exceed="handleExceedIn" action="#">
				<el-button style="margin-top: 10px" type="primary">选择附件</el-button>
				<template #tip>
					<div class="el-upload__tip">仅支持一个文件上传,多个文件打包成压缩包上传</div>
				</template>
			</el-upload>
		</div>

		<div v-if="props.flag" class="footer">
			<div style="margin: 20px">
				<el-upload
					v-model:file-list="fileList"
					:action="uploadUrl"
					:on-preview="handlePictureCardPreview"
					:on-success="submitSuccess"
					accept=".png, .jpg"
					list-type="picture-card"
				>
					<el-icon><Plus /></el-icon>
				</el-upload>
				<el-dialog v-model="dialogVisible">
					<img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" w-full />
				</el-dialog>
			</div>
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import { useFillProblemInfoApi } from '@/api/problem/fillproblem.ts'
import { onMounted, ref, watch } from 'vue'
import type { UploadProps, UploadUserFile, UploadFile, UploadFiles } from 'element-plus'
import { reactive } from 'vue'
import Constant from '@/utils/constant.ts'
import { Plus } from '@element-plus/icons-vue'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import { ElMessage } from 'element-plus'
import constant from '@/utils/constant'
import service from '@/utils/request'
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const props = defineProps({
	problemId: {
		type: Number,
		required: true
	},
	flag: {
		type: Boolean,
		required: false,
		default: true
	},
	index: {
		type: Number,
		required: true
	},
	downloadFlag: {
		type: Boolean,
		required: false,
		default: true
	},
	sourceId: {
		type: Number,
		required: true
	}
})

let record = reactive({
	languageType: '',
	problemType: 2,
	problemId: props.problemId,
	submitContent: '',
	submitImg: '',
	source: 3,
	sourceId: props.sourceId,
	submitStatus: null,
	submitTime: '',
	filePath: ''
})
let fillProblem = ref({
	id: Number,
	name: '',
	correctTimes: Number,
	submitTimes: Number,
	difficulty: Number
})

const answer = reactive({
	languageType: null,
	submitContent: record.submitContent,
	submitImg: record.submitImg,
	filePath: record.filePath
})

const fileList = ref<UploadUserFile[]>([])

const uploadUrl = Constant.uploadUrl

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}
const init = () => {
	answer.submitContent = ''
	answer.submitImg = ''
	fileList_2.value = []
	useFillProblemInfoApi(props.problemId).then((res: any) => {
		fillProblem.value = res.data
	})
	answer.submitContent = ''
	record.problemId = props.problemId
	getJudge()
}

const getJudge = () => {
	fileList.value.splice(0, fileList.value.length)
	userGetRecordApi(record).then((res: any) => {
		if (res.data === null) {
			record.submitStatus = null
			record.submitContent = ''
		} else {
			record.submitStatus = res.data.submitStatus
			answer.submitContent = record.submitContent = res.data.submitContent
			record.submitTime = res.data.submitTime
			let tempUrlList = []
			tempUrlList = res.data.submitImg === null ? [] : res.data.submitImg.split(';;;')
			tempUrlList.forEach((item: any, index: number) => {
				fileList.value.push({ name: index.toString(), url: item })
			})
		}
	})
}

const submitSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	fileList.value.splice(fileList.value.length - 1, 1)
	fileList.value.push({ name: response.data.name, url: response.data.url })
}

onMounted(() => {
	if (props.problemId != undefined) {
		init()
	}
})
watch(
	() => props.problemId,
	(newName, oldName) => {
		if (props.problemId != undefined) {
			init()
		}
	}
)

const setAnswer = () => {
	if (fileList.value.length > 0) {
		answer.submitImg = fileList.value[0].url!
		for (let i = 1; i < fileList.value.length; i++) {
			answer.submitImg += ';;;' + fileList.value[i].url
		}
	}
}
const getAnswer = () => {
	setAnswer()
	return answer
}

const handleExceedIn: UploadProps['onExceed'] = files => {
	ElMessage.warning(`上限1个文件`)
}

const fileList_2 = ref<UploadUserFile[]>([])
const uploadUrl_2 = constant.upload2Url
const uploadFile = (param: any) => {
	const formData = new FormData()
	formData.append('file', param.file)
	service.post(uploadUrl_2, formData).then(res => {
		answer.filePath = res.data.url
		ElMessage.success('文件已上传！')
	})
}

defineExpose({
	getAnswer
})
</script>

<style scoped>
.box-card {
	margin-top: 8px;
}
.footer {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
