<template>
	<div>
		<el-table :data="state.dataList" :max-height="800">
			<el-table-column align="center" header-align="center" label="学号" prop="studentNumber" show-overflow-tooltip width="60"> </el-table-column>
			<el-table-column align="center" header-align="center" label="学生姓名" prop="name"></el-table-column>
			<el-table-column label="学生等级" prop="ability" show-overflow-tooltip>
				<template #default="scope">
					<span>{{ scope.row.ability }} | {{ scope.row.abilityItem == null ? '无' : scope.row.abilityItem }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="请假" width="60px">
				<template #default="scope">
					<span v-if="scope.row.status !== 0">否</span>
					<span v-else-if="scope.row.status === 0">是</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="提交" prop="submitTimes">
				<template #default="scope">
					<span>{{ scope.row.correctTimes }}/{{ scope.row.submitTimes }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" header-align="center" label="签到" prop="status">
				<template #default="scope">
					<el-tag v-show="scope.row.status === -1" type="danger">未签到</el-tag>
					<el-tag v-show="scope.row.status === 0" type="warning">请假</el-tag>
					<el-tag v-show="scope.row.status === 1" type="success">签到</el-tag>
					<el-tag v-show="scope.row.status === 2">迟到</el-tag>
				</template>
			</el-table-column>
      <el-table-column align="center" header-align="center" label="系统评价" prop="sysEvaluation" show-overflow-tooltip > </el-table-column>
      <el-table-column align="center" header-align="center" label="系统评价" prop="teaEvaluation" show-overflow-tooltip > </el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts" setup>
import WangEditor from '@/components/wang-editor/index.vue'
import { reactive, ref } from 'vue'
import socket from '@/utils/socket'
import { getUserMsg, sendChatMsg } from '@/utils/LessonMsgSend'
import store from '@/store'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { dataStudentsListUrl, updateStudentsApi, useGiveOrResetLikesApi } from '@/api/lessons/attendlog'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const lessonId = ref(props.modelValue)
const state: IHooksOptions = reactive({
	dataListUrl: dataStudentsListUrl,
	queryForm: {
		lessonId: lessonId.value
	},
	isPage: false
})

const { getDataList } = useCrud(state)
</script>

<style scoped>
.m-card header {
	display: flex;
	align-items: center;
}

.m-list li {
	padding: 9pt 15px;
	border-bottom: 1px solid #292c33;
	cursor: pointer;
	-webkit-transition: background-color 0.1s;
	transition: background-color 0.1s;
	display: flex;
	align-items: center;
}

.m-message {
	padding: 10px 15px;
	height: 500px;
	overflow-y: auto;
}

.m-message .self {
	text-align: right;
	justify-content: flex-end;
}

.m-message .self .text {
	background-color: rgb(155, 255, 101);
	display: inline-block;
}

.m-message li {
	margin-bottom: 15px;
}

.m-message .time > span {
	display: inline-block;
	padding: 0 18px;
	font-size: 9pt;
	color: #fff;
	border-radius: 2px;
	background-color: #dcdcdc;
}

.m-message .text {
	margin: 10px 0 10px 20px;
	position: relative;
	padding: 5px 10px;
	min-height: 30px;
	line-height: 2;
	font-size: 9pt;
	text-align: left;
	word-wrap: break-word;
	background-color: #f3f3f3;
	border-radius: 4px;
	max-width: 80%;
}

.m-message .self .text:before {
	right: inherit;
	left: 100%;
	border-right-color: transparent;
	border-left-color: rgb(155, 255, 101);
}

.m-text .handler img {
	height: 20px;
	width: 20px;
	margin-top: 5px;
	margin-bottom: 5px;
	cursor: pointer;
	vertical-align: middle;
}

.m-text textarea {
	padding: 10px 10px 20px 10px;
	height: calc(100% - 70px);
	width: 100%;
	border: none;
	outline: 0;
	font-family: Micrsofot Yahei;
	resize: none;
}

.m-text button {
	width: 60px;
}

#pager_result > div {
	padding-left: 10px;
	padding-right: 10px;
}

#pager_result .top img {
	width: 100%;
	height: 100px;
	position: absolute;
	left: 0;
	top: 0;
}

.receive_list li {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.receive_list li img {
	width: 40px;
	height: 40px;
	vertical-align: center;
	margin-right: 10px;
	border-radius: 5px;
}

.receive_list li div {
	flex: 1;
	border-bottom: 1px solid rgb(233, 230, 230);
	padding-top: 10px;
	padding-bottom: 10px;
}

.receive_list li div p {
	margin: 0;
}
.msg_time {
	font-size: 2px !important;
	color: #676666;
}
.btn {
	margin-bottom: 10px;
}
</style>
