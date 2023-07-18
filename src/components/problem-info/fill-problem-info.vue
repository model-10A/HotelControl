<template>
	<el-card class="box-card">
		<template #header>
			<el-row>
				<el-col :span="12">
					<div class="card-header">
						<span class="title"
							>{{ fillProblem.id }}、{{ fillProblem.name }}{{ getDictLabel(store.appStore.dictList, 'problem_difficulty', fillProblem.difficulty) }}
						</span>
					</div>
				</el-col>
				<el-col :span="3">
					<div>
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
									<span style="margin-top: 5px">{{ fillProblem.submitTimes }}</span>
								</div>
							</el-col>
							<el-col :span="2">
								<el-divider class="el-divider--vertical" direction="vertical" />
							</el-col>
							<el-col :span="11">
								<div class="t-r">
									<span>正确次数</span>
									<span style="margin-top: 5px">{{ fillProblem.correctTimes }}</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>
		</template>
		<div v-html="fillProblem.description"></div>
		<el-col>
			<div style="width: 100%; margin-top: 30px">
				<el-input v-model="record.submitContent" :rows="5" placeholder="请输入答案" style="width: 100%" type="textarea" />
			</div>
		</el-col>

		<div class="footer">
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
			<el-button style="margin: 10px" @click="submitRecord"> 提交 </el-button>
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import { useFillProblemInfoApi } from '@/api/problem/fillproblem.ts'
import { ref } from 'vue'
import type { UploadProps, UploadUserFile, UploadFile, UploadFiles } from 'element-plus'
import { reactive } from 'vue'
import Constant from '@/utils/constant.ts'
import { Plus } from '@element-plus/icons-vue'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import { ElMessageBox, ElMessage } from 'element-plus'
import constant from '@/utils/constant'
import service from '@/utils/request'
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const props = defineProps({
	downloadFlag: {
		type: Boolean,
		required: false,
		default: true
	}
})
let fillProblem = ref({
	id: Number,
	name: '',
	correctTimes: Number,
	submitTimes: Number,
	difficulty: Number
})

let record = reactive({
	languageType: '',
	problemType: 2,
	problemId: 0,
	submitContent: '',
	submitImg: '',
	source: 0,
	sourceId: 0,
	submitStatus: null,
	submitTime: '',
	filePath: ''
})
const emit = defineEmits(['getProblemSolvingList'])
const fileList = ref<UploadUserFile[]>([])

const uploadUrl = Constant.uploadUrl

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}
const init = (id: number, source: number, sourceId: number) => {
	record.problemId = id
	record.source = source
	record.sourceId = sourceId
	useFillProblemInfoApi(id).then((res: any) => {
		fillProblem.value = res.data
	})
	getJudge()
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
			record.submitContent = ''
		} else {
			record.submitStatus = res.data.submitStatus
			record.submitContent = res.data.submitContent
			record.submitTime = res.data.submitTime
			let tempUrlList = []
			tempUrlList = res.data.submitImg === null ? [] : res.data.submitImg.split(';;;')
			tempUrlList.forEach((item: any, index: number) => {
				fileList.value.push({ name: index.toString(), url: item })
			})
		}
	})
}

const submitAnswerRecord = () => {
	if (record.submitContent === '') {
		ElMessage.error('答案不能为空！')
		return
	}
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

.footer {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
