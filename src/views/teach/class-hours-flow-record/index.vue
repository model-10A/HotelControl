<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item >
        <el-input v-model="state.queryForm.userName" placeholder="用户名称" clearable></el-input>
      </el-form-item>
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
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" >
			<el-table-column prop="userName" label="用户名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lessonName" label="课堂名称" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.lessonName == null">暂无</span>
          <span v-else>{{scope.row.lessonName}}</span>
        </template>
      </el-table-column>
			<el-table-column prop="normal" label="常规课时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="normalPresent" label="常规赠送课时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="training" label="集训课时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="trainingPresent" label="集训赠送课时" header-align="center" align="center"></el-table-column>
      <el-table-column prop="direction" label="说明" header-align="center" align="center" ></el-table-column>
			<el-table-column prop="type" label="类型" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-show="scope.row.type === 0" type="danger">退课时</el-tag>
          <el-tag v-show="scope.row.type === 1" type="warning">加课时</el-tag>
          <el-tag v-show="scope.row.type === 2" type="success">扣课时</el-tag>
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

<script setup lang="ts" name="TeachClassHoursFlowRecordIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import {dataListUrl} from '@/api/teach/teachclasshoursflowrecord'

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
    userName: '',
		type: null,
	}
})
const options = ref([
  {
    value:0,
    label:'退课时'
  },
  {
    value:1,
    label:'加课时'
  },
  {
    value:2,
    label:'扣课时'
  }
])


const { getDataList,  sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
