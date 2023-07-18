<template>
	<el-form :inline="true">
		<el-form-item>
			<el-select v-model="query.type" placeholder="练习类型" @change="getLessonProblemRecord()">
				<el-option label="全部" :value="null"></el-option>
				<el-option :value="0" label="预习作业"></el-option>
				<el-option :value="1" label="课堂习题"></el-option>
				<el-option :value="2" label="作业列表"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item> <el-button type="primary" style="margin-left: 10px" @click="getLessonProblemRecord()">刷新</el-button></el-form-item>
		<el-form-item> <el-tag>O J</el-tag>：已提交 </el-form-item>
		<el-form-item> <el-tag class="ml-2" type="success">A C</el-tag>：正确 </el-form-item>
		<el-form-item> <el-tag class="ml-2" type="danger">W A</el-tag>：错误</el-form-item>
	</el-form>
	<!-- 正文表格 -->
	<el-table v-loading="loading" class="table-list" :data="state.tableData" :max-height="500" style="width: 100%">
		<el-table-column
			v-for="(item, index) in state.tableHead"
			:key="index"
			:label="item.label"
			:property="item.property"
			:index="item.index"
			align="center"
		>
			<template #header>
				<el-tooltip class="table_head" :content="item.label" placement="top">
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
import { useLessonProblemRecordApi } from '@/api/judge/lessonRecord'
import ProblemRecord from '@/views/classroom/lesson/teacher/lesson-problem/problem-record.vue'
import moment from 'moment'
const props = defineProps({
	modelValue: {
		type: String,
		required: true
	}
})

const lessonId = ref(props.modelValue)
const loading = ref(false)
const problemRecordRef = ref()
const clickHandle = (row: any, index: number) => {
	problemRecordRef.value.init(
		row.problemRecords[index].problemId,
		row.problemRecords[index].problemType,
		row.problemRecords[index].type,
		lessonId.value,
		row.userId
	)
}
const state = reactive({
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

const query = reactive({
	lessonId: lessonId.value,
	type: 1
})
const init = (item: any) => {
	let nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	console.log(item.beginTime)
	if (nowTime < item.beginTime) {
		query.type = 1
	} else if (nowTime >= item.beginTime && nowTime <= item.endTime) {
		query.type = 1
	} else {
		query.type = 2
	}
	getLessonProblemRecord()
}
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
const getLessonProblemRecord = () => {
	loading.value = true
	useLessonProblemRecordApi(query)
		.then((res?: any) => {
			state.tableHead = [
				{
					index: null,
					label: '姓名',
					property: 'name'
				}
			]
			state.tableData = []
			if (res.data.length !== 0) {
				let head = res.data[0].problemRecords

				head.forEach((item?: any, index?: any) => {
					state.tableHead.push({ index: index, property: 'problemRecords', label: item.problemName })
				})
				state.tableData.push(...res.data)
			}
		})
		.finally(() => {
			loading.value = false
		})
}

defineExpose({
	init
})
</script>

<style scoped>
.table_head {
	white-space: nowrap !important;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
