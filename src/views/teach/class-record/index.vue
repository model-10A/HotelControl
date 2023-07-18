<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-select v-model="state.queryForm.type" clearable  placeholder="选择记录类型">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
			</el-form-item>
      <el-form-item >
        <el-input v-model="state.queryForm.studentName" placeholder="学生姓名" clearable></el-input>
      </el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" @selection-change="selectionChangeHandle">
			<el-table-column prop="studentName" label="学生" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="教务老师" header-align="center" align="center"></el-table-column>
      <el-table-column prop="recordTime" label="记录时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="类型" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type ===1">插班</el-tag>
          <el-tag v-else-if="scope.row.type ===2" type="success">换班</el-tag>
          <el-tag v-else-if="scope.row.type ===3" type="info">退班</el-tag>
        </template>
      </el-table-column>
			<el-table-column prop="oldClassName" label="原有班级" header-align="center" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.oldClassName === null">空</span>
          <span v-else>{{scope.row.oldClassName}}</span>
        </template>
      </el-table-column>
			<el-table-column prop="newClassName" label="新班级" header-align="center" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.newClassName === null">空</span>
          <span v-else>{{scope.row.newClassName}}</span>
        </template>
      </el-table-column>
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

<script setup lang="ts" name="TeachClassRecordIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import {dataListUrl,deleteUrl} from '@/api/teach/teachclassrecord.ts'

const options = ref([
  {
    value:1,
    label:'插班'
  },
  {
    value:2,
    label:'换班'
  },
  {
    value:3,
    label:'退班'
  },
])

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		type: '',
    studentName:''
	}
})


const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
