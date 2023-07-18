<template>
	<el-tree-select
		v-model="modelValue"
		clearable
		:render-after-expand="false"
		check-strictly
		:data="orgList"
		filterable
		:props="{ value: 'id', label: 'name', children: 'children' }"
		@change="change"
	/>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useOrgApi } from '@/api/teach/student'
const emit = defineEmits(['changeIt'])
const props = defineProps({
	modelValue: {
		type: [String],
		required: true
	}
})
const orgList = ref([])
let orgXlist: never[] = []
useOrgApi().then(res => {
	orgList.value = res.data
	orgXlist = orgList.value
})
let id = ref()
let k = 0
const org = ref()

const getChild = (org: any, id: any, orgArr: any) => {
	for (let i = 0; i < org.length; i++) {
		if (org[i].id == id) {
			orgArr[k] = org[i].id
			k++
			console.log(k)
			if (org[i].children.length != 0) {
				childNodesDeep(org[i].children, orgArr)
			} else {
				return orgArr
			}
		} else if (org[i].children.length != 0) {
			getChild(org[i].children, id, orgArr)
		}
	}
	return orgArr
}
const childNodesDeep = (org: any, orgArr: any) => {
	if (org.length != 0) {
		for (let i = 0; i < org.length; i++) {
			orgArr[k] = org[i].id
			k++
			if (org[i].children.length != 0) {
				childNodesDeep(org[i].children, orgArr)
			}
		}
	}
}
const change = (row: any) => {
	const orgArr: never[] = []
	orgArr.length = 0
	k = 0
	id = row
	console.log(getChild(orgXlist, id, orgArr))
	emit('changeIt', orgArr)
}
</script>

<style scoped></style>
