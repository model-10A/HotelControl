<template>
	<el-card>
		<template #header>
			<span>提交详情</span>
			<span style="margin-left: 20px">
				<el-tag v-if="record.submitStatus === null" effect="dark" type="info">未提交</el-tag>
				<el-tag v-else-if="record.submitStatus === 0" effect="dark">未判题</el-tag>
				<el-tag v-else-if="record.submitStatus === 3" effect="dark" type="success">正确{{ record.judgeType === 2 ? '(人工改判)' : '' }}</el-tag>
				<el-tag v-else-if="record.submitStatus === 4" effect="dark" type="danger">错误</el-tag>
			</span>
			<span v-show="record.submitStatus !== null" style="margin-left: 20px">提交时间：{{ record.submitTime }}</span>
		</template>
		<el-row>
			<el-input v-model="content" :autosize="{ minRows: 3, maxRows: 20 }" disabled type="textarea"></el-input>
			<div v-if="record.filePath != ''" style="margin-top: 10px">
				<el-row>
					<span>{{ getFileName(record.filePath) }}</span>
				</el-row>
				<el-row>
					<el-button type="text" @click="downloadSampleApi(record.filePath)">下载</el-button>
				</el-row>
			</div>
		</el-row>
		<el-row>
			<div class="includeImgDiv" style="width: 100%">
				<div v-for="(item, index) in imgUrlList" :key="index" style="width: 30%; padding: 10px">
					<img :src="item" style="width: 100%" @click="previewImg(item)" />
				</div>
			</div>
		</el-row>
		<div v-if="record.problemType == 3" class="case-wrap">
			<div v-for="(item, index) in record.sampleVoList" :key="index" class="wrap">
				<div v-if="item.resultCode === 3" class="case_AC">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">AC</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else-if="item.resultCode === 4" class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">WA</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else-if="item.resultCode === 5" class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">TLE</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else-if="item.resultCode === 6" class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">CE</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else-if="item.resultCode === 7" class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">MLE</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else-if="item.resultCode === 14" class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">PE</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
				<div v-else class="case_WA">
					<div class="content">
						<div class="info">{{ Number(item.runtime) * 1000 }}ms/{{ item.memory }}KB</div>
						<div class="status">RE</div>
						<div class="order">#{{ item.sampleId }}</div>
					</div>
				</div>
			</div>
		</div>
		<el-dialog v-model="dialogVisible">
			<img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" w-full />
		</el-dialog>
	</el-card>
	<el-card :body-style="{ padding: '0 20px' }">
		<el-collapse>
			<el-collapse-item title="参考答案">
				<el-col>
					<div>
						<el-input v-model="answer" :autosize="{ minRows: 3, maxRows: 20 }" disabled type="textarea"></el-input>
					</div>
				</el-col>
				<el-col>
					<div v-if="record.problemType === 3" class="case-wrap" style="margin: 10px">
						<div style="top: 0; left: 0">样例ID：</div>

						<div v-for="(item, index) in codeSampleList" :key="index" class="wrap" @click="showSample(item)">
							<div class="case_id">
								<div class="content">
									<div class="status">#{{ item.id }}</div>
								</div>
							</div>
						</div>
					</div>
				</el-col>
			</el-collapse-item>
		</el-collapse>
	</el-card>

	<el-card v-if="props.modelValue === 0" header="改判">
		<el-select v-model="record.submitStatus" filterable placeholder="改判">
			<el-option :key="0" :value="0" label="未判" />
			<el-option :key="3" :value="3" label="正确" />
			<el-option :key="4" :value="4" label="错误" />
		</el-select>
		<el-tag v-if="record.judgeType === 2">已改判 </el-tag>
		<el-input v-model="record.judgeReason" :rows="2" placeholder="改判备注" type="textarea" />
		<div style="width: 100%; display: flex; align-items: center; justify-content: center">
			<el-button style="margin: 10px; float: right" type="primary" @click="onSubmit">提交</el-button>
		</div>
	</el-card>
	<preview-sample ref="previewSampleRef"> </preview-sample>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useReasonAndStatusApi, useRecordAndAnswerApi } from '@/api/judge/judge'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useCodeAnswerApi } from '@/api/problem/codeproblem'
import { useFillAnswerApi } from '@/api/problem/fillproblem'
import { useOptionsFromJudgeApi } from '@/api/problem/choiceproblem'
import PreviewSample from '@/views/problem/code-problem/problem-sample/preview-sample.vue'
import { getFileName } from '@/utils/tool.ts'
import { downloadSampleApi } from '@/api/file/file'

const emit = defineEmits(['updateHandle'])
const status = ref(null)
const content = ref()
const dialogVisible = ref(false)
const dialogImageUrl = ref()
const imgUrlList = ref([])
const answer = ref()
const props = defineProps({
	modelValue: {
		type: Number,
		default: 0
	},
	fraction: {
		type: Number,
		default: 0
	}
})
let record = reactive({
	id: 0,
	languageType: '',
	problemType: 2,
	problemId: 0,
	userId: 0,
	submitContent: '',
	submitImg: '',
	submitTime: '',
	source: 0,
	sourceId: 0,
	submitStatus: null,
	judgeType: 0,
	judgeUser: 0,
	judgeReason: '',
	sampleVoList: [],
	filePath: ''
})

const codeSampleList = ref()

const init = (problemId: any, pType: any, source: any, lessonId: any, userId: any) => {
	record.source = source
	record.sourceId = lessonId

	record.userId = userId

	if (record.problemId != problemId || record.problemType != pType) {
		record.problemId = problemId
		record.problemType = pType
		if (pType === 1) {
			getChoiceAnswer(problemId)
		} else if (pType === 2) {
			getFillAnswer(problemId)
		} else {
			getCodeAnswer(problemId)
		}
	}
	getJudge()
}

const getJudge = () => {
	record.sampleVoList = []
	record.submitStatus = null
	useRecordAndAnswerApi(record).then((res: any) => {
		if (res.data == null) {
			content.value = ''
			imgUrlList.value = []
			record.judgeReason = ''
		} else {
			content.value = res.data.submitContent
			record.id = res.data.id
			record.judgeReason = res.data.judgeReason
			record.submitStatus = res.data.submitStatus
			record.sampleVoList = res.data.sampleVoList
			record.submitTime = res.data.submitTime
			record.judgeType = res.data.judgeType
			record.filePath = res.data.filePath
			status.value = res.data.submitStatus
			if (res.data.submitImg == '' || res.data.submitImg == null) {
				imgUrlList.value = []
			} else {
				imgUrlList.value = res.data.submitImg.split(';;;')
			}
		}
	})
	console.log(record)
}

const onSubmit = async () => {
	await useReasonAndStatusApi(record).then(() => {
		ElMessage.success('提交成功')
	})
	getJudge()
}

const previewImg = (url: any) => {
	dialogVisible.value = true
	dialogImageUrl.value = url
}

const getCodeAnswer = (problemId: any) => {
	useCodeAnswerApi(problemId).then(res => {
		answer.value = res.data.answer
		codeSampleList.value = res.data.codeSampleVOList
	})
}

const getFillAnswer = (problemId: any) => {
	useFillAnswerApi(problemId).then(res => {
		answer.value = res.data
	})
}

const getChoiceAnswer = (problemId: any) => {
	useOptionsFromJudgeApi(problemId).then(res => {
		answer.value = res.data
	})
}
const previewSampleRef = ref()

const showSample = (row: any) => {
	previewSampleRef.value.init(row.inputPath, row.outputPath)
}

defineExpose({
	init
})
</script>

<style scoped>
.includeImgDiv {
	width: 100%;
	display: flex;
	flex-direction: row;
}

.order {
	position: absolute;
	top: 0;
	left: 0;
	padding: 6px;
	font-size: 0.65em;
}

.wrap {
	color: #eeeeee;
	position: relative;
	display: inline-block;
	margin: 6px;
}
.case-wrap {
	display: block;
}
.case_AC {
	background-color: #52c41a;
	position: relative;
	vertical-align: top;
	cursor: pointer;
	margin: 0.2em;
	height: 6em;
	width: 6em;
	padding: 0;
	color: #fff;
}

.case_WA {
	background-color: #fef0f0;
	position: relative;
	vertical-align: top;
	cursor: pointer;
	margin: 0.2em;
	height: 6em;
	width: 6em;
	padding: 0;
	color: #f8986c;
}

.case_id {
	background-color: #c1c1c1;
	position: relative;
	vertical-align: top;
	cursor: pointer;
	margin: 0.2em;
	height: 4em;
	width: 4em;
	padding: 0;
	color: #fff;
}

.content {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	justify-content: center;
}
.status {
	font-size: 1.25em;
	padding-top: 2px;
	padding-bottom: 2px;
	text-align: center;
	font-weight: normal;
}
.info {
	padding-top: 4px;
	padding-bottom: 2px;
	font-size: 0.7em;
	text-align: center;
}
.t_s_i {
	display: flex;
	flex-direction: row-reverse;
}
.t_s_t {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}
</style>
