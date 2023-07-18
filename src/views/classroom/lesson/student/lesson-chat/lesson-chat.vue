<template>
	<div>
		<el-button class="btn" @click="userListReload()">刷新</el-button>
		<el-button class="btn" @click="drawer = true">聊天</el-button>
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
			<el-table-column align="center" header-align="center" label="状态" prop="onlineFlag" width="80">
				<template #default="scope">
					<el-tag v-if="isOnline(scope.row.stuId)">在线</el-tag>
					<el-tag v-else type="info">离线</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<el-drawer v-model="drawer" size="40%">
			<el-card header="聊天记录" style="height: 400px">
				<div class="m-message">
					<div v-if="moreFlag" style="text-align: center"><el-button type="text" @click="getHistoryChat()">获取更多</el-button></div>
					<ul id="msg_list">
						<li v-for="(item, index) in formParams" :key="index" class="active">
							<div v-if="item.showType === 0" style="text-align: center; color: #969494">tip：{{ item.data }}</div>
							<div v-else-if="item.showType === 1" class="main self">
								<div class="msg_time" style="text-align: right">{{ item.createTime }}</div>
								<div class="text">
									<div v-html="item.data"></div>
								</div>
							</div>
							<div v-else-if="item.showType === 2" class="main">
								<div>
									<el-avatar style="background-color: #207ff6"> {{ item.username }} </el-avatar><span class="msg_time"> {{ item.createTime }}</span>
									<div class="text"><div v-html="item.data"></div></div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</el-card>
			<div>
				<WangEditor v-model="message" placeholder="说点什么吧。。。。" style="height: 200px"></WangEditor>
				<el-button style="float: right; margin-top: 20px" type="primary" @click="sendMsg"> 发送</el-button>
			</div>
		</el-drawer>
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
import { ElMessageBox } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import service from '@/utils/request'
import { dataPageUrl } from '@/api/lessons/chat'

const drawer = ref(false)
const userId = store.userStore.user.id
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	}
})
const lessonId = ref(props.modelValue)
const moreFlag = ref(true)
const state: IHooksOptions = reactive({
	dataListUrl: dataStudentsListUrl,
	queryForm: {
		lessonId: lessonId.value
	},
	isPage: false
})

const stated = reactive({
	page: 1,
	limit: 5,
	dataList: [] as any,
	queryForm: {
		id: '',
		lessonId: lessonId.value
	}
})
const message = ref('')
const formParams = reactive([
	{
		data: '',
		showType: 0,
		createTime: '',
		username: ''
	}
])
formParams.length = 0

const userListReload = () => {
	getUserMsg(lessonId.value)
}
const getHistoryChat = () => {
	service
		.get(dataPageUrl, {
			params: {
				page: stated.page,
				limit: stated.limit,
				...stated.queryForm
			}
		})
		.then((res: any) => {
			stated.dataList = res.data
			if (stated.dataList?.length > 0) {
				stated.page++
				for (let i = 0; i < stated.dataList?.length; i++) {
					if (stated.dataList?.length - 1 == i) {
						stated.queryForm.id = stated.dataList[i].id
					}
					if (stated.dataList[i].userId === userId) {
						formParams.unshift({
							data: stated.dataList[i].msg,
							showType: 1,
							createTime: stated.dataList[i].createTime,
							username: stated.dataList[i].username
						})
					} else {
						formParams.unshift({
							data: stated.dataList[i].msg,
							showType: 2,
							createTime: stated.dataList[i].createTime,
							username: stated.dataList[i].username
						})
					}
				}
			} else {
				moreFlag.value = false
				ElMessage.warning('没有更多了')
			}
		})
}
const sendMsg = () => {
	if (message.value != '') {
		let data = {
			msg: message.value,
			username: store.userStore.user.realName + '老师',
			createTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
		}
		sendChatMsg(lessonId.value, data)
		formParams.push({
			data: message.value,
			showType: 1,
			createTime: data.createTime,
			username: store.userStore.user.realName + '老师'
		})
		message.value = '<p></p>'
	}
}
const userIdList = ref([] as any)
socket.receive = (res: any) => {
	let data = JSON.parse(res.data)
	if (data) {
		console.log(data)
		switch (data.type) {
			case 0:
				userIdList.value = data.data.users
				break
			case 1:
				userIdList.value = data.data.userIdList
				formParams.push({
					data: data.data.msg,
					showType: 0,
					createTime: '',
					username: ''
				})
				break
			case 2:
				formParams.push({
					data: data.data.msg,
					createTime: data.data.createTime,
					username: data.data.username,
					showType: 2
				})
				break
			case 3:
				userIdList.value = data.data
				break
		}
	}
}

const cancelCallStudentsHandle = (data: any, flag: boolean) => {
	if (flag) {
		data.status = -1
	} else {
		data.rollCall = 0
		data.status = -1
	}
	console.log(data)
	updateStudentsApi(data).then(res => {
		ElMessage.success('操作成功！')
		userListReload()
	})
}

const callStudentsHandle = (data: any, flag: boolean) => {
	if (flag) {
		ElMessageBox.confirm('确定进行请假操作?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				data.status = 0
				updateStudentsApi(data).then(res => {
					ElMessage.success('操作成功！')
					userListReload()
				})
			})
			.catch(() => {})
	} else {
		data.rollCall = 1
		data.status = 1
		updateStudentsApi(data).then(res => {
			ElMessage.success('操作成功！')
			userListReload()
		})
	}
}

const isOnline = (stuId: any) => {
	if (userIdList.value.includes(stuId)) {
		return true
	}

	return false
}

const likesDisabled = ref(false)
const giveOrResetLikes = async (data: any, type: any) => {
	likesDisabled.value = true
	if (type == 1) {
		data.likesNum = data.likesNum + 1
	} else {
		data.likesNum = 0
	}

	let res1 = (await useGiveOrResetLikesApi(data.lessonId, data.stuId, type)) as any

	let res2 = (await updateStudentsApi(data)) as any
	if (res1.code == 0 && res2.code == 0) {
		ElMessage.success('操作成功！')
		userListReload()
	}
	likesDisabled.value = false
}

const inputBlur = (data: any) => {
	updateStudentsApi(data).then(() => {
		ElMessage.success('评价成功！')
	})
}

const sysEvaluation = ref()
const teaEvaluation = ref()
const evaluationVisible = ref(false)
const data = ref()
const showEvaluation = (row: any) => {
	data.value = row
	sysEvaluation.value = row.sysEvaluation
	teaEvaluation.value = row.teaEvaluation
	evaluationVisible.value = true
}

const submitEvaluation = () => {
	data.value.sysEvaluation = sysEvaluation.value
	data.value.teaEvaluation = teaEvaluation.value
	console.log(data.value)
	updateStudentsApi(data.value).then(() => {
		ElMessage.success('评价成功！')
		evaluationVisible.value = false
	})
}
const { getDataList } = useCrud(state)
</script>

<style scoped>
#msg_list {
	margin: 0;
	padding: 0;
	list-style: none;
}

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
