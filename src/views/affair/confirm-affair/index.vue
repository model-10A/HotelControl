<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="state.queryForm.realName" placeholder="真实姓名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.grade" placeholder="年级" dict-type="grade"></fast-select>
			</el-form-item>
			<el-form-item>
				<elui-china-area-dht placeholder="所在区域" clearable @change="onChange"></elui-china-area-dht>
			</el-form-item>
			<el-form-item> <el-input v-model="state.queryForm.purpose" placeholder="意向说明" clearable></el-input> </el-form-item>
			<el-form-item>
				<el-date-picker
					v-model="value1"
					type="daterange"
					:clearable="true"
					range-separator="至"
					start-placeholder="注册开始时间"
					end-placeholder="注册结束时间"
					@change="Change"
				/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="clear()">重置</el-button>
			</el-form-item>
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
				</el-form-item>
			</el-form>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="realName" label="真实姓名" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="phone" label="手机号码" show-overflow-tooltip header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="area" label="所在区域" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>
			<!--			<el-table-column prop="grade" label="年级" header-align="center" align="center"></el-table-column>-->
			<fast-table-column prop="grade" label="年级" dict-type="grade" header-align="center" width="90"></fast-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="90">
				<template #default="scope">
					<el-tag v-if="scope.row.status === 0" type="danger" size="large">未报名</el-tag>
					<el-tag v-if="scope.row.status === 1" type="success" size="large">已报名</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="注册时间" show-overflow-tooltip header-align="center" align="center" width="180"></el-table-column>
			<el-table-column prop="purpose" label="意向说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<!--			<el-table-column prop="remark" label="备注" show-overflow-tooltip header-align="center" align="center"></el-table-column>-->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-button type="text" style="margin-right: 10px" @click="addOrUpdateHandle(scope.row.id)">信息核对</el-button>
					<el-button type="text" @click="confirm(scope.row.id)">确认</el-button>
          <el-button type="text" @click="addSys(scope.row.id)">加入系统</el-button>
					<!--					<el-button type="text" style="margin-right: 10px" @click="deleteBatchHandle(scope.row.id)">删除</el-button>-->
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

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="EnrollUserIndex">
import { useCrud } from '@/hooks'
import { onMounted, reactive, ref, watch } from 'vue'
import AddOrUpdate from './add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'
import {dataListUrl, deleteUrl, insertSysUser, useEnrollUserConfirmApi} from '@/api/affair/enrolluser'
import { ElMessage } from 'element-plus'
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import moment from 'moment'
import FastTableColumn from '@/components/fast-table-column/src/fast-table-column.vue'
import FastSelect from '@/components/fast-select/src/fast-select.vue'
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		realName: '',
		status: '1',
		area: '',
		purpose: '',
		beginTime: '',
		endTime: '',
		grade: ''
	}
})
let value1 = ref(['', ''])

const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat
const onChange = (e: any) => {
	if (e != null) {
		state.queryForm.area = chinaData[e[0]].label + chinaData[e[1]].label + chinaData[e[2]].label
	}
}

const clear = () => {
	state.queryForm.name = ''
	state.queryForm.status = '1'
	state.queryForm.area = ''
	state.queryForm.purpose = ''
	state.queryForm.beginTime = ''
	state.queryForm.endTime = ''
	state.queryForm.grade = ''
	getDataList()
}

const Change = () => {
	state.queryForm.beginTime = moment(value1.value[0]).format('YYYY-MM-DD')
	state.queryForm.endTime = moment(value1.value[1]).format('YYYY-MM-DD')
}

const confirm = (id: number) => {
	useEnrollUserConfirmApi(id).then((res: any) => {
		ElMessage({
			type: 'success',
			message: '信息更新成功'
		})
		getDataList()
	})
}
const addSys = (id: number) => {
  console.log(id)
  insertSysUser(id).then((res: any) => {
    ElMessage({
      type: 'success',
      message: '用户新增成功'
    })
    getDataList()
  })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
