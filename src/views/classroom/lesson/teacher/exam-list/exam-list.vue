<template>
	<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
		<el-table-column type="expand">
			<template #default="scope">
				<div style="width: 90%; margin: auto">
					<el-descriptions :column="2" border title="其他信息">
						<el-descriptions-item label="考试地点">
							{{ scope.row.place === '' ? '-' : scope.row.place }}
						</el-descriptions-item>
						<el-descriptions-item v-if="scope.row.classListName != null" label="参与班级">
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
				<el-tag v-if="scope.row.endTime < now" size="small" type="danger"> 已结束 </el-tag>
				<el-tag v-else-if="scope.row.beginTime > now" size="small" type="info"> 未开始 </el-tag>
				<el-tag v-else size="small" type="success">进行中</el-tag>
			</template>
		</el-table-column>

		<el-table-column align="center" fixed="right" header-align="center" label="操作" width="320">
			<template #default="scope">
				<el-button link size="small" type="primary" @click="getInvitation(scope.row.id)">邀请</el-button>
				<el-divider direction="vertical" />
				<el-button link size="small" type="primary" @click="gotoExam(scope.row.id)">进入考场</el-button>
				<el-divider direction="vertical" />
				<el-button :disabled="!isEnd(scope.row.endTime)" link size="small" type="primary" @click="exportExamExcel(scope.row.id)">导出考试</el-button>
				<el-divider v-if="scope.row.type === 1" direction="vertical" />
				<el-button
					v-if="scope.row.type === 1"
					:disabled="!isEnd(scope.row.endTime)"
					link
					size="small"
					type="primary"
					@click="showDialog(scope.row.id, scope.row.gainAbilityId)"
					>颁布等级</el-button
				>
				<el-divider direction="vertical" />
				<el-dropdown style="margin: 0" trigger="click">
					<el-button class="el-dropdown-link" link size="small" type="primary">更多</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item @click="gotoIp(scope.row.id)">IP管理</el-dropdown-item>
							<el-dropdown-item @click="updateExamHandle(scope.row)">修改</el-dropdown-item>
							<el-dropdown-item v-if="operateJudge(scope.row.beginTime)" @click="deleteBatchHandle(scope.row.id)">删除</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</template>
		</el-table-column>
	</el-table>

	<el-dialog v-model="dialogVisible" title="请填写通过的分数" width="400px">
		<el-input v-model="grade" placeholder="输入通过分数" style="width: 200px"></el-input>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="promulgateGrade()"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>

	<invitation-code ref="invitationCodeRef"></invitation-code>

	<update-exam ref="updateExamRef" @refreshDataList="getDataList"></update-exam>
	<!--    ip限制弹窗-->
	<ip-restriction ref="ipRestrictionRef"></ip-restriction>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

import moment from 'moment'
import UpdateExam from '@/views/exam/exammanage/updateExam.vue'
import IpRestriction from '@/views/classroom/mylesson/teacher/ip-restriction/ip-restriction.vue'
import { useExamExcelApi, useExamListByLessonIdApi, usePromulgateGradeApi } from '@/api/lessons/exam'
import { router } from '@/router'
import InvitationCode from '@/views/exam/exam-detailed-info/invitation-code.vue'
import { ElMessage } from 'element-plus'
import { number } from 'echarts'
const updateExamRef = ref()
const props = defineProps({
	modelValue: {
		type: [Number, String],
		required: false
	}
})
const state = reactive({
	dataList: [] as any,
	dataListLoading: true
})

const init = (lessonId: Number) => {
	console.log(lessonId)
	useExamListByLessonIdApi(lessonId).then((res: any) => {
		if (res.data === []) {
			state.dataList = []
		} else {
			state.dataList = res.data
		}
	})

	state.dataListLoading = false
}

const ipRestrictionRef = ref()
const gotoIp = (id: any) => {
	ipRestrictionRef.value.init(id)
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = () => {
	router.push({ path: '/exam/exammanage/addExam' })
}

const updateExamHandle = (data: any) => {
	updateExamRef.value.init(data)
}

let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
const operateJudge = (time: any) => {
	if (time < now) {
		return false
	} else {
		return true
	}
}

const isEnd = (time: any) => {
	if (time < now) {
		return true
	} else {
		return false
	}
}

const exportExamExcel = (examId: any) => {
	useExamExcelApi(examId)
}

const gotoExam = (id: number) => {
	router.push({ path: '/exam/tea-exam/' + id })
}

const invitationCodeRef = ref()
const getInvitation = (examId: any) => {
	invitationCodeRef.value.init(examId)
}
const dialogVisible = ref(false)
const examId = ref()
const gainAbilityId = ref()
const showDialog = (eId: any, gAId: any) => {
	examId.value = eId
	gainAbilityId.value = gAId
	dialogVisible.value = true
}

const grade = ref()

const promulgateGrade = async () => {
	if (grade.value != null && grade.value != '') {
		await usePromulgateGradeApi(examId.value, gainAbilityId.value, grade.value)
		ElMessage.success('颁布等级成功！')
	} else {
		ElMessage.error('请填写分数')
	}
}
defineExpose({
	init
})
</script>
<style scoped>
.el-dropdown-link {
	display: flex;
	align-items: center;
	line-height: normal;
}
/*.el-table .cell {*/
/*	white-space: pre-line;*/
/*}*/
</style>
