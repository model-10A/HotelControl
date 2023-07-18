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
				<el-button link size="small" type="primary" @click="attendPaper(scope.row.id)">参加考试</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import moment from 'moment'
import { router } from '@/router'
import { useExamListByClassIdApi, useExamListByLessonIdApi } from '@/api/lessons/exam.ts'
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const state = reactive({
	dataList: [] as any,
	dataListLoading: true
})

const init = () => {
	useExamListByLessonIdApi(props.modelValue).then((res: any) => {
		if (res.data === []) {
			state.dataList = []
		} else {
			state.dataList = res.data
		}
	})
	state.dataListLoading = false
}

init()

let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

const isEnd = (time: any) => {
	if (time < now) {
		return true
	} else {
		return false
	}
}

const dialogVisible = ref(false)
const examId = ref(props.modelValue)

const grade = ref()

const attendPaper = (id?: number) => {
	router.push({ path: '/exam/attend-exam/' + id })
}
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
