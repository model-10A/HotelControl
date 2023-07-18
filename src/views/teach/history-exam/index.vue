<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="考试名称"></el-input>
			</el-form-item>

			<el-form-item>
				<el-select v-model="state.queryForm.classId" clearable filterable placeholder="选择班级">
					<el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-select v-model="state.queryForm.type" clearable filterable placeholder="考试类型">
					<el-option :key="0" :value="0" label="普通考试" />
					<el-option :key="1" :value="1" label="能力考试" />
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-date-picker
					v-model="timeValues"
					end-placeholder="结束时间"
					format="YYYY-MM-DD"
					range-separator="至"
					start-placeholder="开始时间"
					type="daterange"
					value-format="YYYY-MM-DD"
					@change="timeChange()"
				/>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
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
					<el-button link size="small" type="primary" @click="gotoExam(scope.row.id)">进入考场</el-button>
					<el-divider direction="vertical" />
					<el-button :disabled="!isEnd(scope.row.endTime)" link size="small" type="primary" @click="exportExamExcel(scope.row.id)"
						>导出考试</el-button
					>
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

		<el-dialog v-model="dialogVisible" title="请填写通过的分数" width="400px">
			<el-input v-model="grade" placeholder="输入通过分数" style="width: 200px"></el-input>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="promulgateGrade()"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</el-card>
</template>

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import moment from 'moment'
import UpdateExam from '@/views/exam/exammanage/updateExam.vue'
import IpRestriction from '@/views/classroom/mylesson/teacher/ip-restriction/ip-restriction.vue'
import { dataListUrl, deleteUrl, useExamExcelApi, usePromulgateGradeApi } from '@/api/lessons/exam'
import { router } from '@/router'
import store from '@/store'
import { useOpenClassesApi, useTeacherClassListApi } from '@/api/teach/class'
import { ElMessage } from 'element-plus'

const updateExamRef = ref()
const timeValues = ref([])

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		beginTime: null,
		endTime: null,
		name: null,
		classId: null,
		type: null
	}
})
const classList = ref([])
const getOpenClasses = () => {
	if (!store.userStore.user.roleIdList.includes(1) && !store.userStore.user.roleIdList.includes(2)) {
		useOpenClassesApi().then(res => (classList.value = res.data))
	} else {
		useTeacherClassListApi(2).then(res => (classList.value = res.data))
	}
}
getOpenClasses()

const addOrUpdateRef = ref()
const addOrUpdateHandle = () => {
	router.push({ path: '/exam/exammanage/addExam' })
}
const timeChange = () => {
	state.queryForm.beginTime = timeValues.value[0]
	state.queryForm.endTime = timeValues.value[1]
}
let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

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

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
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
