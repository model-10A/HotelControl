<template>
	<el-card>
		班级状态：
		<el-select v-model="classDataForm.status" class="m-2" placeholder="Select" size="large" @change="changeClassStatus">
			<el-option :key="2" label="进行中" :value="2" />
			<el-option :key="3" label="已结束" :value="3" />
		</el-select>
		<div style="font-size: 30px; font-weight: 800">班级列表</div>
		<br />
		<el-empty v-show="classDataForm.classList.length === 0" description="暂无班级" :image-size="200" />
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane v-for="item in classDataForm.classList" :key="item.id" :label="item.id" :name="item.id">
				<template #label>
					<div
						:class="{ tab_choose: activeName === item.id, tab_noChoose: activeName !== item.id }"
						style="padding: 20px; border-radius: 5px; width: 200px"
					>
						<div class="tab_card">《{{ item.name }}》</div>
						<div class="tab_card">结束时间：{{ item.endTime }}</div>
						<div class="tab_card">班主任： {{ item.teacher1Name }}老师</div>
						<div class="tab_card">上课老师：{{ item.teacher2Name }}老师</div>
						<br />
					</div>
				</template>
				<!--				<div v-show="item.nextLesson !== null">-->
				<!--					<h1>下一次课程</h1>-->
				<!--					<br />-->
				<!--					<el-card>-->
				<!--						<el-row justify="space-between">-->
				<!--							<el-col :span="12">-->
				<!--								<div class="vid-list-item&#45;&#45;title">课名：{{ item.lessonName }} 地点：{{ item.lessonPlace }}</div>-->
				<!--								<div class="vid-list-item&#45;&#45;sub-title">{{ item.lessonStartTime }} ~ {{ item.lessonFinishTime }}</div>-->
				<!--							</el-col>-->
				<!--							<el-col :span="3">-->
				<!--								<el-tag v-if="item.lessonStartTime > nowDate">未开启</el-tag>-->
				<!--								<el-tag v-else-if="item.lessonStartTime <= nowDate && item.lessonFinishTime >= nowDate" type="success">进行中</el-tag>-->
				<!--								<el-tag v-else-if="item.lessonFinishTime < nowDate" type="info">已结束</el-tag>-->
				<!--							</el-col>-->
				<!--							<el-col :span="6" :offset="3">-->
				<!--								<el-button type="primary" @click="setUpHandle(item.id, item.nextLesson)">设置</el-button>-->
				<!--								<el-button type="primary" @click="gotoLesson(item.nextLesson)">进入</el-button>-->
				<!--							</el-col>-->
				<!--						</el-row>-->
				<!--					</el-card>-->
				<!--					<br />-->
				<!--				</div>-->
			</el-tab-pane>
		</el-tabs>
		<el-form :inline="true" :model="classUserData.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="classUserData.queryForm.realName" placeholder="用户名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table :loading="classUserData.dataListLoading" :data="classUserData.dataList" border style="width: 100%">
			<el-table-column prop="userId" label="用户ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="用户名" header-align="center" align="center"></el-table-column>
			<!--			<el-table-column prop="joinLessonTimes" label="加入课次" header-align="center" align="center"></el-table-column>-->
			<!--			<el-table-column prop="quitLessonTimes" label="退出课次" header-align="center" align="center"></el-table-column>-->
			<el-table-column prop="joinTime" show-overflow-tooltip label="加入时间" header-align="center" align="center" width="120"></el-table-column>
			<!--			<el-table-column prop="quitTime" show-overflow-tooltip label="退出时间" header-align="center" align="center"></el-table-column>-->
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.status === 1"><el-tag type="success">正常</el-tag></span>
					<span v-if="scope.row.status === 2"><el-tag type="danger">退课</el-tag></span>
				</template>
			</el-table-column>
			<el-table-column prop="lateTimes" label="迟到次数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="homeworkTimes" label="作业按时完成数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="unfinishedProblemNum" label="作业未完成数" header-align="center" align="center"></el-table-column>
			<!--			<el-table-column prop="paymentAmount" label="缴费金额" header-align="center" align="center"></el-table-column>-->
			<!--			<el-table-column prop="paymentTimes" label="缴费时间" header-align="center" align="center"></el-table-column>-->
			<!--			<el-table-column prop="paymentTrue" label="实际金额" header-align="center" align="center"></el-table-column>-->
<!--			<el-table-column label="操作" header-align="center" align="center">-->
<!--				<template #default="scope">-->
<!--					<el-button type="text" size="small" @click="ToScoreStudentHandle(scope.row)">评价</el-button>-->
<!--				</template>-->
<!--			</el-table-column>-->
		</el-table>

		<el-pagination
			:current-page="classUserData.page"
			:page-sizes="classUserData.pageSizes"
			:page-size="classUserData.limit"
			:total="classUserData.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<!--弹窗-->
		<set-up-lesson ref="SetUpLessonRef" @refreshDataList="getClassList"></set-up-lesson>
		<to-score-student ref="ToScoreStudentRef"></to-score-student>
	</el-card>
</template>

<script lang="ts" setup name="ClassroomMyclassTeacherIndex">
import { reactive, ref } from 'vue'
import { useTeacherClassListApi } from '@/api/teach/class'
import { router } from '@/router'
import moment from 'moment'
import SetUpLesson from '@/views/classroom/myclass/teacher/set-up-lesson.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataPageUrl } from '@/api/teach/classuser'
import { useCrud } from '@/hooks'
import ToScoreStudent from './to-score-student.vue'
import { dataListUrl } from '@/api/lessons/lesson'
const activeName = ref()

const classDataForm = reactive({
	status: 2,
	classList: [
		{
			id: '',
			name: '',
			endTime: '',
			teacher1Name: '',
			teacher2Name: '',
			nextLesson: '',
			frequency: '',
			lessonName: '',
			lessonStartTime: '',
			lessonFinishTime: '',
			lessonStatus: 0,
			lessonPlace: ''
		}
	]
})

const classUserData: IHooksOptions = reactive({
	dataListUrl: dataPageUrl,
	queryForm: {
		realName: '',
		classId: ''
	},
	createdIsNeed: false
})

const ToScoreStudentRef = ref()

const ToScoreStudentHandle = (row: any) => {
	ToScoreStudentRef.value.init(row, classUserData.queryForm.classId)
}

const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const getClassList = () => {
	useTeacherClassListApi(classDataForm.status).then(res => {
		classDataForm.classList = res.data
		if (classDataForm.classList.length > 0) {
			activeName.value = classDataForm.classList[0].id
			classUserData.queryForm.classId = classDataForm.classList[0].id
			getDataList()
		}
	})
}
getClassList()
const SetUpLessonRef = ref()
const setUpHandle = (classId: number, lessonId: number) => {
	SetUpLessonRef.value.init(classId, lessonId)
}
const changeClassStatus = () => {
	classUserData.dataList = []
	getClassList()
}

const gotoLesson = (id: any) => {
	router.push({ path: '/classroom/tea-lesson/' + id })
}
const handleClick = (e: any) => {
	activeName.value = e.props.name
	classUserData.queryForm.classId = e.props.name
	classUserData.dataList = []
	getDataList()
}
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(classUserData)
</script>

<style scoped>
.tab_card {
	margin: 0;
	padding: 0;
	line-height: 20px;
	width: 200px;
	overflow: hidden;
}

.tab_choose {
	background-color: #207ff6;
	color: white;
}
.tab_noChoose {
	color: black;
	border: #e3e6ec solid 1px;
}
.vid-list-item--title {
	height: 20px;
	overflow: hidden;
	width: 450px;
	font-size: 14px;
	color: #192630;
	-o-text-overflow: ellipsis;
	text-overflow: ellipsis;
}
.vid-list-item--sub-title {
	width: 450px;
	font-size: 12px;
	color: #82919e;
}
</style>
