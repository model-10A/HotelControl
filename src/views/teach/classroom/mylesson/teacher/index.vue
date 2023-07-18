<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" clearable placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.classId" class="m-2" clearable placeholder="班级">
					<el-option v-for="item in classDataForm.classList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column align="center" header-align="center" label="班级名称" prop="className"></el-table-column>
			<el-table-column align="center" header-align="center" label="课堂名称" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="任课老师" prop="teacherName"></el-table-column>
			<el-table-column align="center" header-align="center" label="上课地点" prop="place"></el-table-column>
			<el-table-column align="center" header-align="center" label="预计开课时间" prop="beginTime" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="预计结课时间" prop="endTime" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="课堂状态" prop="status">
				<template #default="scope">
					<el-tag v-if="scope.row.beginTime > nowDate">未开启</el-tag>
					<el-tag v-else-if="scope.row.beginTime <= nowDate && scope.row.endTime >= nowDate" type="success">进行中</el-tag>
					<el-tag v-else-if="scope.row.endTime < nowDate" type="info">已结束</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="操作" prop="status" width="300">
				<template #default="scope">
					<el-button type="primary" @click="gotoIp(scope.row.id)">IP限制</el-button>
					<el-button type="primary" @click="gotoUpdateLesson(scope.row.id)">修改</el-button>
					<el-button type="primary" @click="gotoLesson(scope.row.id)">进入</el-button>
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
		<!--    ip限制弹窗-->
		<ip-restriction ref="ipRestrictionRef"></ip-restriction>
		<!--    课程修改按钮-->
		<update-lesson ref="updateLessonRef" @refreshDataList="getDataList"></update-lesson>
	</el-card>
</template>

<script lang="ts" name="ClassroomMylessonTeacherIndex" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataPageUrl } from '@/api/lessons/lesson'
import { router } from '@/router'
import { useCrud } from '@/hooks'
import { useTeacherClassListApi } from '@/api/teach/class'
import IpRestriction from '@/views/classroom/mylesson/teacher/ip-restriction/ip-restriction.vue'
import UpdateLesson from '@/views/classroom/mylesson/teacher/update-lesson.vue'
import moment from 'moment'

const state: IHooksOptions = reactive({
	dataListUrl: dataPageUrl,
	queryForm: {
		classId: '',
		name: ''
	}
})
const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))

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
const getClassList = () => {
	useTeacherClassListApi(classDataForm.status).then(res => {
		classDataForm.classList = res.data
	})
}
getClassList()
const ipRestrictionRef = ref()
const gotoIp = (id: any) => {
	ipRestrictionRef.value.init(id)
}
const updateLessonRef = ref()
const gotoUpdateLesson = (id: number) => {
	updateLessonRef.value.init(id)
}
const gotoLesson = (id: any) => {
	router.push({ path: '/classroom/tea-lesson/' + id })
}
const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped></style>
