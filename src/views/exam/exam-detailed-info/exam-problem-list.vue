<template>
	<el-row :gutter="20">
		<el-col :span="6">
			<el-table v-loading="" :data="examData.paperProblem" border highlight-current-row style="max-height: 70vh; overflow: auto" @row-click="handle">
				<el-table-column header-align="center" label="问题">
					<template #default="scope">
						<span>{{ scope.$index + 1 }}、{{ scope.row.problemName }}({{ scope.row.score }}分)</span>
					</template>
				</el-table-column>
			</el-table>
		</el-col>
		<el-col :span="18">
			<div v-if="examData.paperProblem.length > 0">
				<code-problem-info
					v-if="record.problemType === 3"
					ref="codeRef"
					:download-flag="false"
					:flag="false"
					:problem-id="record.problemId"
					:source-id="record.sourceId"
					source="3"
				></code-problem-info>
				<fill-problem-info
					v-if="record.problemType === 2"
					ref="fillRef"
					:download-flag="false"
					:flag="false"
					:problem-id="record.problemId"
					:source-id="record.sourceId"
					source="3"
				></fill-problem-info>
				<choice-problem-info
					v-if="record.problemType === 1"
					ref="choiceRef"
					:download-flag="false"
					:flag="false"
					:problem-id="record.problemId"
					:source-id="record.sourceId"
					source="3"
				></choice-problem-info>
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import CodeProblemInfo from '@/components/problem-info-exam/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info-exam/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info-exam/fill-problem-info.vue'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userProblemExamApi } from '@/api/lessons/exam'

const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})

const examId = ref(props.modelValue)
const route = useRoute()
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
const record = reactive({
	languageType: 52,
	problemType: 3,
	problemId: 0,
	source: 3,
	sourceId: 0
})
const examData = reactive({
	paperProblem: [] as any,
	problemIndex: 0
})
const getDate = () => {
	userProblemExamApi(examId.value).then(res => {
		examData.paperProblem = res.data
		record.problemId = examData.paperProblem[0].problemId
		record.problemType = examData.paperProblem[0].problemType
		record.sourceId = examId.value
	})
}
getDate()

const handle = (row: any, event: any, t: any) => {
	record.problemId = row.problemId
	record.problemType = row.problemType
	record.sourceId = examId.value
}
</script>

<style scoped>
.div-el-tag :hover {
	cursor: pointer;
}
/deep/.el-table--enable-row-hover .el-table__body tr:hover {
	cursor: pointer;
}
</style>
