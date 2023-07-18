<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span class="title">{{ props.index !== undefined ? props.index + '、' : '' }}{{ choiceProblem.name }} </span>
			</div>
		</template>
		<div v-html="choiceProblem.description"></div>
		<div v-if="choiceProblem.type === 1" style="margin-top: 15px; width: 100%">
			<el-radio-group v-model="radio.options[0]" style="width: 100%; height: auto">
				<el-col :span="24">
					<el-radio
						v-for="(radioItem, index) in choiceProblem.options"
						:key="index"
						:label="radioItem.problemOption"
						border
						style="
							padding: 15px 10px 15px 10px;
							margin-top: 15px;
							margin-right: 0;
							width: 100%;
							height: auto;
							white-space: normal;
							word-break: break-all;
						"
					>
						{{ radioItem.problemOption }}
					</el-radio>
				</el-col>
			</el-radio-group>
		</div>
		<div v-else style="margin-top: 15px; width: 100%">
			<el-checkbox-group v-model="radio.options" size="large" style="width: 100%">
				<el-col :span="24">
					<el-checkbox
						v-for="(radioItem, index) in choiceProblem.options"
						:key="index"
						:label="radioItem.problemOption"
						border
						style="
							padding: 15px 10px 15px 10px;
							margin-top: 15px;
							margin-right: 0;
							width: 100%;
							height: auto;
							white-space: normal;
							word-break: break-all;
						"
					>
						{{ radioItem.problemOption }}
					</el-checkbox>
				</el-col>
			</el-checkbox-group>
		</div>

		<div v-if="props.flag" class="footer">
			<div style="margin: 20px">
				<el-upload
					v-model:file-list="fileList"
					:action="uploadUrl"
					:on-preview="handlePictureCardPreview"
					:on-remove="handleRemove"
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

		<div v-if="props.downloadFlag">
			<el-upload v-model:file-list="fileList_2" :http-request="uploadFile" :limit="1" :on-exceed="handleExceedIn" action="#">
				<el-button style="margin-top: 10px" type="primary">选择附件</el-button>
				<template #tip>
					<div class="el-upload__tip">仅支持一个文件上传,多个文件打包成压缩包上传</div>
				</template>
			</el-upload>
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useChoiceProblemInfoApi } from '@/api/problem/choiceproblem.ts'
import { ElMessageBox, UploadFile, UploadFiles, UploadProps, UploadUserFile } from 'element-plus'
import Constant from '@/utils/constant'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import constant from '@/utils/constant'
import service from '@/utils/request'
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
let radio = reactive({
	options: [] as any[]
})

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
	problemType: 1,
	problemId: props.problemId,
	submitContent: '',
	submitImg: '',
	source: 3,
	sourceId: props.sourceId,
	submitStatus: null,
	submitTime: '',
	filePath: ''
})

const fileList = ref<UploadUserFile[]>([])
const uploadUrl = Constant.uploadUrl
let choiceProblem = ref({
	id: '',
	name: '',
	correctTimes: Number,
	submitTimes: Number,
	difficulty: Number,
	options: [] as any[]
})

const answer = reactive({
	languageType: null,
	submitContent: record.submitContent,
	submitImg: record.submitImg
})

const init = () => {
	answer.submitContent = ''
	answer.submitImg = ''
	fileList_2.value = []
	useChoiceProblemInfoApi(props.problemId).then((res: any) => {
		choiceProblem.value = res.data
	})
	record.problemId = props.problemId
	getJudge()
}

const getJudge = () => {
	console.log(record)
	userGetRecordApi(record).then((res: any) => {
		if (res.data === null) {
			record.submitStatus = null
		} else {
			record.submitStatus = res.data.submitStatus
			record.submitTime = res.data.submitTime
			radio.options = res.data.submitContent.split(';;;')
			let tempUrlList = res.data.submitImg === null ? [] : res.data.submitImg.split(';;;')
			tempUrlList.forEach((item: any, index: number) => {
				fileList.value.push({ name: index.toString(), url: item })
			})
		}
	})
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
const handleRemove: UploadProps['onRemove'] = () => {}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}

const submitSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	fileList.value.splice(fileList.value.length - 1, 1)
	fileList.value.push({ name: response.data.name, url: response.data.url })
}
const setAnswer = () => {
	let tempStr = ''
	tempStr = radio.options.join(';;;')
	answer.submitContent = tempStr
	answer.submitImg = ''
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

<style>
.box-card {
	margin-top: 8px;
}
</style>
