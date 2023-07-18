<template>
	<el-card>
		<el-divider>进行中</el-divider>
		<div>
			<el-empty v-show="ExamingDataFrom.examingList.length === 0" :image-size="80" description="暂无进行中的考试" />

			<el-space wrap>
				<el-card
					v-for="item in ExamingDataFrom.examingList"
					:key="item"
					:body-style="{ padding: '0 5px 5px 5px' }"
					style="width: 300px; margin-left: 10px"
				>
					<template #header>
						<div class="card-header">
							<span
								style="
									font-size: 17px;
									font-weight: 700;
									display: inline-block;
									width: 100%;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								"
								>{{ item.name }}</span
							>
							<el-button
								v-if="item.status < 2 && item.beginTime < now && item.endTime > now"
								class="button"
								type="primary"
								@click="attendPaper(item.id)"
								>进入考试</el-button
							>
							<el-button v-if="item.status === 2" disabled plain type="success"> 已交卷 </el-button>
							<el-button v-if="item.status < 2 && item.beginTime > now" disabled plain> 未开始 </el-button>
						</div>
					</template>
					<div class="text item">考试时间：{{ item.beginTime.substring(5) }}至{{ item.endTime.substring(5) }}</div>
					<div class="text item">考试时长：{{ item.timeLimit }}</div>
					<div class="text item">考试地点：{{ item.place === '' ? '无' : item.place }}</div>
					<div class="text item">监考老师：{{ item.teacherName }}</div>
					<div v-if="item.gainAbilityName != null" class="text item">考试获得等级：{{ item.gainAbilityName }}</div>
				</el-card>
			</el-space>
		</div>

		<el-divider>全部</el-divider>
		<div>
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" placeholder="考试名称"></el-input>
				</el-form-item>
				<!--				<el-form-item>-->
				<!--					<el-input v-model="state.queryForm.className" placeholder="班级名称"></el-input>-->
				<!--				</el-form-item>-->
				<el-form-item>
					<el-select v-model="state.queryForm.status" class="m-2" placeholder="状态">
						<el-option :key="1" :value="2" label="已交卷" />
						<el-option :key="1" :value="0" label="未参与" /> </el-select
				></el-form-item>
				<el-form-item>
					<el-date-picker
						v-model="timeValues"
						end-placeholder="结束时间"
						format="YYYY-MM-DD HH:mm:ss"
						range-separator="至"
						start-placeholder="开始时间"
						type="datetimerange"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="searchDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="invitationCodeHandle()">添加考试</el-button>
				</el-form-item>
			</el-form>

			<el-table :data="state.dataList" :header-cell-style="{ background: '#f9f9f9', color: '#313030' }" border style="width: 100%">
				<el-table-column type="expand">
					<template #default="scope">
						<div style="width: 90%; margin: auto">
							<el-descriptions :column="2" border class="margin-top" title="其他信息">
								<el-descriptions-item label="考试地点">
									{{ scope.row.place === '' ? '-' : scope.row.place }}
								</el-descriptions-item>
								<el-descriptions-item label="参与班级">
									{{ scope.row.classListName.length === 0 ? '-' : scope.row.classListName.join('、') }}
								</el-descriptions-item>
								<el-descriptions-item label="监考老师">
									{{ scope.row.teacherName === '' ? '-' : scope.row.teacherName }}
								</el-descriptions-item>
								<el-descriptions-item label="考试说明">
									{{ scope.row.description === '' ? '-' : scope.row.description }}
								</el-descriptions-item>
								<el-descriptions-item v-if="scope.row.type === 1" label="要求等级">
									{{ scope.row.requireAbilityName }}
								</el-descriptions-item>
								<el-descriptions-item v-if="scope.row.type === 1" label="颁发等级">
									{{ scope.row.gainAbilityName }}
								</el-descriptions-item>
							</el-descriptions>
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="考试名称" prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" header-align="center" label="监考老师" prop="teacherName" width="100"></el-table-column>
				<el-table-column align="center" header-align="center" label="考试时间" prop="beginTime" width="340">
					<template #default="scope"> {{ scope.row.beginTime }} ~ {{ scope.row.endTime.substring(5) }} </template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="考试时长" prop="timeLimit" width="100"></el-table-column>
				<el-table-column align="center" header-align="center" label="考试类型" prop="type" width="100">
					<template #default="scope">
						<div v-if="scope.row.type === 0">普通考试</div>
						<div v-else>能力考试</div>
					</template>
				</el-table-column>
				<el-table-column align="center" header-align="center" label="状态" prop="status" width="80">
					<template #default="scope">
						<el-tag v-if="scope.row.status === 0 && scope.row.endTime < now" type="danger"> 已过期 </el-tag>
						<el-tag v-if="scope.row.status === 0 && scope.row.beginTime < now && scope.row.endTime > now"> 未参加 </el-tag>
						<el-tag v-if="scope.row.status === 0 && scope.row.beginTime > now" type="info"> 未开始 </el-tag>
						<el-tag v-else-if="scope.row.status === 1">进行中</el-tag>
						<el-tag v-else-if="scope.row.status === 2 && scope.row.isCorrecting === 0">未批改</el-tag>
						<el-tag v-else-if="scope.row.status === 2 && scope.row.isCorrecting === 1" type="success">已批改</el-tag>
					</template>
				</el-table-column>

				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="150">
					<template #default="scope">
						<el-button
							v-if="scope.row.status <= 1 && scope.row.beginTime < now && scope.row.endTime > now"
							link
							type="primary"
							@click="attendPaper(scope.row.id)"
							>参加考试</el-button
						>

						<el-button v-else-if="scope.row.status === 2 && scope.row.isCorrecting === 1" link type="primary" @click="showGrades(scope.row.id)"
							>查看成绩</el-button
						>
						<span v-else>暂无</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="state.page"
				:page-size="state.limit"
				:page-sizes="state.pageSizes"
				:total="state.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
		</div>
		<invitation-code-students
			ref="invitationCodeStudentsRef"
			@refreshDataList="getDataList"
			@refreshDataList2="getExamingDataList"
		></invitation-code-students>
		<grades-chart ref="gradesChartsRef"></grades-chart>
	</el-card>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import { useRouter } from 'vue-router'
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { useCrud } from '@/hooks'
import { getExamingDataApi, stuDataListUrl } from '@/api/lessons/exam'
import InvitationCodeStudents from '@/views/classroom/exam/invitation-code-students.vue'
import GradesChart from '@/views/classroom/exam/grades-chart.vue'
import { useExamRecordApi } from '@/api/judge/examRecord'
import store from '@/store'
import moment from 'moment'

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}

const router = useRouter()
const attendPaper = (id?: number) => {
	router.push({ path: '/exam/attend-exam/' + id })
}

const timeValues = ref([])
const state: IHooksOptions = reactive({
	dataListUrl: stuDataListUrl,
	queryForm: {
		description: '',
		beginTime: '',
		endTime: '',
		name: '',
		place: '',
		className: '',
		teacherName: '',
		status: ''
	}
})
const now = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))

const ExamingDataFrom = reactive({
	examingList: [
		{
			beginTime: '',
			endTime: '',
			name: '',
			place: '',
			className: '',
			teacherName: '',
			timeLimit: '',
			paperId: 0,
			type: '',
			requireAbility: '',
			gainAbilityId: '',
			requireAbilityName: '',
			gainAbilityName: ''
		}
	]
})

const getExamingDataList = () => {
	getExamingDataApi().then(res => {
		ExamingDataFrom.examingList = res.data
	})
}
const gradesChartsRef = ref()
const showGrades = (examId: number) => {
	useExamRecordApi({ examId: examId, userId: store.userStore.user.id }).then(res => {
		console.log(res.data.problemRecords)
		gradesChartsRef.value.getData(res.data.problemRecords)
	})
}
const searchDataList = () => {
	if (timeValues.value.length > 0) {
		state.queryForm.beginTime = timeValues.value[0]
		state.queryForm.endTime = timeValues.value[1]
	} else {
		state.queryForm.beginTime = null
		state.queryForm.endTime = null
	}
	getDataList()
}
const invitationCodeStudentsRef = ref()
const invitationCodeHandle = () => {
	invitationCodeStudentsRef.value.init()
}

getExamingDataList()

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped>
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.text {
	font-size: 14px;
}

.item {
	margin-top: 10px;
}

.el-col {
	margin-bottom: 20px;
	display: flex;
	flex-wrap: wrap;
}
.el-card ::v-deep .el-card__header {
	padding: 10px 10px;
	/*background-color: #02ff07;*/
}
</style>
