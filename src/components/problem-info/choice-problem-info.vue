<template>
	<el-card class="box-card">
		<template #header>
			<el-row>
				<el-col :span="12">
					<div class="card-header">
						<span class="title"
							>{{ choiceProblem.id }}、{{ choiceProblem.name
							}}{{ getDictLabel(store.appStore.dictList, 'problem_difficulty', choiceProblem.difficulty) }}
						</span>
					</div>
				</el-col>
				<el-col :span="3">
					<div style="top: 0; height: 100%">
						<el-tag v-if="record.submitStatus === null" effect="dark" size="large" type="info">未提交</el-tag>
						<el-tag v-else-if="record.submitStatus === 0" effect="dark" size="large" type="info">未判题</el-tag>
						<el-tag v-else-if="record.submitStatus === 3" effect="dark" size="large" type="success">正确</el-tag>
						<el-tag v-else-if="record.submitStatus === 4" effect="dark" size="large" type="danger">错误</el-tag>
					</div>
				</el-col>
				<el-col :span="3">
					<!--					<div v-if="record.submitStatus != null" @click="emit('getProblemSolvingList')">-->
					<!--						<el-button size="small" style="margin-left: 10px">题解</el-button>-->
					<!--					</div>-->
				</el-col>
				<el-col :span="5">
					<div>
						<el-row>
							<el-col :span="11">
								<div class="t-r">
									<span>提交次数</span>
									<span style="margin-top: 5px">{{ choiceProblem.submitTimes }}</span>
								</div>
							</el-col>
							<el-col :span="2">
								<el-divider class="el-divider--vertical" direction="vertical" />
							</el-col>
							<el-col :span="11">
								<div class="t-r">
									<span>正确次数</span>
									<span style="margin-top: 5px">{{ choiceProblem.correctTimes }}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>
		</template>

		<el-row>
			<div class="context" v-html="choiceProblem.description"></div>
			<div v-if="choiceProblem.type === 1" style="margin-top: 15px; width: 100%">
				<el-radio-group v-model="radio.options[0]" style="width: 100%; height: auto">
					<el-col :span="24">
						<el-radio
							v-for="(radioItem, index) in choiceProblem.options"
							:key="index"
							:label="radioItem.problemOption"
							border
							style="padding: 15px 10px 15px 10px; margin-top: 15px; width: 100%; height: auto; white-space: normal; word-break: break-all"
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
							style="padding: 15px 10px 15px 10px; margin-top: 15px; width: 100%; height: auto; white-space: normal; word-break: break-all"
						>
							{{ radioItem.problemOption }}
						</el-checkbox>
					</el-col>
				</el-checkbox-group>
			</div>
		</el-row>
		<div class="footer">
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
		<div style="text-align: center">
			<div v-show="record.submitStatus !== null">提交时间：{{ record.submitTime }}</div>
			<el-button style="margin: 10px" type="primary" @click="submitRecord"> 提交 </el-button>
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import { reactive, ref } from 'vue'
import { useChoiceProblemInfoApi } from '@/api/problem/choiceproblem.ts'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import { ElMessageBox, UploadFile, UploadFiles, UploadProps, UploadUserFile } from 'element-plus'
import Constant from '@/utils/constant'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import constant from '@/utils/constant'
import service from '@/utils/request'

const props = defineProps({
	downloadFlag: {
		type: Boolean,
		required: false,
		default: true
	}
})
const emit = defineEmits(['getProblemSolvingList'])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
let radio = reactive({
	options: [] as any[]
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

let record = reactive({
	languageType: '',
	problemType: 1,
	problemId: 0,
	submitContent: '',
	submitImg: '',
	source: 0,
	sourceId: 0,
	submitStatus: null,
	submitTime: '',
	filePath: ''
})

const init = (id: number, source: number, sourceId: number) => {
	record.problemId = id
	record.source = source
	record.sourceId = sourceId
	useChoiceProblemInfoApi(id).then((res: any) => {
		choiceProblem.value = res.data
	})
	getJudge()
}

const handleRemove: UploadProps['onRemove'] = () => {}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}

const submitSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	fileList.value.splice(fileList.value.length - 1, 1)
	fileList.value.push({ name: response.data.name, url: response.data.url })
}

const submitRecord = () => {
	if (record.submitStatus != null) {
		ElMessageBox.confirm('提交会覆盖上次结果，确定吗？', '提示！', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			submitAnswerRecord()
		})
	} else {
		submitAnswerRecord()
	}
}

const getJudge = () => {
	fileList.value.splice(0, fileList.value.length)
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

const submitAnswerRecord = () => {
	if (radio.options.length <= 0) {
		ElMessage.error('答案不能为空！')
		return
	}
	let tempStr = ''
	tempStr = radio.options.join(';;;')
	record.submitContent = tempStr
	record.submitImg = ''
	if (fileList.value.length > 0) {
		record.submitImg = fileList.value[0].url!
		for (let i = 1; i < fileList.value.length; i++) {
			record.submitImg += ';;;' + fileList.value[i].url
		}
	}
	useJudgeApi(record).then(res => {
		ElMessage.success('提交成功！')
		getJudge()
	})
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
		record.filePath = res.data.url
		ElMessage.success('文件已上传！')
	})
}
defineExpose({
	init
})
</script>

<style scoped>
.box-card {
	margin-top: 8px;
}
.el-divider--vertical {
	display: inline-block;
	width: 1px;
	height: 3em;
	margin: 0 8px;
	vertical-align: middle;
	position: relative;
	border-left: 1px var(--el-border-color) var(--el-border-style);
}
.t-r {
	font-weight: 500;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
