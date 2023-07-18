<template>
	<el-card v-loading="state.loading">
		<br />

		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="description" label="说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
			<el-table-column prop="sort" label="子项顺序" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="duration" label="时长（分钟）" header-align="center" align="center"></el-table-column>

			<el-table-column prop="beginTime" label="开始时间" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-date-picker
						v-if="scope.row.isEdit1"
						v-model="scope.row.beginTime"
						type="datetime"
						:clearable="false"
						placeholder="开始时间"
						value-format="YYYY-MM-DD HH:mm:ss"
						class="item"
						@blur="scope.row.isEdit1 = false"
					></el-date-picker>
					<div v-else class="txt" @click="scope.row.isEdit1 = true">{{ scope.row.beginTime }}</div>
				</template>
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-date-picker
						v-if="scope.row.isEdit2"
						v-model="scope.row.endTime"
						type="datetime"
						:clearable="false"
						placeholder="结束时间"
						value-format="YYYY-MM-DD HH:mm:ss"
						class="item"
						@blur="scope.row.isEdit2 = false"
					></el-date-picker>
					<div v-else class="txt" @click="scope.row.isEdit2 = true">{{ scope.row.endTime }}</div>
				</template>
			</el-table-column>
			<!--			<el-table-column prop="endTime" label="结束时间" header-align="center" align="center"></el-table-column>-->

			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
				<template #default="scope">
					<el-button type="text" size="small" @click="editPaper(scope.row.planItemId)">试卷详情</el-button>
<!--					<el-button type="text" size="small" @click="updateHandle(scope.row.planId, scope.row.id)">修改</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!-- 弹窗, 新增 / 修改 -->
		<add-item ref="addItemRef" @refreshDataList="getList"></add-item>
		<update-item ref="updateItemRef" @refreshDataList="getList"></update-item>
		<!--    试卷管理弹窗-->
		<item-paper-saw ref="editPaperRef"></item-paper-saw>
		<!--    资源管理弹窗-->
		<item-resource ref="editResourceRef"></item-resource>
		<el-form style="margin-left: 95%; margin-top: 30px">
			<el-form-item>
				<el-button type="primary" @click="addLesson()">发布</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import AddItem from '../teach-item/add-item.vue'
import UpdateItem from '../teach-item/update-item.vue'
import { useRoute } from 'vue-router'
import { useTeachPlanApi } from '@/api/teach/teachplan'
import { useTeachClassApi, useTeachClassSubmitApi } from '@/api/teach/class'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import UpdatePaperDialog from '@/views/teach/teach-item/item-paper/update-paper-dialog.vue'
import ItemResource from '../teach-item/item-resource/item-resource.vue'
import moment from 'moment'
import { createLessonsApi } from '@/api/lessons/lesson'
import { dataListUrl, deleteUrl } from '@/api/teach/teachplanitem'
import ItemPaper from '@/views/teach/teach-item/item-paper/item-paper.vue'
import ItemPaperSaw from '@/views/teach/teach-class/item-paper-saw.vue'
import { router } from '@/router'
const state = reactive({
	loading: false,
	dataListSelections: [],
	dataListLoading: false,
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	planId: '',
	dataList: [
		{
			teacherId: '',
			beginTime: '0000-00-00 00:00:00',
			endTime: '0000-00-00 00:00:00',
			teacher1Name: '',
			teacher2Name: '',
			planItemId: '',
			classId: '',
			place: '',
			id: '',
			isEdit1: false,
			isEdit2: false
		}
	],
	dataClass: {
		teacher1Id: '',
		teacher2Id: '',
		beginTime: '',
		endTime: '',
		lessonBeginTime: '',
		lessonEndTime: '',
		teacher1Name: '',
		teacher2Name: '',
		frequency: 0,
		place: '',
		classId: ''
	}
})

const route = useRoute()
const planId: any = ref('')
let planName: any = ref('')
const classId: any = ref('')
onMounted(() => {
	classId.value = route.path.split('/').pop()
	console.log('8888888888888888888888')
	getClass(classId.value)
	console.log(state.planId)
	console.log(planId.value)
	state.planId = planId.value
	// getList()
})
const editPaperRef = ref()
const editPaper = (id?: number) => {
	editPaperRef.value.init(id)
}

const editResourceRef = ref()
const editResources = (id?: number) => {
	editResourceRef.value.init(id)
}

const addItemRef = ref()
const addHandle = (planId: number, id?: number) => {
	addItemRef.value.init(planId, id)
}

const updateItemRef = ref()
const updateHandle = (planId: number, id?: number) => {
	updateItemRef.value.init(planId, id)
}

const getList = () => {
	state.dataListLoading = true
	console.log('111111111')
	console.log(state.planId)
	service.get(state.dataListUrl + state.planId).then((res: any) => {
		state.dataList = res.data
		let data1 = state.dataClass.beginTime
		let data2 = state.dataClass.endTime
		var frequency = state.dataClass.frequency
		for (var i = 0; i < state.dataList.length; i++) {
			state.dataList[i].teacherId = state.dataClass.teacher2Id
			state.dataList[i].teacher1Name = state.dataClass.teacher1Name
			state.dataList[i].teacher2Name = state.dataClass.teacher2Name
			state.dataList[i].classId = classId.value
			state.dataList[i].planItemId = state.dataList[i].id
			state.dataList[i].place = state.dataClass.place
			state.dataList[i].id = ''
			if (frequency != 0) {
				state.dataList[i].beginTime = data1 + ' ' + state.dataClass.lessonBeginTime
				state.dataList[i].endTime = data1 + ' ' + state.dataClass.lessonEndTime
        data1 = moment(data1).add(frequency, 'days').format('YYYY-MM-DD')
        data2 = moment(data2).add(frequency, 'days').format('YYYY-MM-DD')
			} else {
				state.dataList[i].beginTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
				state.dataList[i].endTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	})
	state.dataListLoading = false
}
const getPlan = (id: number) => {
	console.log(id)
	useTeachPlanApi(id).then(res => {
		planName.value = res.data.name
		console.log(planName)
	})
}

const getClass = (id: number) => {
	console.log(id)
	useTeachClassApi(id)
		.then(res => {
			console.log('0000000')
			state.dataClass = res.data
			state.planId = res.data.planId
			planId.value = res.data.planId
			console.log(res.data)
		})
		.finally(() => {
			getList()
		})
}

const addLesson = () => {
	state.loading = true
	console.log(state.dataList)
	createLessonsApi(state.dataList)
		.then(res => {
			ElMessage.success({
				message: '操作成功',
				duration: 500
			})
		})
		.finally(() => {
			useTeachClassSubmitApi({ id: classId.value, status: 2 }).then(res => {
				state.loading = false
        router.push({ path: '/teachClass' })
			})
		})
}

const deleteBatchHandle = (key?: number | string) => {
	let data: any[] = []
	if (key) {
		data = [key]
	} else {
		data = state.dataListSelections ? state.dataListSelections : []
		if (data.length === 0) {
			ElMessage.warning('请选择删除记录')
			return
		}
	}
	ElMessageBox.confirm('确定进行删除操作?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			if (state.deleteUrl) {
				service.delete(state.deleteUrl, { data }).then(() => {
					ElMessage.success('删除成功')
					getList()
				})
			}
		})
		.catch(() => {})
}
</script>
