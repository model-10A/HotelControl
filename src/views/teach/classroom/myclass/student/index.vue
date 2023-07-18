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
		<el-table :data="classUserData.dataList" border style="width: 100%">
			<el-table-column prop="userId" label="用户ID" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="用户名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="joinTime" show-overflow-tooltip label="加入时间" header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template #default="scope">
					<span v-if="scope.row.status === 1"><el-tag type="success">正常</el-tag></span>
					<span v-if="scope.row.status === 2"><el-tag type="danger">退课</el-tag></span>
				</template>
			</el-table-column>
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
	</el-card>
</template>

<script lang="ts" setup name="ClassroomMyclassStudentIndex">
import { reactive, ref } from 'vue'
import { useStudentClassListApi } from '@/api/teach/class'
import { IHooksOptions } from '@/hooks/interface'
import { dataPageUrl } from '@/api/teach/classuser'
import { useCrud } from '@/hooks'
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
const getClassList = () => {
	useStudentClassListApi(classDataForm.status).then(res => {
		classDataForm.classList = res.data
		if (classDataForm.classList.length > 0) {
			activeName.value = classDataForm.classList[0].id
			classUserData.queryForm.classId = classDataForm.classList[0].id
			getDataList()
		}
	})
}
getClassList()

const changeClassStatus = () => {
	classUserData.dataList = []
	getClassList()
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
