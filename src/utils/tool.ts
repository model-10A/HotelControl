import type { App, Plugin } from 'vue'
import constant from '@/utils/constant'

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
	return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}
// 是否外链
export const isExternalLink = (url: string): boolean => {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}
// 替换外链参数
export const replaceLinkParam = (url: string): string => {
	return url.replace('{{apiUrl}}', constant.apiUrl)
}

// 转换文件大小格式
export const convertSizeFormat = (size: number): string => {
	const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	let index = Math.floor(Math.log(size) / Math.log(1024))
	let newSize = size / Math.pow(1024, index)

	// 保留的小数位数
	return newSize.toFixed(2) + ' ' + unit[index]
}

// 获取svg图标(id)列表
export const getIconList = (): string[] => {
	const rs: string[] = []
	const list = document.querySelectorAll('svg symbol')
	for (let i = 0; i < list.length; i++) {
		rs.push(list[i].id)
	}
	return rs
}

// 获取字典Label
export const getDictLabel = (dictList: any[], dictType: string, dictValue: string) => {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		const val = type.dataList.find((element: any) => element.dictValue === dictValue + '')
		if (val) {
			return val.dictLabel
		} else {
			return dictValue
		}
	} else {
		return dictValue
	}
}

// 获取字典数据列表
export function getDictDataList(dictList: any[], dictType: string) {
	const type = dictList.find((element: any) => element.dictType === dictType)
	if (type) {
		return type.dataList
	} else {
		return []
	}
}

// 全局组件安装
export const withInstall = <T>(component: T, alias?: string) => {
	const comp = component as any
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName, component)
		if (alias) {
			app.config.globalProperties[alias] = component
		}
	}
	return component as T & Plugin
}

export const flexColumnWidth = (str: any, arr1: any, flag = 'max') => {
	// str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
	// flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
	// flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
	str = str + ''
	let columnContent = ''
	if (!arr1 || !arr1.length || arr1.length === 0 || arr1 === undefined) {
		return
	}
	if (!str || !str.length || str.length === 0 || str === undefined) {
		return
	}
	if (flag === 'equal') {
		// 获取该列中第一个不为空的数据(内容)
		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i][str].length > 0) {
				// console.log('该列数据[0]:', arr1[0][str])
				columnContent = arr1[i][str]
				break
			}
		}
	} else {
		// 获取该列中最长的数据(内容)
		let index = 0
		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i][str] === null) {
				return
			}
			const now_temp = arr1[i][str] + ''
			const max_temp = arr1[index][str] + ''
			if (now_temp.length > max_temp.length) {
				index = i
			}
		}
		columnContent = arr1[index][str]
	}
	// console.log('该列数据[i]:', columnContent)
	// 以下分配的单位长度可根据实际需求进行调整
	let flexWidth = 0
	for (const char of columnContent) {
		if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
			// 如果是英文字符，为字符分配8个单位宽度
			flexWidth += 8
		} else if (char >= '\u4e00' && char <= '\u9fa5') {
			// 如果是中文字符，为字符分配15个单位宽度
			flexWidth += 15
		} else {
			// 其他种类字符，为字符分配8个单位宽度
			flexWidth += 8
		}
	}
	if (flexWidth < 80) {
		// 设置最小宽度
		flexWidth = 80
	}
	// if (flexWidth > 250) {
	//   // 设置最大宽度
	//   flexWidth = 250
	// }
	return flexWidth + 'px'
}

export const getFileName = (path: string) => {
	path = path.replaceAll('\\', '/')
	return path.substring(path.lastIndexOf('/') + 1)
}
