<template>
	<el-card>
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-form-item >
          <el-input v-model="state.queryForm.studentName" placeholder="学生姓名" clearable></el-input>
        </el-form-item>
        <el-form-item >
          <el-date-picker type="datetime" placeholder="沟通时间" clearable format="YYYY-MM-DD HH:mm:ss" v-model="state.queryForm.time" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
      <el-table-column prop="studentName" label="学生" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="教务老师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="target" label="沟通对象" header-align="center" align="center"></el-table-column>
			<el-table-column prop="time" label="沟通时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="theme" label="沟通主题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="沟通内容" header-align="center" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<span>暂无</span>
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

<script setup lang="ts" name="TeachCommunicateRecordIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import {dataListUrl,deleteUrl} from '@/api/teach/teachcommunicaterecord'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
    studentName:'',
    time:'',
	}
})


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
