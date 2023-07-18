<template>
	<div>
		<el-card>
			<el-steps :active="active" align-center finish-status="success" style="margin: 30px 0">
				<el-step title="添加学生"></el-step>
				<el-step title="选择教学计划"></el-step>
				<el-step title="填写相关信息"></el-step>
			</el-steps>

			<el-card :bordered="false" style="margin-top: 5px">
				<step1 v-show="active === 1" ref="step1Ref"></step1>
				<step2 v-show="active === 2" ref="step2Ref"></step2>
				<step3 v-show="active === 3" ref="step3Ref"></step3>
				<div style="margin-top: 10px; text-align: center">
					<el-button v-show="active > 1" style="margin-right: 10px" type="primary" @click="previous">上一步</el-button>
					<el-button v-show="active < 3" style="margin-left: 10px" type="primary" @click="next">下一步</el-button>
					<el-button v-show="active == 3" style="margin-left: 10px" type="primary" @click="finish">完成</el-button>
				</div>
			</el-card>
		</el-card>
	</div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useRouter } from 'vue-router'
import Step1 from '@/views/teach/teach-class/step/step1.vue'
import Step2 from '@/views/teach/teach-class/step/step2.vue'
import Step3 from '@/views/teach/teach-class/step/step3.vue'

const state: IHooksOptions = reactive({})
const step1Ref = ref()
const step2Ref = ref()
const step3Ref = ref()
const plan = ref({ id: null, lessonNum: null })
const userList = ref()
const active = ref(1)
//下一步
const next = () => {
	console.log('plan' + plan.value)
	console.log('这里是第' + active.value + '步骤')
	if (active.value == 1) {
		console.log(step1Ref.value.change())
		userList.value = step1Ref.value.change()
		active.value++
	}
	if (active.value == 2) {
		console.log(step2Ref.value.change())
		plan.value = step2Ref.value.change()

		console.log(plan.value.id)
		if (plan.value != null) {
      console.log(11234567987)
      step3Ref.value.change(plan.value.id, plan.value.lessonNum, userList.value)
			active.value++
		}
	}
}
//上一步
const previous = () => {
	console.log(active.value)
	active.value--
}
const router = useRouter()
const goto = () => {
	console.log('11111')
	router.push({
		path: '/teachClass'
	})
}
//完成
const finish = () => {
	console.log('完成')
	// step3Ref.value.change(plan.value.id, plan.value.lessonNum, userList.value)
	// goto()
  step3Ref.value.submitHandle()
}
</script>
