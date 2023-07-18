<template>
	<el-tree-select
		v-model="modelValue"
		clearable
		:render-after-expand="false"
		check-strictly
		:data="kpList"
		filterable
		:props="{ value: 'code', label: 'name', children: 'children' }"
		@change="$emit('update:modelValue', $event)"
	/>
</template>

<script lang="ts" setup>
import { useKpListApi } from '@/api/problem/knowledgepoint'
import { ref } from 'vue'
const props = defineProps({
	modelValue: {
		type: [ String],
		required: true
	}
})
const kpList = ref([])
useKpListApi().then(res => {
	kpList.value = res.data
})
</script>

<style scoped></style>
