<template>
	<span>{{ durationFormatter }}</span>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, toRef } from 'vue'
import dayjs from 'dayjs'
const props = defineProps({
	modelValue: {
		type: Boolean,
		required: false
	}
})
const emit = defineEmits(['update:modelValue'])
const timeLeft = ref()
const durationFormatter = computed(() => {
	const time = timeLeft.value
	if (time < 0) {
		emit('update:modelValue', true)
		return '已结束'
	}

	let t = time
	const ss = t % 60
	t = (t - ss) / 60
	if (t < 1) {
		return ss + '秒'
	}
	const mm = t % 60
	t = (t - mm) / 60
	if (t < 1) {
		return mm + '分' + ss + '秒'
	}
	const hh = t % 24
	t = (t - hh) / 24
	if (t < 1) {
		return hh + '小时' + mm + '分' + ss + '秒'
	}
	const dd = t
	return dd + '天' + hh + '小时' + mm + '分' + ss + '秒'
})
let timer: any = null
const getTime = () => {
	// 避免重复执行 setTimeout
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		if (timeLeft.value >= 0) {
			--timeLeft.value
			getTime() // 递归调用
		} else {
			clearTimeout(timer)
		}
	}, 1000)
}

const init = (time: string) => {
	timeLeft.value = dayjs(time).diff(dayjs(new Date()), 'seconds')
	getTime()
}

defineExpose({
	init
})
</script>
<style scoped></style>
