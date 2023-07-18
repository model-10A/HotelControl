<template>
	<el-dialog v-model="visible" width="80%" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" >
		<el-steps :active="active" align-center>
			<el-step title="日历属性"> </el-step>
			<el-step title="添加试卷"> </el-step>
		</el-steps>
		<div v-show="active == 0">
			<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
				<el-form-item label="名称" prop="name">
					<el-input v-model="dataForm.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item label="说明" prop="description">
					<el-input v-model="dataForm.description" type="textarea" placeholder="说明"></el-input>
				</el-form-item>
				<el-form-item label="子项顺序" prop="sort">
          <el-input-number v-model="dataForm.sort" :precision="0" :step="1"  />
				</el-form-item>
				<el-form-item label="时长" prop="duration">
					<el-input-number v-model="dataForm.duration" :precision="0" :step="1"  />
					<span style="padding-left: 10px">（分钟）</span>
				</el-form-item>
			</el-form>
		</div>

		<div v-show="active == 1">
			<item-paper v-model="dataForm.paperList"></item-paper>
		</div>

		<div style="text-align: center">
			<el-button
				v-show="active == 0"
				type="primary"
				@click="
					() => {
						active++
					}
				"
				>下一步</el-button
			>
			<el-button
				v-show="active == 1"
				type="primary"
				@click="
					() => {
						active--
					}
				"
				>上一步</el-button
			>
		</div>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import { useTeachPlanItemApi, useTeachPlanItemSubmitApi } from '@/api/teach/teachplanitem'
import ItemPaper from '@/views/teach/teach-item/item-paper/item-paper.vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const active = ref(0)
const dataForm = reactive({
	id: 0,
	planId: 0,
	sort: '',
	duration: '',
	name: '',
	description: '',
	createTime: '',
	updateTime: '',
	creator: '',
	updater: '',
	deleted: '',
	version: '',
	paperList: []
})

const init = (planId: number, id?: number) => {
	visible.value = true
  active.value=0;
  dataForm.paperList.splice(0,dataForm.paperList.length)

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	if (id) {
		getTeachPlanItem(id)
	}
	dataForm.planId = planId
}

const getTeachPlanItem = (id: number) => {
	useTeachPlanItemApi(id).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	duration: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	sort: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}
    console.log(dataForm)
		useTeachPlanItemSubmitApi(dataForm).then(() => {
			ElMessage.success({
				message: '操作成功',
				duration: 500,
				onClose: () => {
					visible.value = false
					emit('refreshDataList')
				}
			})
		})
	})
}

defineExpose({
	init
})
</script>
