<template>
	<div>
		<el-card class="box-card">
			<template #header>
				<el-row>
					<el-col :span="12">
						<div class="card-header">
							<span class="title"
								>{{ codeProblem.id }}、{{ codeProblem.name }}{{ getDictLabel(store.appStore.dictList, 'problem_difficulty', codeProblem.difficulty) }}
							</span>
						</div>
					</el-col>
					<el-col :span="12">
						<div>
							<el-row>
								<el-col :span="4">
									<div class="t-r">
										<span>提交次数</span>
										<span style="margin-top: 5px">{{ codeProblem.submitTimes }}</span>
									</div>
								</el-col>
								<el-col :span="1">
									<el-divider class="el-divider--vertical" direction="vertical" />
								</el-col>
								<el-col :span="4">
									<div class="t-r">
										<span>正确次数</span>
										<span style="margin-top: 5px">{{ codeProblem.correctTimes }}</span>
									</div>
								</el-col>
								<el-col :span="1">
									<el-divider class="el-divider--vertical" direction="vertical" />
								</el-col>
								<el-col :span="6">
									<div class="t-r">
										<span>时间限制(s)</span>
										<span style="margin-top: 5px">{{ codeProblem.timeLimit }}</span>
									</div>
								</el-col>
								<el-col :span="1">
									<el-divider class="el-divider--vertical" direction="vertical" />
								</el-col>

								<el-col :span="6">
									<div class="t-r">
										<span>空间限制(kb)</span>
										<span style="margin-top: 5px">{{ codeProblem.memoryLimit }}</span>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
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
			<div style="margin-top: 20px">
				<fast-select v-model="record.languageType" dict-type="language" placeholder="语言"></fast-select>
				<span v-show="record.submitStatus !== null"> 提交时间：{{ record.submitTime }} </span>
				<span style="margin-left: 20px">
					<el-tag v-if="record.submitStatus === null" effect="dark" type="info">未提交</el-tag>
					<el-tag v-else-if="record.submitStatus === 0" effect="dark" type="primary">未判题</el-tag>
					<el-tag v-else-if="record.submitStatus === 3" effect="dark" type="success">正确</el-tag>
					<el-tag v-else-if="record.submitStatus === 4" effect="dark" type="danger">错误</el-tag>
				</span>
				<!--				<span v-if="record.submitStatus != null" @click="emit('getProblemSolvingList')"-->
				<!--					><el-button size="small" style="margin-left: 10px">题解</el-button></span-->
				<!--				>-->

				<cod-text v-model="record.submitContent" height="300px" />
				<div v-if="props.downloadFlag">
					<el-upload v-model:file-list="fileList" :http-request="uploadFile" :limit="1" :on-exceed="handleExceedIn" action="#">
						<el-button style="margin-top: 10px" type="primary">选择附件</el-button>
						<template #tip>
							<div class="el-upload__tip">仅支持一个文件上传,多个文件打包成压缩包上传</div>
						</template>
					</el-upload>
				</div>
				<div style="display: flex; align-items: center; width: 100%; justify-content: center">
					<el-button style="margin: 10px" @click="refresh()">刷新</el-button>
					<el-button style="margin: 10px" type="primary" @click="submitRecord"> 提交 </el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup>
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import { reactive, ref } from 'vue'
import { useCodeProblemInfoApi } from '@/api/problem/codeproblem.ts'
import CodText from '@/components/code-text/cod-text.vue'
import { useJudgeApi, userGetRecordApi } from '@/api/judge/judge'
import { ElMessage, ElMessageBox, genFileId, UploadInstance, UploadRawFile } from 'element-plus'
import constant from '@/utils/constant'
import service from '@/utils/request'
import { UploadProps, UploadUserFile } from 'element-plus'

const emit = defineEmits(['getProblemSolvingList'])

const props = defineProps({
	downloadFlag: {
		type: Boolean,
		required: false,
		default: true
	}
})
const record = reactive({
	languageType: 52,
	problemType: 3,
	problemId: 0,
	submitContent: '',
	source: 0,
	sourceId: 0,
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
const init = (id: number, source: number, sourceId: number) => {
	record.problemId = id
	record.source = source
	record.sourceId = sourceId
	useCodeProblemInfoApi(id).then((res: any) => {
		codeProblem.value = res.data
		record.problemId = id
	})

	getJudge()
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
	userGetRecordApi(record).then((res: any) => {
		if (res.data === null) {
			record.submitStatus = null
			record.submitContent = ''
		} else {
			record.submitStatus = res.data.submitStatus
			record.submitContent = res.data.submitContent
			record.submitTime = res.data.submitTime
		}
	})
}

const submitAnswerRecord = () => {
	if (record.submitContent === '') {
		ElMessage.error('答案不能为空！')
		return
	}

	useJudgeApi(record).then(res => {
		ElMessage.success('提交成功！')
		getJudge()
	})
}

const refresh = () => {
	ElMessage.success('刷新成功！')
	getJudge()
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
	width: 95%;
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
.el-divider--vertical {
	display: inline-block;
	width: 1px;
	height: 3em;
	margin: 0 8px;
	vertical-align: middle;
	position: relative;
	border-left: 1px var(--el-border-color) var(--el-border-style);
}
</style>
