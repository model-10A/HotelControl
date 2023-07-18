<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span class="title">{{ props.index !== undefined ? props.index + '、' : '' }}{{ codeProblem.name }} </span>
			</div>
		</template>
		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">题目描述</span>
			</el-col>

			<el-col>
				<div class="context" v-html="codeProblem.description"></div>
			</el-col>
		</div>
		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">输入格式</span>
			</el-col>

			<el-col>
				<div class="context">
					{{ codeProblem.inputExplain }}
				</div>
			</el-col>
		</div>
		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">输出格式</span>
			</el-col>
			<el-col>
				<div class="context">{{ codeProblem.outputExplain }}</div>
			</el-col>
		</div>
		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">输入样例</span>
			</el-col>
			<el-col>
				<div class="context">{{ codeProblem.sampleInput }}</div>
			</el-col>
		</div>

		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">输出样例</span>
			</el-col>
			<el-col>
				<div class="context">{{ codeProblem.sampleOutput }}</div>
			</el-col>
		</div>
		<div style="margin-top: 10px">
			<el-col>
				<span class="heading">说明/提示</span>
			</el-col>
			<el-col>
				<div class="context">{{ codeProblem.tips }}</div>
			</el-col>
		</div>
		<div v-if="props.flag" style="margin-top: 20px">
			<fast-select v-model="answer.languageType" dict-type="language" placeholder="语言"></fast-select>

			<cod-text v-model="answer.submitContent" height="200px" />

			<div v-if="props.downloadFlag">
				<el-upload v-model:file-list="fileList" :http-request="uploadFile" :limit="1" :on-exceed="handleExceedIn" action="#">
					<el-button style="margin-top: 10px" type="primary">选择附件</el-button>
					<template #tip>
						<div class="el-upload__tip">仅支持一个文件上传,多个文件打包成压缩包上传</div>
					</template>
				</el-upload>
			</div>
		</div>
	</el-card>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useCodeProblemInfoApi } from '@/api/problem/codeproblem.ts'
import CodText from '@/components/code-text/cod-text.vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import constant from '@/utils/constant'
import service from '@/utils/request'
import { userGetRecordApi } from '@/api/judge/judge'
import { assign } from 'lodash'
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
	problemType: 3,
	problemId: props.problemId,
	submitContent: '',
	submitImg: '',
	source: 3,
	sourceId: props.sourceId,
	submitStatus: null,
	submitTime: '',
	filePath: ''
})

let codeProblem = ref({
	id: Number,
	name: '',
	adviceTime: '',
	difficulty: '',
	inputExplain: '',
	outputExplain: '',
	sampleInput: '',
	sampleOutput: '',
	isTypical: '',
	memoryLimit: '',
	timeLimit: ''
})

const answer = reactive({
	languageType: 52,
	submitContent: record.submitContent,
	submitImg: record.submitImg,
	filePath: record.filePath
})
const init = () => {
	answer.submitContent = ''
	answer.submitImg = ''
	fileList.value = []
	useCodeProblemInfoApi(props.problemId).then((res: any) => {
		codeProblem.value = res.data
	})
	answer.submitContent = ''
	record.problemId = props.problemId
	getJudge()
}

const getJudge = () => {
	answer.submitContent = ''
	userGetRecordApi(record).then((res: any) => {
		if (res.data === null) {
			record.submitStatus = null
			record.submitContent = ''
		} else {
			record.submitStatus = res.data.submitStatus
			answer.submitContent = record.submitContent = res.data.submitContent
			record.submitTime = res.data.submitTime
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

const getAnswer = () => {
	return answer
}

const handleExceedIn: UploadProps['onExceed'] = files => {
	ElMessage.warning(`上限1个文件`)
}

const fileList = ref<UploadUserFile[]>([])
const uploadUrl = constant.upload2Url
const uploadFile = (param: any) => {
	const formData = new FormData()
	formData.append('file', param.file)
	service.post(uploadUrl, formData).then(res => {
		answer.filePath = res.data.url
		ElMessage.success('文件已上传！')
	})
}

defineExpose({ getAnswer })
</script>
<style scoped>
.box-card {
	margin-top: 8px;
}
.title {
	font-size: 30px;
	font-weight: 600;
}
.heading {
	font-size: 20px;
	font-weight: 800;
	margin-top: 10px;
}
.context {
	white-space: pre-wrap;
	width: 90%;
	margin-top: 10px;
	font-size: 15px;
	line-height: 25px;
}
.t-r {
	font-weight: 600;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
