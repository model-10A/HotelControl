<template>
	<el-dialog v-model="visible" width="80%" title="详情" :close-on-click-modal="false" draggable>
		<div style="height: 400px">
			<vue3-tree-org
				:data="state.data"
				:props="{ id: 'id', pid: 'pid', label: 'name', expand: 'expand', children: 'children' }"
				:collapsable="true"
				:label-style="style"
				:node-draggable="true"
				:scalable="false"
				:only-one-node="true"
				:default-expand-level="1"
				:clone-node-drag="true"
				@on-contextmenu="onMenus"
				@on-node-click="onNodeClick"
			>
			</vue3-tree-org>
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'

const state = reactive({
	data: {}
})
const visible = ref(false)
const init = (list: any) => {
	visible.value = true
	state.data = list
}

const style = {
	background: '#fff',
	color: '#5e6d82'
}
const onMenus = (node: any, command: any) => {
	console.log(node, command)
}

const onNodeClick = (e: any, data: any) => {
	// this.$Message.info(data.label)
}

defineExpose({
	init
})
</script>
<style lang="scss" scoped>
.tree-org-node__text {
	text-align: left;
	font-size: 14px;
	.custom-content {
		padding-bottom: 8px;
		margin-bottom: 8px;
		border-bottom: 1px solid currentColor;
	}
}
</style>
