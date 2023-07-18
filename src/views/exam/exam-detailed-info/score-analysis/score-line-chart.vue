<template>
	<div ref="main" :style="`height:${$attrs.height || 400}px;width:${$attrs.width + 'px' || '70%'} 800px; `"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue'
//  按需引入 echarts
import * as echarts from 'echarts'
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value
const props = defineProps({
	modelValue: {
		type: Object,
		required: true
	}
})
const dataX = [] as []
const dataY = [] as []
// 指定图表的配置项和数据
let option = {
	dataZoom: [
		//滑动条
		{
			xAxisIndex: 0, //这里是从X轴的0刻度开始
			show: true, //是否显示滑动条，不影响使用
			type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
			startValue: 0, // 从头开始。
			endValue: 30, // 一次性展示6个。
			// start: 0,//默认为0  可设置滚动条从在后进行展示
			// end: 100,//默认为100
			handleSize: 0, //滑动条的 左右2个滑动条的大小
			height: 20, //组件高度
			left: '10%', //左边的距离
			right: '10%', //右边的距离
			bottom: -2, //右边的距离
			borderColor: '#F4F4F4',
			fillerColor: '#E7E7E7',
			backgroundColor: '#F4F4F4', //两边未选中的滑动条区域的颜色
			showDataShadow: false, //是否显示数据阴影 默认auto
			showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
			filterMode: 'filter',
			handleStyle: {
				borderRadius: '20'
			}
		}
	],

	title: {
		text: '考试成绩'
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		data: ['得分'],
		selected: {
			//在这里设置就ok了
			得分: true
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	toolbox: {
		feature: {
			magicType: {
				type: ['bar', 'line']
			},
			saveAsImage: {}
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		axisLabel: {
			interval: 0, //控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。设置为 1，隔一个标签显示一个标签。设置为2，间隔2个标签。以此类推
			rotate: 45 //倾斜度 -90 至 90 默认为0
		},
		data: dataX
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			name: '得分',
			type: 'line',
			data: dataY,
			itemStyle: {
				normal: {
					color: '#5470c5' //改变折线点的颜色
				}
			}
		}
	]
}

const setOptionData = (list: any) => {
	list.forEach((item: any) => {
		dataX.push(item.name)
		dataY.push(item.score)
	})
	console.log(1111, dataX)
	let myChart = echarts.init(main.value)
	myChart.setOption(option)
	//根据浏览器的大小来改变大小
	window.onresize = () => {
		myChart.resize()
	}
}

onBeforeUnmount(() => {
	window.onresize = null
})
defineExpose({ setOptionData })
</script>

<style scoped></style>
