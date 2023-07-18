<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
			  <el-input v-model="state.queryForm.userId" placeholder="面向用户" clearable></el-input>
			</el-form-item> -->
			<el-form-item>
				<el-select v-model="state.queryForm.isPush" placeholder="是否已推" clearable>
					<el-option value="1" label="是">是</el-option>
					<el-option value="0" label="否">否</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<fast-select v-model="state.queryForm.type" dict-type="wx-message-type" placeholder="消息类型" clearable> </fast-select>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					@click="state.queryForm.isPush = null;state.queryForm.type = '';getDataList()">重置
        </el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getDataList()">查询</el-button>
			</el-form-item>
		</el-form>
		<!-- <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
		<el-button type="primary" @click="BatchPushHandle()">批量推送</el-button>
		<el-button type="primary" disabled @click="BatchMessageHandle()">消息群发</el-button>
		<el-button type="danger" @click="deleteBatchHandle()">删除</el-button>
		<el-table
			v-loading="state.dataListLoading"
			:data="state.dataList"
			border
			style="width: 100%; margin-top: 15px"
			@selection-change="selectionChangeHandle"
		>
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="content" label="消息内容" header-align="center" align="center"></el-table-column>
			<el-table-column prop="sendTime" label="待发时间" header-align="center" align="center" width="160"> </el-table-column>
			<el-table-column prop="sentTime" label="已发时间" header-align="center" align="center" width="160"> </el-table-column>
			<el-table-column prop="source" label="来源" header-align="center" align="center" width="60"></el-table-column>
			<el-table-column prop="realName" label="面向用户" header-align="center" align="center" width="70"> </el-table-column>
			<el-table-column prop="userType" label="用户类型" header-align="center" align="center" width="60">
				<template #default="scope">
					<p v-if="scope.row.userType === 1">学生</p>
					<p v-else>老师</p>
				</template>
			</el-table-column>
			<el-table-column prop="isPush" label="已推" header-align="center" align="center" width="60">
				<template #default="scope">
					<el-tag v-if="scope.row.isPush === 1" round>是</el-tag>
					<el-tag v-else round>否</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="type" label="消息类型" header-align="center" align="center" width="120">
				<template #default="scope">
					<p v-if="scope.row.type === 1">开课提醒</p>
					<p v-if="scope.row.type === 2">作业发布提醒</p>
					<p v-if="scope.row.type === 3">课前提醒</p>
					<p v-if="scope.row.type === 4">完成签到提醒</p>
					<p v-if="scope.row.type === 5">作业截止提醒</p>
					<p v-if="scope.row.type === 6">课堂评价</p>
					<p v-if="scope.row.type === 7">考试安排提醒</p>
					<p v-if="scope.row.type === 8">销课完成通知</p>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="templateId" label="模板ID" header-align="center" align="center"></el-table-column> -->
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
				<template #default="scope">
					<!-- <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button> -->
					<el-button type="text" size="small" :disabled="scope.row.isPush === 1" @click="open(scope.row)">推送 </el-button>
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

		<!-- 消息群发 -->
		<batch-message ref="batchMessageRef"></batch-message>
	</el-card>
</template>

<script setup lang="ts" name="WxMsgLogIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import BatchMessage from './batch-message.vue'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSendWxMsgLogApi, useWxMsgLogApi, dataListUrl, deleteUrl } from '@/api/teach/wxmsglog'
import { duration } from 'moment'
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	queryForm: {
		userId: null,
		isPush: null,
		type: ''
	}
})

const batchMessageRef = ref()
const BatchMessageHandle = () => {
	batchMessageRef.value.init()
}
const open = (row: any) => {
	if (row.isPush === 1) {
		ElMessage({
			type: 'warning',
			message: '此条消息已推送',
			duration: 500
		})
		return
	}
	ElMessageBox.confirm('是否要将此消息推送至指定微信?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'success'
	}).then(async () => {
		const data = await useSendWxMsgLogApi(row)
		if (data.msg === 'success') {
			ElMessage({
				type: 'success',
				message: '推送成功',
				duration: 500,
				onClose: () => {
					getDataList()
				}
			})
		}
	})
}
//批量推送
const BatchPushHandle = () => {
	let flag = 0
	state.dataListSelections?.forEach(async item => {
		const data = await useWxMsgLogApi(item)
		console.log(data.data)
		if (data.data.isPush === 0) {
			await useSendWxMsgLogApi(data.data)
			flag = 1
			ElMessage({
				type: 'success',
				message: '推送成功',
				duration: 500,
				onClose: () => {
					getDataList()
				}
			})
		}
	})
	if (flag === 0) {
		ElMessage({
			type: 'warning',
			message: '此消息已完成推送，无需再次推送',
			duration: 500,
			onClose: () => {
				getDataList()
			}
		})
	}
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
