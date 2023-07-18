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
			<div>
				<span class="heading">样例通过情况</span>
				<el-col>
					<div class="includeImage" style="width: 100%">
						<div v-for="(item, index) in imgUrlList" :key="index" style="width: 30%; padding: 10px">
							<img :src="item" style="width: 100%" @click="previewImg(item)" />
						</div>
					</div>
				</el-col>
				<div  class="case_wrap">
					<div v-for="(item, index) in record.sampleVoList" :key="index" class="wrap">
						<div v-if="item.resultCode === 3" class="case_AC" >
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
				<div style="text-align: center">
					<el-button style="margin: 10px" @click="refresh()">刷新</el-button>
					<el-button style="margin: 10px" type="primary" @click="submitRecord"> 提交 </el-button>
					<el-button style="margin: 10px" type="primary" @click="updateAnsower"> 更新至参考答案 </el-button>
				</div>
			</div>
			<div>
				<el-card :body-style="{ padding: '0 20px' }">
					<template #header>
						<span>参考答案</span>
					</template>
					<br />
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
				</el-card>
				<preview-sample ref="previewSampleRef"> </preview-sample>
			</div>
		</el-card>
	</div>
</template>
<script lang="ts" setup>
import store from '@/store'
import { getDictLabel } from '@/utils/tool'
import { reactive, ref } from 'vue'
import { useCodeAnswerApi, useCodeProblemInfoApi, useCodeProblemSubmitApi } from '@/api/problem/codeproblem.ts'
import CodText from '@/components/code-text/cod-text.vue'
import { useJudgeApi, useRecordAndAnswerApi, userGetRecordApi } from '@/api/judge/judge'
import { ElMessage, ElMessageBox } from 'element-plus'
import PreviewSample from '@/views/problem/code-problem/problem-sample/preview-sample.vue'
const dialogVisible = ref(false)
const dialogImageUrl = ref()
const imgUrlList = ref([])
const emit = defineEmits(['getProblemSolvingList'])
const record = reactive({
	id: 0,
	languageType: 52,
	problemType: 3,
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
	sampleVoList: []
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
const codeSampleList = ref()
const answer = ref()
const init = async (id: number, source: number, sourceId: number) => {
	record.problemId = id
	record.source = source
	record.sourceId = sourceId
	await useCodeProblemInfoApi(id).then((res: any) => {
		codeProblem.value = res.data
		record.problemId = id
	})
	await getJudge()
	await getCodeAnswer(record.problemId)
}

const previewSampleRef = ref()

const showSample = (row: any) => {
	previewSampleRef.value.init(row.inputPath, row.outputPath)
}

const updateAnsower = () => {
	let data = {
		id: record.problemId,
		answer: record.submitContent
	}
	useCodeProblemSubmitApi(data).then((res: any) => {
		ElMessage.success('同步成功！')
		getCodeAnswer(record.problemId)
	})
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

const previewImg = (url: any) => {
	dialogVisible.value = true
	dialogImageUrl.value = url
}

const getJudge = () => {
	record.sampleVoList = []
	record.submitStatus = null
	record.userId = null
	useRecordAndAnswerApi(record).then((res: any) => {
		if (res.data == null) {
			record.submitStatus = null
			record.submitContent = ''
			imgUrlList.value = []
		} else {
			record.submitContent = res.data.submitContent
			record.submitStatus = res.data.submitStatus
			record.sampleVoList = res.data.sampleVoList
			record.submitTime = res.data.submitTime
			record.languageType = res.data.languageType
			if (res.data.submitImg == '' || res.data.submitImg == null) {
				imgUrlList.value = []
			} else {
				imgUrlList.value = res.data.submitImg.split(';;;')
			}
		}
	})
}

const getCodeAnswer = (problemId: any) => {
	useCodeAnswerApi(problemId).then(res => {
		answer.value = res.data.answer
		codeSampleList.value = res.data.codeSampleVOList
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
.includeImage {
	width: 100%;
	display: flex;
	flex-direction: row;
}
.wrap{
  color: #eeeeee;
  position: relative;
  display: inline-block;
  margin: 6px;
}
.case_wrap{
  display: block;
}
.case_AC{
  background-color: #52c41a;
  position: relative;
  vertical-align: top;
  sursor: pointer;
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
.content{
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
.status{
  font-size: 1.25em;
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: center;
  font-weight: normal;
}
.info{
  padding-top: 4px;
  padding-bottom: 2px;
  font-size: 0.7em;
  text-align: center;
}
.order{
  position: absolute;
  top: 0;
  left: 0;
  padding: 6px;
  font-size: 0.065em;
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
</style>
