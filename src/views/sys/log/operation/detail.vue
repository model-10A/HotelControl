<template>
	<el-dialog v-model="visible" title="日志详情" :close-on-click-modal="false" width="800px" draggable>
		<el-form label-width="100px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="模块名称" prop="jobId">
						<el-input v-model="dataForm.module" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="操作人" prop="jobName">
						<el-input v-model="dataForm.username" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="操作IP" prop="jobGroup">
						<el-input v-model="dataForm.ip" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="请求路径" prop="beanName">
						<el-input v-model="dataForm.url" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="方法名称" prop="beanName">
						<el-input v-model="dataForm.method" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="请求方式" prop="params">
						<el-input v-model="dataForm.type" disabled></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="执行时间" prop="createTime">
						<el-input v-model="dataForm.createTime" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="执行时长" prop="status">
						<el-tag type="danger">{{ dataForm.times }}ms</el-tag>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="任务状态" prop="status">
						<el-tag v-if="dataForm.status === 0" type="danger">失败</el-tag>
						<el-tag v-else type="success">成功</el-tag>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="方法参数" prop="error">
				<el-input v-model="dataForm.params" :rows="2" type="textarea" disabled />
			</el-form-item>
			<el-form-item v-if="dataForm.status === 0" label="错误信息" prop="error">
				<el-input v-model="dataForm.error" :rows="8" type="textarea" disabled />
			</el-form-item>
			<el-form-item v-if="dataForm.status === 1" label="返回结果" prop="error">
				<el-input v-model="dataForm.result" :rows="8" type="textarea" disabled />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="visible = false">关闭</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const visible = ref(false)
let dataForm = reactive({
	module: '',
	jobName: '',
	type: '',
	jobGroup: '',
	ip: '',
	url: '',
	method: '',
	params: '',
	error: '',
	result: '',
	times: 0,
	status: 0,
	createTime: ''
})

const init = (data?: any) => {
	visible.value = true

	Object.assign(dataForm, data)
}

defineExpose({
	init
})
</script>
