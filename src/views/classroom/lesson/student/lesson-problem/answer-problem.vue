<template>
	<el-drawer v-model="visible" :modal="false" :size="visibled ? '100%' : '50%'" title="答题卡">
		<el-row :gutter="24">
			<el-col :span="12">
				<div v-if="visibled">
					<el-card v-if="state.dataList.length > 0">
						<el-collapse
							v-for="(item, index) in state.dataList"
							:key="index"
							v-model="collapseValue"
							accordion="true"
							@change="handleChange(item.id)"
						>
							<el-collapse-item :name="item.id">
								<template #title>
									<div class="collapse"><el-avatar :size="20" :src="item.creatorAvatar"></el-avatar></div>
									<div class="collapse">{{ item.creatorName }}</div>
									<div class="collapse">{{ item.title }}</div>
								</template>
								<div style="margin-left: 10px" v-html="item.content"></div>
							</el-collapse-item>
						</el-collapse>
					</el-card>
					<el-empty v-else description="暂无题解" />
					<el-pagination
						v-if="state.total > 10"
						:current-page="state.page"
						:page-size="state.limit"
						:page-sizes="state.pageSizes"
						:total="state.total"
						layout="total, prev, pager, next"
						@size-change="sizeChangeHandle"
						@current-change="currentChangeHandle"
					>
					</el-pagination>
				</div>
			</el-col>
			<el-col :span="visibled ? 12 : 24">
				<code-problem-info v-show="problemType === 3" ref="codeRef" @getProblemSolvingList="getProblemSolvingList"></code-problem-info>
				<fill-problem-info v-show="problemType === 2" ref="fillRef"></fill-problem-info>
				<choice-problem-info v-show="problemType === 1" ref="choiceRef"></choice-problem-info>
			</el-col>
		</el-row>
	</el-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CodeProblemInfo from '@/components/problem-info/code-problem-info.vue'
import ChoiceProblemInfo from '@/components/problem-info/choice-problem-info.vue'
import FillProblemInfo from '@/components/problem-info/fill-problem-info.vue'
import { dataListUrl, getProblemSolving } from '@/api/problem/problemExplanation'
import { reactive } from 'vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'

const collapseValue = ref()
const visibled = ref(false)
const problemType = ref()
const visible = ref(false)
const codeRef = ref()
const fillRef = ref()
const choiceRef = ref()
const dialog = ref()
const state: IHooksOptions = reactive({
	dataListSelections: [],
	dataListUrl: dataListUrl,
	createdIsNeed: false,
	queryForm: {
		problemId: '',
		problemType: ''
	},
	dataList: []
})
onMounted(async () => {
	//提前渲染body
	visible.value = true
	await new Promise(resolve => setTimeout(resolve, 10))
	visible.value = false
})

const initProblem = (problemId: any, pType?: any, source?: number, lessonId?: number) => {
	problemType.value = pType
	state.queryForm.problemType = pType
	state.queryForm.problemId = problemId
	visible.value = true
	visibled.value = false
	state.dataList = []
	if (pType == 1) {
		choiceRef.value.init(problemId, source, lessonId)
	} else if (pType === 2) {
		fillRef.value.init(problemId, source, lessonId)
	} else if (pType === 3) {
		codeRef.value.init(problemId, source, lessonId)
	}
}

const handleChange = (id: any) => {
	console.log(collapseValue.value)
	if (collapseValue.value != '') {
		getProblemSolving(id).then(res => {
			state.dataList?.forEach((item: any) => {
				if (item.id === id) {
					item.content = res.data.content
				}
			})
		})
	}
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)

const getProblemSolvingList = () => {
	visibled.value = !visibled.value
	state.dataList = []
	if (visibled.value) {
		getDataList()
	} else {
		return
	}
}

defineExpose({
	initProblem
})
</script>

<style scoped>
.collapse {
	margin-left: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>
