<template>
	<div ref="main" :style="`height:${$attrs.height || 300}px;width:${$attrs.width + 'px' || '70%'} 800px; `"></div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue'
//  按需引入 echarts
import * as echarts from 'echarts'

const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

let dataX = [] as any
let dataY1 = [] as any
let dataY2 = [] as any
let dataY3 = [] as any
let dataY4 = [] as any
let dataY5 = [] as any
let option = {
	title: {
		text: '答题情况反馈'
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		data: ['正确', '错误', '未判', '已答', '未答'],
		selected: {
			//在这里设置就ok了
			正确: true,
			错误: true,
			未判: false,
			已答: false,
			未答: false
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
			saveAsImage: {}
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		axisLabel: {
			interval: 0 //控制坐标轴刻度标签的显示间隔.设置成 0 强制显示所有标签。设置为 1，隔一个标签显示一个标签。设置为2，间隔2个标签。以此类推
		},
		data: dataX
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			name: '未答',
			type: 'line',
			data: dataY1,
			itemStyle: {
				normal: {
					color: '#ffa438' //改变折线点的颜色
				}
			}
		},
		{
			name: '已答',
			type: 'line',
			data: dataY2,
			itemStyle: {
				normal: {
					color: '#c000ff' //改变折线点的颜色
				}
			}
		},
		{
			name: '未判',
			type: 'line',
			data: dataY3,
			itemStyle: {
				normal: {
					color: '#0095ff' //改变折线点的颜色
				}
			}
		},
		{
			name: '正确',
			type: 'line',
			data: dataY4,
			itemStyle: {
				normal: {
					color: '#00a600' //改变折线点的颜色
				}
			}
		},
		{
			name: '错误',
			type: 'line',
			data: dataY5,
			itemStyle: {
				normal: {
					color: '#ff0000' //改变折线点的颜色
				}
			}
		}
	]
}

const setOptionData = (list: any) => {
	list = list.sort((a: any, b: any) => {
		return a.userId - b.userId //	升序则反之
	})
	console.log(list)
	dataX.length = 0
	dataY1.length = 0
	dataY2.length = 0
	dataY3.length = 0
	dataY4.length = 0
	dataY5.length = 0
	list.forEach((item: any) => {
		dataX.push(item.lessonName)
		dataY1.push(item.unansweredNum)
		dataY2.push(item.answeredNum)
		dataY3.push(item.undecidedNum)
		dataY4.push(item.correctNum)
		dataY5.push(item.errorNum)
	})
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

defineExpose({
	setOptionData
})
</script>

<style scoped></style>
