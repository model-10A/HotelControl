<template>
	<el-card>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
			<el-alert :closable="false" style="margin-bottom: 25px" type="info">
				<h1 slot="title" style="color: #242424">基本信息</h1>
			</el-alert>
			<el-form-item label="考试名称" prop="name">
				<el-col :span="20">
					<el-input v-model="dataForm.name" placeholder="考试名称"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="开始时间" prop="beginTime">
				<el-date-picker
					v-model="dataForm.beginTime"
					:disabled-date="disabledDate"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择开始时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					@blur="dateChange()"
				/>
			</el-form-item>
			<el-form-item label="结束时间" prop="endTime">
				<el-date-picker
					v-model="dataForm.endTime"
					:disabled-date="disabledDate"
					format="YYYY-MM-DD HH:mm:ss"
					placeholder="请选择结束时间"
					type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss"
					@blur="dateChange()"
				/>
			</el-form-item>
			<el-form-item label="考试时长" prop="timeLimit">
				<el-col :span="20">
					<el-input v-model.number="dataForm.timeLimit" :max="12" :min="1" placeholder="考试时长（分钟）" type="text"> </el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="考试类型" prop="type">
				<el-select v-model="dataForm.type" placeholder="选择考试类型">
					<el-option v-for="item in examTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 1" label="要求等级" prop="requireAbility">
				<el-select v-model="dataForm.requireAbility" :loading="abilityLoading" placeholder="选择等级" @focus="getAbility()">
					<el-option v-for="item in abilityList" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item v-if="dataForm.type === 1" label="颁发等级" prop="gainAbilityId">
				<el-select
					v-model="dataForm.gainAbilityId"
					:disabled="dataForm.requireAbility === null || dataForm.requireAbility === ''"
					:loading="abilityLoading"
					placeholder="选择等级"
				>
					<el-option v-for="item in abilityList" :key="item.id" :disabled="haveId(item.id)" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="题目乱序" prop="type">
				<el-select v-model="dataForm.problemOrder" placeholder="选择考试类题目是否乱序">
					<el-option v-for="item in examOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="返回上一题" prop="type">
				<el-select v-model="dataForm.problemBack" placeholder="选择考试类题目是否可以返回上一题">
					<el-option v-for="item in examOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-alert :closable="false" style="margin-bottom: 25px; margin-top: 25px" type="info">
				<h1 slot="title" style="color: #242424">选择试卷</h1>
			</el-alert>

			<el-form-item v-if="props.modelValue === 1">
				<el-row :gutter="24">
					<el-col :span="12">
						<el-popover :width="600" placement="right" trigger="click">
							<template #reference>
								<el-button :disabled="!dataForm.classIdList.length > 0" style="margin-right: 16px" @click="selectPaper()">选择试卷</el-button>
							</template>
							<el-table :data="gridData" style="width: 600px">
								<el-table-column label="名称" property="paperName" width="150" />
								<el-table-column label="备注" property="remark" show-overflow-tooltip width="100" />
								<el-table-column align="center" header-align="center" label="题目数量" prop="problemNum"></el-table-column>
								<el-table-column align="center" header-align="center" label="总分" prop="score"></el-table-column>
								<el-table-column label="操作" property="address" width="100">
									<template #default="scope">
										<el-button v-if="dataForm.paperId === scope.row.paperId" size="small" text type="info" @click="dataForm.paperId = 0"
											>已选择</el-button
										>
										<el-button
											v-else
											size="small"
											type="text"
											@click="choicePaper(scope.row.paperName, scope.row.paperId, scope.row.problemNum, scope.row.score)"
											>选择</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</el-popover>
					</el-col>
					<el-col :span="12">
						<el-button style="margin-right: 16px" type="text" @click="dialogVisible = true">全部试卷</el-button>
					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item v-else label="班级" prop="classId">
				<el-row :gutter="24">
					<el-col :span="10">
						<el-select v-model="dataForm.classIdList" clearable filterable multiple placeholder="选择班级">
							<el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
					</el-col>
					<el-col :span="7">
						<el-popover :width="600" placement="right" trigger="click">
							<template #reference>
								<el-button :disabled="!dataForm.classIdList.length > 0" style="margin-right: 16px" @click="selectPaper()">选择试卷</el-button>
							</template>
							<el-table :data="gridData" style="width: 600px">
								<el-table-column label="名称" property="paperName" width="150" />
								<el-table-column label="备注" property="remark" show-overflow-tooltip width="100" />
								<el-table-column align="center" header-align="center" label="题目数量" prop="problemNum"></el-table-column>
								<el-table-column align="center" header-align="center" label="总分" prop="score"></el-table-column>
								<el-table-column label="操作" property="address" width="100">
									<template #default="scope">
										<el-button v-if="dataForm.paperId === scope.row.paperId" size="small" text type="info" @click="dataForm.paperId = 0"
											>已选择</el-button
										>
										<el-button
											v-else
											size="small"
											type="text"
											@click="choicePaper(scope.row.paperName, scope.row.paperId, scope.row.problemNum, scope.row.score)"
											>选择</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</el-popover>
					</el-col>
					<el-col :span="7">
						<el-button style="margin-right: 16px" type="text" @click="dialogVisible = true">全部试卷</el-button>
					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item v-if="dataForm.paperId != 0">
				<el-descriptions :column="5" border direction="vertical" size="small">
					<el-descriptions-item align="center" label="试卷名称">{{ dataForm.paperName }}</el-descriptions-item>
					<el-descriptions-item align="center" label="题目数量">{{ dataForm.problemNum }}</el-descriptions-item>
					<el-descriptions-item align="center" label="分数">{{ dataForm.score }}</el-descriptions-item>
					<el-descriptions-item align="center" label="操作"
						><template>
							<el-button type="text" @click="showPaperDetail(dataForm.paperId)">详情</el-button>
							<el-button type="text" @click="dataForm.paperId = 0">删除</el-button>
						</template></el-descriptions-item
					>
				</el-descriptions>
			</el-form-item>
			<el-alert :closable="false" style="margin-bottom: 25px; margin-top: 25px" type="info">
				<h1 slot="title" style="color: #242424">其他</h1>
			</el-alert>
			<el-form-item label="考试地点" prop="place">
				<el-col :span="20">
					<el-input v-model="dataForm.place" placeholder="考试地点"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="考试说明" prop="description">
				<el-col :span="20">
					<el-input v-model="dataForm.description" placeholder="考试说明" type="textarea"></el-input>
				</el-col>
			</el-form-item>
		</el-form>

		<el-dialog v-model="dialogVisible">
			<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
				<el-form-item>
					<el-input v-model="state.queryForm.name" clearable placeholder="试卷名称"></el-input>
				</el-form-item>
				<el-form-item>
					<fast-select v-model="state.queryForm.difficulty" clearable dict-type="problem_difficulty" placeholder="难度"></fast-select>
				</el-form-item>
				<el-form-item>
					<kp-select-tree v-model="state.queryForm.kpCode" clearable placeholder="知识点"></kp-select-tree>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getDataList"><svg-icon icon="icon-search"></svg-icon>查询</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="state.dataListLoading" :data="state.dataList" border size="small" style="width: 100%">
				<el-table-column align="center" header-align="center" label="试卷名称" prop="name"></el-table-column>
				<fast-table-column
					align="center"
					dict-type="problem_difficulty"
					header-align="center"
					label="难度"
					prop="difficulty"
					width="130"
				></fast-table-column>
				<el-table-column align="center" header-align="center" label="题目数量" prop="problemNum"></el-table-column>
				<el-table-column align="center" header-align="center" label="总分" prop="score"></el-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="操作" width="200">
					<template #default="scope">
						<!--						<el-button size="small" type="text">题目</el-button>-->
						<el-button v-if="dataForm.paperId === scope.row.id" size="small" text type="info" @click="dataForm.paperId = 0">已选择</el-button>
						<el-button v-else size="small" type="text" @click="choicePaper(scope.row.name, scope.row.id, scope.row.problemNum, scope.row.score)"
							>选择</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				:current-page="state.page"
				:page-size="state.limit"
				:page-sizes="state.pageSizes"
				:total="state.total"
				layout="total, sizes, prev, pager, next, jumper"
				size="small"
				@size-change="sizeChangeHandle"
				@current-change="currentChangeHandle"
			>
			</el-pagination>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>

		<el-form-item>
			<div class="stepBtn" style="width: 100%">
				<div>
					<el-button :loading="loading" style="margin-top: 12px" type="primary" @click="submitHandle()">确定</el-button>
				</div>
			</div>
		</el-form-item>
		<template #footer>
			<div>
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" @click="submitHandle()">确定</el-button>
			</div>
		</template>

		<el-dialog v-model="detailVisible" :close-on-click-modal="false" title="试卷内容" width="800px">
			<el-table :data="paperDetail" border max-height="400" style="width: 100%">
				<el-table-column align="center" header-align="center" label="序号" type="index" width="100"> </el-table-column>
				<el-table-column align="center" header-align="center" label="题目编号" prop="problemId" width="150"></el-table-column>
				<el-table-column align="center" header-align="center" label="名称" prop="problemName"></el-table-column>
				<fast-table-column align="center" dict-type="problem_type" header-align="center" label="类型" prop="problemType"></fast-table-column>
				<el-table-column align="center" fixed="right" header-align="center" label="分数" prop="score" width="100"> </el-table-column>
			</el-table>
		</el-dialog>
	</el-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useExamApi, useExamSubmitApi } from '@/api/lessons/exam'
import { IHooksOptions } from '@/hooks/interface'
import { dataListUrl, deleteUrl } from '@/api/problem/paper'
import { dataListUrl as abilityUrl } from '@/api/problem/ability'
import { useCrud } from '@/hooks'
import KpSelectTree from '@/components/kp-select-tree/kp-select-tree.vue'
import dayjs from 'dayjs'
import { useOpenClassesApi, useTeacherClassListApi } from '@/api/teach/class'
import store from '@/store'
import { useGetPaperByClassIdListApi } from '@/api/teach/teachplanpaper'
import { useProblemPaperItemApi } from '@/api/problem/paperitem'
import service from '@/utils/request'

const abilityList = ref([] as any)
const abilityLoading = ref(false)
const detailVisible = ref(false)
const dialogVisible = ref(false)
const active = ref(0)
const loading = ref(false)
const emit = defineEmits(['refreshDataList'])
const options = ref([] as any[])
const visible = ref(false)
const dataFormRef = ref()
const gridData = ref([] as any)
const props = defineProps({
	modelValue: {
		type: Number,
		required: true
	},
	lessonId: {
		type: String,
		required: false
	},
	classId: {
		type: String,
		required: false
	},
	beginTime: {
		type: String,
		required: false
	},
	endTime: {
		type: String,
		required: false
	},
	createType: {
		type: Number,
		required: false
	}
})
const examTypeOptions = [
	{
		value: 0,
		label: '普通考试'
	},
	{
		value: 1,
		label: '能力考试'
	}
]

const examOptions = [
	{
		value: 1,
		label: '是'
	},
	{
		value: 0,
		label: '否'
	}
]
let dataForm = reactive({
	id: '',
	description: '',
	beginTime: props.beginTime,
	paperName: '',
	remark: '',
	endTime: props.endTime,
	name: '',
	place: '',
	kpCode: '',
	type: 0,
	classIdList: [props.classId],
	lessonId: props.lessonId,
	problemNum: '',
	paperId: 0,
	score: '',
	requireAbility: '',
	gainAbilityId: '',
	timeLimit: null as any,
	problemOrder: 1,
	problemBack: 0,
	createType: props.createType == 1 ? 1 : 0
})

const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	deleteUrl: deleteUrl,
	dataListLoading: false,
	queryForm: {
		name: '',
		status: 1,
		difficulty: '',
		kpCode: ''
	}
})

const haveId = (id: any) => {
	let index = abilityList.value.findIndex((item: any) => {
		return item.id === dataForm.requireAbility
	})

	let idx = abilityList.value.findIndex((item: any) => {
		return item.id === id
	})

	if (idx <= index) {
		return true
	}
	return false
}

const getAbility = () => {
	abilityLoading.value = true
	service
		.get(abilityUrl, {
			params: {
				order: '',
				asc: false
			}
		})
		.then(res => {
			abilityList.value = res.data
		})
		.finally(() => (abilityLoading.value = false))
}

const cleanForm = () => {
	dataForm.id = ''
	dataForm.classIdList = []
	dataForm.paperId = 0
	dataForm.paperName = ''
	dataForm.score = ''
	dataForm.problemNum = ''
	dataForm.endTime = ''
	dataForm.beginTime = ''
	dataForm.description = ''
	dataForm.name = ''
	dataForm.place = ''
	dataForm.kpCode = ''
	dataForm.type = 0
	dataForm.timeLimit = null
}

const dateChange = () => {
	if (dataForm.endTime != '' && dataForm.beginTime != '') {
		dataForm.timeLimit = dayjs(new Date(dataForm.endTime)).diff(dayjs(new Date(dataForm.beginTime)), 'minutes')
	}
}

const getOpenClasses = () => {
	if (!store.userStore.user.roleIdList.includes(1) && !store.userStore.user.roleIdList.includes(2)) {
		useOpenClassesApi().then(res => (classList.value = res.data))
	} else {
		useTeacherClassListApi(2).then(res => (classList.value = res.data))
	}
}

const init = (id?: number) => {
	dataForm.id = ''
	active.value = 0

	if (props.lessonId == '' || props.lessonId == null) {
		// 重置表单数据
		if (dataFormRef.value) {
			dataFormRef.value.resetFields()
		}

		if (id) {
			getExam(id)
		} else {
			cleanForm()
		}

		getOpenClasses()
	} else {
		dataForm.beginTime = props.beginTime
		dataForm.endTime = props.endTime
		dateChange()
	}
}

init()

const getExam = (id: number) => {
	useExamApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const checkTimeLimit = (rule: any, value: any, callback: any) => {
	if (value > dayjs(new Date(dataForm.endTime)).diff(dayjs(new Date(dataForm.beginTime)), 'minutes')) {
		callback(new Error('时间限制不得超出时间范围'))
	} else {
		callback()
	}
}

const checkBeginTime = (rule: any, value: any, callback: any) => {
	if (dataForm.endTime === '') {
		callback()
	} else {
		if (value >= dataForm.endTime) {
			callback(new Error('开始时间不得大于结束时间'))
		} else {
			callback()
		}
	}
}

const checkEndTime = (rule: any, value: any, callback: any) => {
	if (dataForm.beginTime != '') {
		if (value <= dataForm.beginTime) {
			callback(new Error('结束时间不得小于开始时间'))
		} else {
			callback()
		}
	}
}

const dataRules = ref({
	beginTime: [
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
		{ validator: checkBeginTime, trigger: 'blur' }
	],
	endTime: [
		{ required: true, message: '必填项不能为空', trigger: 'blur' },
		{ validator: checkEndTime, trigger: 'blur' }
	],
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	type: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	requireAbility: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	gainAbilityId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	timeLimit: [
		{ required: true, message: '必填项不能为空' },
		{ type: 'number', message: '请填写数字' },
		{ validator: checkTimeLimit, trigger: 'blur' }
	]
})

// 表单提交
const submitHandle = () => {
	console.log(dataForm.createType)
	console.log(dataForm.createType)
	console.log(dataForm.createType)
	console.log(dataForm.createType)
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
		if (dataForm.paperId === 0) {
			ElMessage.error('请选择试卷')
			return
		}
		loading.value = true
		useExamSubmitApi(dataForm).then(() => {
			ElMessage.success('操作成功')
			loading.value = false
		})
	})
}

const classList = ref([])
const choicePaper = (name: any, paperId: any, problemNum: any, score: any) => {
	dataForm.paperName = name
	dataForm.paperId = paperId
	dataForm.problemNum = problemNum
	dataForm.score = score
}

const disabledDate = (time: Record<string, any>): boolean => {
	return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const selectPaper = () => {
	useGetPaperByClassIdListApi(dataForm.classIdList).then((res: any) => (gridData.value = res.data))
}

let paperDetail: any = ref([])
const showPaperDetail = (id: number) => {
	detailVisible.value = true
	useProblemPaperItemApi(id).then(res => {
		paperDetail.value = res.data
	})
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
defineExpose({
	init
})
</script>

<style scoped>
.stepBtn {
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
}
</style>
