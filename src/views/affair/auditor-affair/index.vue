<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.realName" placeholder="真实姓名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="addOrUpdateHandle()">试听课程列表</el-button>
				</el-form-item>
			</el-form>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="realName" label="真实姓名" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="phone" label="手机号码" header-align="center" align="center" width="120"></el-table-column>
			<fast-table-column prop="grade" label="年级" dict-type="grade" header-align="center" width="90"></fast-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="90">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 2" type="danger" size="large">未试听</el-tag>
					<el-tag v-if="scope.row.status === 3" type="success" size="large">已试听</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="purpose" label="意向说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherOpinion" label="是否评价" header-align="center" align="center" width="100">
				<template #default="scope">
					<el-tag v-if="scope.row.teacherOpinion == null" type="danger" size="large">未评价</el-tag>
					<el-tag v-if="scope.row.teacherOpinion != null" type="success" size="large">已评价</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button v-if="scope.row.status == 2" type="text" @click="addLessonHandle(scope.row.id)">加入试听课</el-button>
					<el-button
						v-if="scope.row.status == 3 && scope.row.teacherOpinion == null"
						type="text"
						style="color: rgba(255, 0, 0, 0.84)"
						@click="opinion(scope.row)"
						>评价</el-button
					>
					<el-button v-if="scope.row.status == 3 && scope.row.teacherOpinion != null" type="text" @click="opinion(scope.row)">查看评价</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.pageIndex"
			:page-sizes="state.pageSizes"
			:page-size="state.pageSize"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
		<join-lesson ref="joinLesson" @refreshDataList="getDataList"></join-lesson>
		<teacher-opinion ref="opinionRef" @refreshDataList="getDataList"></teacher-opinion>
	</el-card>
</template>

<script setup lang="ts" name="EnrollLessonIndex">
import { dataListUrl } from '@/api/affair/enrolluser'
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import JoinLesson from '@/views/affair/auditor-affair/join-lesson.vue'
import { deleteUrl } from '@/api/affair/enrollLesson'
import TeacherOpinion from '@/views/affair/auditor-affair/teacher-opinion.vue'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		realName: '',
		status: 2
	}
})

const joinLesson = ref()
const addLessonHandle = (id?: number) => {
	joinLesson.value.init(id)
}
const opinionRef = ref()
const opinion = (row: any) => {
	console.log(row)
	opinionRef.value.init(row.id, row.teacherOpinion, row.parentOpinion)
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
