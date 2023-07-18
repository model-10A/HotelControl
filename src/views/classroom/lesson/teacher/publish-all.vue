<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="发布课堂习题" width="500px">
		<el-form ref="dataFormRef">
			<el-form-item>
				<el-switch v-model="value" active-text="模式二" inactive-text="模式一" size="large" />
			</el-form-item>
			<el-form-item v-if="value">
				<div>每题：<el-input-number v-model="modeOneValue" :min="1" :precision="0"></el-input-number></div>
				分钟，依次递增
			</el-form-item>
			<el-form-item v-else>
				<div>
					统一开始结束：
					<el-date-picker
						v-model="modeTwoValue"
						end-placeholder="结束时间"
						format="YYYY-MM-DD HH:mm:ss"
						range-separator="To"
						start-placeholder="开始时间"
						type="datetimerange"
						value-format="YYYY-MM-DD HH:mm:ss"
					/>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
const emit = defineEmits(['refreshDataList'])
import { dataListUrl, useUpdateLessonProblemApi } from '@/api/lessons/problem'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
const modeOneValue = ref(1)
const modeTwoValue = ref([] as any[])

const visible = ref(false)
const value = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: dataListUrl,
	queryForm: {
		lessonId: 0,
		type: 1
	},
	isPage: false,
	createdIsNeed: false
})

const lesson = reactive({
	id: 0,
	beginTime: '',
	endTime: ''
})

const init = (obj: any) => {
	visible.value = true
	state.queryForm.lessonId = obj.id
	getDataList()
	lesson.id = obj.id
	lesson.beginTime = obj.beginTime
	lesson.endTime = obj.endTime
	modeTwoValue.value[0] = obj.beginTime
	modeTwoValue.value[1] = obj.endTime
}

const submitHandle = () => {
	if (value.value === true) {
		if (modeOneValue.value > 0) {
			state.dataList[0].beginTime = lesson.beginTime
			let timestamp = Date.parse(lesson.beginTime) + modeOneValue.value * 60 * 1000
			state.dataList[0].endTime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
			for (let i = 1; i < state.dataList.length; i++) {
				state.dataList[i].beginTime = state.dataList[i - 1].endTime
				let ts = Date.parse(state.dataList[i].beginTime) + modeOneValue.value * 60 * 1000
				state.dataList[i].endTime = moment(ts).format('YYYY-MM-DD HH:mm:ss')
			}
		}
	} else {
		state.dataList.forEach((item: any) => {
			item.beginTime = modeTwoValue.value[0]
			item.endTime = modeTwoValue.value[1]
		})
	}

	useUpdateLessonProblemApi(state.dataList).then(() => {
		ElMessage.success({
			message: '修改成功',
			duration: 500,
			onClose: () => {
				visible.value = false
				emit('refreshDataList')
			}
		})
	})
}
const { getDataList } = useCrud(state)
defineExpose({
	init
})
</script>

<style scoped></style>
