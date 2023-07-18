<template>
	<el-dialog v-model="visible" title="新增销课记录" :close-on-click-modal="false" width="70%">
		<el-form ref="dataFormRef" :rules="dataRule" :model="dataForm">
			<el-row>
				<el-col :span="12">
					<el-form-item label="班级" prop="class">
						<el-select v-model="dataForm.class" @change="getLesson">
							<el-option v-for="item in dataForm.classList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="课程" prop="lesson">
						<el-select v-model="dataForm.lesson" no-data-text="请先选择班级" @change="showList">
							<el-option v-for="item in dataForm.lessonList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<div v-show="show">
				<el-table
					ref="multipleTableRef"
					:data="state.dataList"
					style="width: 100%"
					:height="dataForm.height"
					@selection-change="selectionChangeHandle"
				>
					<el-table-column type="selection" width="55" />
					<el-table-column property="username" label="学号" width="120" />
					<el-table-column property="realName" label="姓名" width="120" />
					<el-table-column property="normal" label="剩余常规课时" />
					<el-table-column property="normalPresent" label="剩余常规赠送课时" />
					<el-table-column property="training" label="剩余集训课时" />
					<el-table-column property="trainingPresent" label="剩余集训赠送课时" />
				</el-table>
				<el-form-item label="课程类型" style="margin-top: 20px">
					<el-switch v-model="dataForm.type" active-text="集训课程" inactive-text="常规课程" :active-value="1" :inactive-value="0" />
				</el-form-item>
				<el-row style="margin-top: 20px">
					<el-col :span="12">
						<el-form-item prop="payment" label="应扣课时">
							<el-input-number v-model="dataForm.duration" disabled></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="实扣课时">
							<el-input-number v-model="dataForm.actualDuration" :min="0" :max="24" step="0.5"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="说明" prop="direction">
					<el-input v-model="dataForm.direction" placeholder="说明" type="textarea"></el-input>
				</el-form-item>
			</div>

			<!--      <el-pagination-->
			<!--          :current-page="state.queryForm.page"-->
			<!--          :page-size="state.queryForm.size"-->
			<!--          layout="total, sizes, prev, pager, next, jumper"-->
			<!--          :total="state.queryForm.total"-->
			<!--          @size-change="handleSizeChange"-->
			<!--          @current-change="handleCurrentChange"-->
			<!--      >-->
			<!--      </el-pagination>-->
		</el-form>
		<template #footer>
			<el-button @click="offList">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {useOpenClassesApi, useOpenClassesWithOrgApi} from '@/api/teach/class'
import { useGetStudentByLessonApi, useStudentsApi } from '@/api/teach/student'
import { useCrud } from '@/hooks'
import { useGetLessonHourApi, useLessonByIdApi } from '@/api/lessons/lesson'
import { saveTeachDestroyedLessonApi, saveTeachDestroyedLessonStuListApi } from '@/api/teach/teachdestroyedlessonrecord'
import moment from 'moment'
import { useUserInfoApi } from '@/api/sys/user'
import { messages } from '@/i18n'
import { ElMessage } from 'element-plus'



const dataRule = ref({
	class: [{ required: true, message: '请选择班级', trigger: 'blur' }],
	lesson: [{ required: true, message: '请选择课程', trigger: 'blur' }]
})
//自动全选
const multipleTableRef = ref()
//控制表格高度
const tableHeight = () => {
	if (state.dataList.length <= 6) {
		dataForm.height = 60 + state.dataList.length * 40
	} else {
		dataForm.height = 300
	}
	console.log(dataForm.height)
}

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataFormRef = ref()
//消课记录
const dataForm = reactive({
	id: '',
	class: '',
	lesson: '',
	direction: '',
	duration: 0,
	actualDuration: 0,
	lessonList: [],
	classList: [],
	type: 0,
	height: 0
})

const show = ref(false)

const state = reactive({
	dataListSelections: [],
	primaryKey: 'userId',
	dataListLoading: false,
	queryForm: {
		lessonId: 0,
		size: 50,
		page: 1,
		total: 0
	},
	dataList: []
})

//显示学生名单
const showList = (id: any) => {
	show.value = true
	state.queryForm.lessonId = id
	getLessonStu()
	getLessonHour(id)
}
const getLesson = (id: any) => {
	useLessonByIdApi(id).then(res => {
		dataForm.lessonList = res.data
		console.log(dataForm.lessonList)
		show.value = false
		dataForm.lesson = ''
	})
	getUserId()
}
//获取课堂中学生
const getLessonStu = () => {
	useGetStudentByLessonApi(state.queryForm.lessonId).then(res => {
		state.dataList = res.data
		console.log(state.dataList)
		state.queryForm.total = res.data.total
		multipleTableRef.value.toggleAllSelection()
		tableHeight()
	})
}
const offList = () => {
	show.value = false
	dataForm.lessonList = []
	state.dataListSelections = []
	visible.value = false
}
const init = (id:number) => {
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}
	visible.value = true
	destroyRecord.length = 0
	state.dataList = []
	show.value = false
	dataForm.lessonList = []
	state.dataListSelections = []
	getClass(id)
}

const getClass = (id:number) => {
	useOpenClassesWithOrgApi(id).then(res => {
		dataForm.classList = res.data
		console.log(dataForm.classList)
	})
}
const getLessonHour = (id: number) => {
	useGetLessonHourApi(id).then(res => {
		let data = res.data
		dataForm.duration = data.toFixed(1)
		dataForm.actualDuration = dataForm.duration
	})
}
// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return valid
		}
		destroyRecord.length = 0
		for (let i = 0; i < state.dataListSelections.length; i++) {
			let obj = {
				stuId: state.dataListSelections[i],
				classId: dataForm.class,
				lessonId: dataForm.lesson,
				status: 0,
				duration: dataForm.duration,
				actualDeduction: dataForm.actualDuration,
				direction: dataForm.direction,
				// deleted: 0,
				// creator: userId.value,
				// createTime: now.value,
				// updater: userId.value,
				// updateTime: now.value,
				type: dataForm.type
			}
			destroyRecord[i] = obj
		}
		console.log(destroyRecord)
		saveTeachDestroyedLessonStuListApi(destroyRecord).then(res => {
			if (res.msg === 'success') {
				ElMessage.success({
					message: '操作成功',
					onClose: () => {
						emit('refreshDataList')
						dataForm.lessonList = []
						visible.value = false
						state.dataListSelections = []
					}
				})
			}
		})
	})
}
const now = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const userId = ref()
const userRole = ref()
const thisUser = ref()
const getUserId = async () => {
	const { data: res } = await useUserInfoApi()
	thisUser.value = res
	userId.value = res.id
	userRole.value = res.roleIdList[0]
}
const destroyRecord = reactive([{}])

defineExpose({
	init
})

const { selectionChangeHandle } = useCrud(state)
</script>
<style scoped></style>
