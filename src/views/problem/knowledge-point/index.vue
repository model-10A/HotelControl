<template>
	<el-card class="mod__menu">
		<el-form :inline="true">
			<el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
		</el-form>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			:expand-row-keys="state.dataListSelections"
			border
			row-key="id"
			style="width: 100%"
		>
			<el-table-column header-align="center" label="名称" min-width="200" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="代码" min-width="150" prop="code"></el-table-column>
			<el-table-column align="center" header-align="center" label="等级" min-width="150" prop="level"></el-table-column>
			<el-table-column align="center" header-align="center" label="说明" min-width="150" prop="description" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="排序" prop="sort"></el-table-column>
			<el-table-column align="center" fixed="right" header-align="center" label="题目" width="150">
				<template #default="scope">
					<el-button link type="primary" @click="showProblemDetail(scope.row.code)">详情</el-button>
				</template>
			</el-table-column>
			<!--			<el-table-column label="关系" fixed="right" header-align="center" align="center" width="150">-->
			<!--				<template #default="scope">-->
			<!--					<el-button type="primary" link>前驱</el-button>-->
			<!--				</template>-->
			<!--			</el-table-column>-->
			<el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
				<template #default="scope">
					<el-button v-if="scope.row.pid == 0" link type="primary" @click="showDetail(scope.row)">详情</el-button>
					<el-button link type="primary" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>

					<el-button link type="primary" @click="deleteHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<add-or-update ref="addOrUpdateRef" @refreshDataList="knowledgeInstall"></add-or-update>
		<kp-detail ref="kpDetailRef"></kp-detail>
		<kp-problem-detail ref="kpProblemDetailRef"></kp-problem-detail>
	</el-card>
</template>

<script lang="ts" name="ProblemKnowledge-pointIndex" setup>
import { useCrud } from '@/hooks'
import KpProblemDetail from '@/views/problem/knowledge-point/kp-problem-detail.vue'
import { reactive, ref } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl } from '@/api/problem/knowledgepoint'
import service from '@/utils/request'
import KpDetail from '@/views/problem/knowledge-point/kp-detail.vue'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	isPage: false,
	createdIsNeed: false,
	dataList: [],
	dataListSelections: []
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, deleteHandle } = useCrud(state)
const knowledgeInstall = () => {
	state.dataListLoading = true

	service
		.get(state.dataListUrl)
		.then((res: any) => {
			state.dataList = res.data
			// state.dataList?.forEach(item => {
			// 	if (item.level <= 2) {
			// 		state.dataListSelections?.push(String(item.id))
			// 	}
			// })
		})
		.finally(() => {
			state.dataListLoading = false
		})
}
const kpDetailRef = ref()
const showDetail = (row: any) => {
	kpDetailRef.value.init(row)
}
const kpProblemDetailRef = ref()
const showProblemDetail = (code: any) => {
	kpProblemDetailRef.value.init(code)
}

knowledgeInstall()
</script>
