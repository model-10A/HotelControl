<template>
	<el-dialog v-model="visible" title="评价" :close-on-click-modal="false">
		<div style="max-height: 50vh; overflow: auto">
			<el-form :inline="true">
				<el-form-item>
					<el-checkbox-group v-model="query.lessonList">
						<el-checkbox v-for="item in lessonState.dataList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchHandle()">查询</el-button>
				</el-form-item>
			</el-form>

			<div style="margin-top: 20px">
				<el-empty v-if="query.flag === 0" description="请选择课程" />
				<stu-line-chart v-else ref="stuLineChartRef"></stu-line-chart>
			</div>
			<el-form ref="dataFormRef" style="max-height: 60vh; overflow: auto" :model="dataForm" label-width="100px" :rules="dataRules">
				<el-form-item label="评价学生" prop="isevaluatedName">
					<span style="font-weight: bold">{{ dataForm.isevaluatedName }}</span>
				</el-form-item>
				<el-form-item label="掌握情况" prop="score">
					<span class="demo-rate-block">
						<el-rate v-model="dataForm.score" :colors="colors" :texts="['差', '较差', '一般', '良好', '优秀']" show-text />
					</span>
				</el-form-item>
				<el-form-item label="评价内容" prop="content">
					<el-input v-model="dataForm.content" type="textarea"></el-input>
				</el-form-item>
			</el-form>
		</div>

		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTeachEvaluateSubmitApi } from '@/api/teach/teachevaluate'
import { ElMessage } from 'element-plus'
import StuLineChart from '@/views/classroom/myclass/teacher/stu-line-chart.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl } from '@/api/lessons/lesson'
import { useCrud } from '@/hooks'
import { getUserLessonRecord } from '@/api/judge/lessonRecord'

const visible = ref(false)
const dataFormRef = ref()

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		classId: 0,
		page: 1,
		limit: 100
	},
	createdIsNeed: false,
	isPage: false
})
const lessonState: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		classId: 0,
		page: 1,
		limit: 100
	},
	createdIsNeed: false,
	isPage: false
})
const query = reactive({
	lessonList: [],
	userId: '',
	type: 1,
	flag: 0
})

const dataForm = reactive({
	id: '',
	evaluateUserId: '',
	isevaluatedName: '',
	evaluatedUserId: '',
	score: 0,
	classId: 0,
	type: 1,
	content: ''
})

const stuLineChartRef = ref()

const init = (item: any, classId: number) => {
	lessonState.queryForm.classId = classId
	getClassDateList()
	visible.value = true
	dataForm.isevaluatedName = item.realName
	dataForm.classId = classId

	dataForm.evaluatedUserId = item.userId
	query.userId = item.userId
	dataForm.score = 0
	dataForm.content = ''
	searchHandle()
}

const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const searchHandle = () => {
	if (query.lessonList.length > 0) {
		query.flag = 1
		getUserLessonRecord(query).then(res => {
			stuLineChartRef.value.setOptionData(res.data)
		})
	} else {
		ElMessage.warning('课程不可为空')
	}
}

const submitHandle = () => {
	console.log(dataForm)
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useTeachEvaluateSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
				}
			})
		})
	})
}

const dataRules = ref({
	score: [{ required: true, type: 'number', min: 1, message: '必选项不能为空', trigger: 'blur' }],
	content: [{ required: true, message: '必选项不能为空' }]
})
const { getDataList } = useCrud(state)
const getClassDateList = () => {
	useCrud(lessonState).getDataList()
}
defineExpose({
	init
})
</script>

<style scoped>
.demo-rate-block {
	text-align: left;
	border-right: solid 1px var(--el-border-color);
	display: inline-block;
	width: 49%;
	box-sizing: border-box;
}
.demo-rate-block:last-child {
	border-right: none;
}
</style>
