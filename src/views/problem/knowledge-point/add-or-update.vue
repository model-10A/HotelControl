<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" draggable>
		<el-form
			ref="dataFormRef"
			style="max-height: 60vh; overflow: auto"
			:model="dataForm"
			:rules="dataRules"
			label-width="120px"
			@keyup.enter="submitHandle()"
		>
			<el-form-item prop="name" label="名称">
				<el-input v-model="dataForm.name" placeholder="名称"></el-input>
			</el-form-item>
			<el-form-item prop="sort" label="说明">
				<el-input v-model="dataForm.description" type="textarea"></el-input>
			</el-form-item>
			<el-form-item v-if="!dataForm.id" prop="parentName" label="上级菜单" class="popover-list">
				<el-popover ref="kpListPopover" placement="bottom-start" trigger="click" :width="400">
					<template #reference>
						<el-input v-model="dataForm.parentName" :readonly="true" placeholder="上级菜单">
							<template #suffix>
								<svg-icon v-if="dataForm.pid !== '0'" icon="icon-close-circle" @click.stop="treeSetDefaultHandle()"></svg-icon>
							</template>
						</el-input>
					</template>
					<div>
						<el-tree
							ref="kpListTree"
							style="max-height: 200px; overflow: auto"
							:data="kpList"
							:props="{ label: 'name', children: 'children' }"
							node-key="id"
							:highlight-current="true"
							:expand-on-click-node="false"
							accordion
							@current-change="treeCurrentChange"
						>
						</el-tree>
					</div>
				</el-popover>
			</el-form-item>
			<el-form-item prop="sort" label="排序">
				<el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="submitHandle()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getIconList } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { useKpApi, useKpListApi, useKpSubmitApi } from '@/api/problem/knowledgepoint'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const kpList = ref([])
const iconList = ref<string[]>([])
const kpListTree = ref()
const dataFormRef = ref()
const kpListPopover = ref()
const iconListPopover = ref()

const dataForm = reactive({
	id: '',
	name: '',
	description: '',
	pid: '0',
	parentName: '',
	sort: 0,
	code: ''
})

const init = (id?: number) => {
	visible.value = true
	dataForm.id = ''

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	// id 存在则为修改
	if (id) {
		getKp(id)
	} else {
		treeSetDefaultHandle()
	}

	// 菜单列表
	getKpList()

	// icon列表
	iconList.value = getIconList()
}

// 获取菜单列表
const getKpList = () => {
	return useKpListApi().then(res => {
		kpList.value = res.data
	})
}

// 获取信息
const getKp = (id: number) => {
	useKpApi(id).then(res => {
		Object.assign(dataForm, res.data)

		if (dataForm.pid == '0') {
			return treeSetDefaultHandle()
		}

		kpListTree.value.setCurrentKey(dataForm.pid)
	})
}

// 上级菜单树, 设置默认值
const treeSetDefaultHandle = () => {
	dataForm.pid = '0'
	dataForm.parentName = '一级菜单'
	dataForm.code = null
}

const treeCurrentChange = (data: any) => {
	dataForm.pid = data.id
	dataForm.parentName = data.name
	kpListPopover.value.hide()
}

const dataRules = ref({
	name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 表单提交
const submitHandle = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false
		}

		useKpSubmitApi(dataForm).then(() => {
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

<style lang="scss" scoped>
.mod__menu {
	::v-deep(.el-popover.el-popper) {
		overflow-x: hidden;
	}

	.popover-list {
		::v-deep(.el-input__inner) {
			cursor: pointer;
		}
		::v-deep(.el-input__suffix) {
			cursor: pointer;
		}
	}

	&-icon-inner {
		width: 100%;
		max-height: 260px;
		overflow-x: hidden;
		overflow-y: auto;
		// 滚动条的宽度
		&::-webkit-scrollbar {
			width: 8px;
			height: 8px;
			background: transparent;
		}
		// 滚动条的设置
		&::-webkit-scrollbar-thumb {
			background-color: #dddddd;
			background-clip: padding-box;
			min-height: 28px;
			border-radius: 4px;
		}
		&::-webkit-scrollbar-thumb:hover {
			background-color: #bbb;
		}
	}
	&-icon-list {
		width: 458px !important;
		padding: 0;
		margin: -8px 0 0 -8px;
		> .el-button {
			padding: 8px;
			margin: 18px 0 0 8px;
			> span {
				display: inline-block;
				vertical-align: middle;
				width: 18px;
				height: 18px;
				font-size: 18px;
			}
		}
	}
}
</style>
