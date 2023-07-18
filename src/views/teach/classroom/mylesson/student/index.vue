<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" placeholder="名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="state.queryForm.classId" class="m-2" placeholder="班级" clearable>
					<el-option v-for="item in classDataForm.classList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="className" label="班级名称" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.className === null">试听课</span>
          <span v-else>{{scope.row.className}}</span>
        </template>
      </el-table-column>
			<el-table-column prop="name" label="课堂名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="任课老师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="beginTime" label="预计开课时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endTime" label="预计结课时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="课堂状态" header-align="center" align="center">
				<template #default="scope">
					<el-tag v-if="scope.row.beginTime > nowDate">未开启</el-tag>
					<el-tag v-else-if="scope.row.beginTime <= nowDate && scope.row.endTime >= nowDate" type="success">进行中</el-tag>
					<el-tag v-else-if="scope.row.endTime < nowDate" type="info">已结束</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="操作" header-align="center" align="center">
				<template #default="scope">
					<el-button :disabled="scope.row.endTime < nowDate" @click="callStudentsHandle(scope.row)">请假</el-button>
					<el-button type="primary" @click="gotoLesson(scope.row.id)">进入</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.page"
			:page-sizes="state.pageSizes"
			:page-size="state.limit"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
	</el-card>
</template>

<script lang="ts" setup name="ClassroomMylessonStudentIndex">
import { IHooksOptions } from '@/hooks/interface'
import { reactive, ref } from 'vue'
import { dataPageUrl } from '@/api/lessons/lesson'
import { router } from '@/router'
import { useCrud } from '@/hooks'
import { useTeacherClassListApi } from '@/api/teach/class'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateStudentsApi } from '@/api/lessons/attendlog'

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

const callStudentsHandle = (row: any) => {
	// if (row.status == 0) {
	//   ElMessage.warning("请勿重复请假！")
	//   return
	// }
	ElMessageBox.confirm('确定进行请假操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			let data = {
				lessonId: row.id,
				status: 0
			}
			updateStudentsApi(data).then(() => {
				ElMessage.success('请假成功！')
				getDataList()
			})
		})
		.catch(() => {})
}

const gotoLesson = (id: any) => {
	router.push({ path: '/classroom/stu-lesson/' + id })
}
const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>

<style scoped></style>
