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
					<el-button type="primary" @click="gotoLesson(scope.row.id)">课堂情况</el-button>
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
	</el-card>
</template>

<script lang="ts" name="ClassroomMylessonTeacherIndex" setup>
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataAllLessonPageUrl, dataPageUrl } from '@/api/lessons/lesson'
import { router } from '@/router'
import { useCrud } from '@/hooks'
import { useTeacherClassListApi } from '@/api/teach/class'
import moment from 'moment'
const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const state: IHooksOptions = reactive({
	dataListUrl: dataAllLessonPageUrl,
	queryForm: {
		classId: '',
		name: '',
		date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
	}
})

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

const gotoLesson = (id: any) => {
	router.push({ path: '/teach/info-lesson/' + id })
}
const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped></style>
