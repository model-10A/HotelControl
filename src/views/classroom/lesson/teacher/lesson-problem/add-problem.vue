<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" title="试卷-题目管理" width="80%">
		<el-row :gutter="20">
			<el-col :span="12">
				<el-table :data="dataList" border size="small" style="width: 100%">
					<el-table-column align="center" header-align="center" label="顺序" prop="sort">
						<template #default="scope">
							<el-input v-model="scope.row.sort" size="small"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" header-align="center" label="题目编号" prop="problemId"></el-table-column>
					<el-table-column align="center" header-align="center" label="名称" prop="problemName"></el-table-column>
					<fast-table-column align="center" dict-type="problem_type" header-align="center" label="类型" prop="problemType"></fast-table-column>
					<!--					<el-table-column align="center" fixed="right" header-align="center" label="分数" width="100">-->
					<!--						<template #default="scope">-->
					<!--							<el-input v-model="scope.row.score" size="small"></el-input>-->
					<!--						</template>-->
					<!--					</el-table-column>-->
					<el-table-column align="center" label="试卷类型">
						<template #default="scope">
							<fast-select v-model="scope.row.type" dict-type="teachItem-paperType" size="small"></fast-select>
						</template>
					</el-table-column>
					<el-table-column align="center" fixed="right" header-align="center" label="操作" width="100">
						<template #default="scope">
							<el-button size="small" type="text" @click="cancel(scope.$index)">取消</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<el-col :span="12">
				<problem-bank2></problem-bank2>
			</el-col>
		</el-row>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'
import ProblemBank2 from '@/components/problem-bank/problem-bank2.vue'
import { provide, reactive } from 'vue'
const emit = defineEmits(['refreshDataList'])
import { useBatchInsertLessonProblem } from '@/api/lessons/problem'
import { ElMessage } from 'element-plus'
const visible = ref(false)
const dataList = reactive([])
provide('dataList', dataList)
const init = () => {
	visible.value = true
}
const submitObj = reactive({
	lessonId: inject('lessonId'),
	list: dataList
})

const submitHandle = () => {
	useBatchInsertLessonProblem(submitObj).then(res => {
		ElMessage.success('修改成功')
		dataList.splice(0, dataList.length)
		visible.value = false
		emit('refreshDataList')
	})
}
const cancel = (index: number) => {
	dataList.splice(index, 1)
}
defineExpose({
	init
})
</script>

<style scoped></style>
