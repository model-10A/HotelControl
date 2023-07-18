<template>
	<div>
		<el-table :data="modelValue">
			<el-table-column label="选项内容" width="300">
				<template #default="scope">
					<el-input v-model="scope.row.problemOption" type="textarea" placeholder="选项内容" clearable />
				</template>
			</el-table-column>
			<el-table-column label="是否正确" align="center">
				<template #default="scope">
					<el-checkbox v-model="scope.row.isTrue" label="" size="large" @change="updateCheck" />
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作">
				<template #default="scope">
					<el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-button class="mt-4" style="width: 100%" @click="onAddItem">添加</el-button>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
	modelValue: {
		type: Array,
		required: true
	},
	problemId: {
		type: [Number, String],
		default: ''
	}
})
const options = ref(props.modelValue)

const emit = defineEmits(['update:modelValue'])
const deleteRow = (index: number) => {
	options.value.splice(index, 1)
	emit('update:modelValue', options)
}

const onAddItem = () => {
	options.value.push({
		problemId: props.problemId,
		problemOption: '',
		isTrue: false
	})
	emit('update:modelValue', options)
}
const updateCheck = () => {
	emit('update:modelValue', options)
}
</script>

<style scoped></style>
