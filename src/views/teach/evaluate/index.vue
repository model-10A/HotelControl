<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.name" clearable placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.className" clearable placeholder="班级"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="state.queryForm.lessonName" clearable placeholder="课堂"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column align="center" header-align="center" label="ID" prop="stuId"></el-table-column>
			<el-table-column align="center" header-align="center" label="姓名" prop="name"></el-table-column>
			<el-table-column align="center" header-align="center" label="班级" prop="className" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="课堂" prop="lessonName" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="评价至系统" prop="sysEvaluation" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" header-align="center" label="评价至老师" prop="sysEvaluation" show-overflow-tooltip></el-table-column>
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

<script lang="ts" setup>
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { deleteUrl, dataListUrl } from '@/api/teach/teachevaluate'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
import {onMounted} from "vue";
import {useUserInfoApi} from "@/api/sys/user";
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const state: IHooksOptions = reactive({
	deleteUrl: deleteUrl,
	dataListUrl: dataListUrl,
	queryForm: {
		name: '',
		lessonName: '',
		className: '',
    orgId:''
	},
	dataList: [
		{
			id: '',
			stuId: '',
			name: '',
			lessonName: '',
			sysEvaluation: '',
			teaEvaluation: ''
		}
	]
})
const getOrgId = async () =>{
  const {data:data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  getDataList()
}
onMounted(()=>{
  getOrgId()
})
const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
