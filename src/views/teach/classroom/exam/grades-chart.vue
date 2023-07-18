<template>
	<el-dialog v-model="visible" title="成绩详情" :close-on-click-modal="false" width="70%" draggable>
		<div ref="main" :style="`height:${$attrs.height || 250}px;width:${$attrs.width + 'px' || '70%'} 800px; `"></div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
//  按需引入 echarts
import * as echarts from 'echarts'
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value
const visible = ref(false)
let dataXs = [] as any
let dataYs = [] as any

// 指定图表的配置项和数据

let option = {
	title: {
		text: ''
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis: [
		{
			type: 'category',
			data: dataXs,
			axisTick: {
				alignWithLabel: true
			},
			axisLabel: {
				interval: 0, //控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。设置为 1，隔一个标签显示一个标签。设置为2，间隔2个标签。以此类推
				rotate: 45, //倾斜度 -90 至 90 默认为0
				formatter: function (value: any) {
					if (value.length > 6) {
						return `${value.slice(0, 4)}...`
					}
					return value
				}
			}
		}
	],
	yAxis: [
		{
			type: 'value'
		}
	],
	series: [
		{
			name: '得分',
			type: 'bar',
			barWidth: '60%',
			data: dataYs
		}
	]
}

const getData = (list: any) => {
	dataXs.length = 0
	dataYs.length = 0
	visible.value = true
	let sum = 0
	list.forEach((item: any) => {
		dataXs.push(item.problemName)
		dataYs.push(item.fraction)
		sum = sum + item.fraction
	})
	option.title.text = '得分：' + sum + '分'
	console.log(option)
	setTimeout(() => {
		let myChart = echarts.init(main.value)
		myChart.setOption(option)
		//根据浏览器的大小来改变大小
		window.onresize = () => {
			myChart.resize()
		}
	}, 100)
}
onBeforeUnmount(() => {
	window.onresize = null
})

defineExpose({
	getData
})
</script>

<style scoped></style>
