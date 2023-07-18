<template>
	<el-form :inline="true">
		<el-form-item>
			<el-input v-model="state.queryForm.name" placeholder="姓名"></el-input>
		</el-form-item>
		<el-form-item>
			<el-select v-model="state.queryForm.status" placeholder="考生状态">
				<el-option :value="1" label="参与"></el-option>
				<el-option :value="2" label="交卷"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button style="margin-left: 10px" type="primary" @click="getLessonProblemRecord()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			<el-button style="margin-left: 10px" type="primary" @click="getLessonProblemRecord()">刷新</el-button>
		</el-form-item>
	</el-form>
	<!-- 正文表格 -->
	<el-table v-loading="loading" :data="stateData.tableData" :max-height="500" class="table-list" style="width: 100%">
		<el-table-column
			v-for="(item, index) in stateData.tableHead"
			:key="index"
			:index="item.index"
			:label="item.label"
			:property="item.property"
			align="center"
		>
			<template #header>
				<el-tooltip :content="item.label" class="table_head" placement="top">
					<div class="table_head">{{ item.label }}</div>
				</el-tooltip>
			</template>
			<template #default="scope">
				<div>
					<p v-if="scope.column.property !== 'problemRecords'">{{ scope.row[scope.column.property] }}</p>
					<span v-else>
						<el-tag
							v-if="scope.row[scope.column.property][scope.column.index].submitStatus !== null"
							:type="setTagType(scope.row[scope.column.property][scope.column.index].submitStatus)"
							style="cursor: pointer"
							@click="clickHandle(scope.row, scope.column.index)"
						>
							{{ setContent(scope.row[scope.column.property][scope.column.index]) }}</el-tag
						>
					</span>
				</div>
			</template>
		</el-table-column>
	</el-table>

	<problem-record ref="problemRecordRef"></problem-record>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ProblemRecord from './problem-record.vue'
import { answerSituationApi } from '@/api/judge/examRecord'

const props = defineProps({
	modelValue: {
		type: String,
		required: true
	}
})
const examId = ref(props.modelValue)
const loading = ref(false)
const problemRecordRef = ref()
const clickHandle = (row: any, index: number) => {
	problemRecordRef.value.init(row.problemRecords[index].problemId, row.problemRecords[index].problemType, 3, examId.value, row.userId, state.dataList)
}
const state = reactive({
	queryForm: {
		examId: examId.value,
		status: 2,
		name: null,
		isCorrecting: null
	},
	createdIsNeed: false,
	dataList: []
})

const stateData = reactive({
	tableHead: [
		{
			index: null,
			label: '姓名',
			property: 'name'
		}
	],
	tableData: [
		{
			userId: 0,
			name: '张三',
			lessonId: 0,
			problemRecords: [
				{
					recordId: 326,
					spendTime: null,
					submitStatus: 4,
					problemId: 16,
					problemType: 1,
					problemName: '测试啊',
					type: 1,
					submitTime: '',
					beginTime: null
				}
			]
		}
	]
})

const setTagType = (submitStatus: number) => {
	if (submitStatus === 0) {
		return
	}
	if (submitStatus === 3) {
		return 'success'
	}
	if (submitStatus === 4) {
		return 'danger'
	}
}
const setContent = (item: any) => {
	if (item.spendTime !== null) {
		return item.spendTime.toString()
	} else {
		if (item.submitStatus == 0) {
			return 'O J'
		}
		if (item.submitStatus == 3) {
			return 'A C'
		}
		if (item.submitStatus == 4) {
			return 'W A'
		}
	}
}

let dataList = reactive<number[]>([])

const getLessonProblemRecord = async () => {
	await answerSituationApi(state.queryForm).then(res => {
		state.dataList = res.data
	})
	stateData.tableHead = [
		{
			index: null,
			label: '姓名',
			property: 'name'
		}
	]
	stateData.tableData = []
	if (state.dataList.length !== 0) {
		let head = state.dataList[0].problemRecords
		head.forEach((item?: any, index?: any) => {
			stateData.tableHead.push({ index: index, property: 'problemRecords', label: item.problemName })
		})
		stateData.tableData.push(...state.dataList)
	}
}

getLessonProblemRecord()
</script>

<style scoped>
.table_head {
	white-space: nowrap !important;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
