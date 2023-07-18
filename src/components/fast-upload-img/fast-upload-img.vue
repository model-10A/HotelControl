<template>
	<el-upload
		class="avatar-uploader"
		limit="1"
		:http-request="uploadFileRequest"
		:action="uploadUrl"
		:show-file-list="false"
		:on-success="handleAvatarSuccess"
		:before-upload="beforeAvatarUpload"
	>
		<img v-if="modelValue" :src="modelValue" :style="{ width: imgWidth }" />
		<svg-icon
			v-show="modelValue === '' || modelValue === undefined || modelValue === null"
			icon="icon-cloud-upload"
			style="font-size: 60px"
		></svg-icon>
	</el-upload>
</template>

<script lang="ts" setup>
import constant from '@/utils/constant'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'

const props = defineProps({
	imgWidth: {
		type: String,
		required: true
	},
	modelValue: {
		type: String,
		required: true
	}
})
const emit = defineEmits(['update:modelValue'])
const imageUrl = ref(props.modelValue)
const uploadUrl = constant.uploadUrl
const handleAvatarSuccess = (res: any, file: any) => {
	console.log(res)
	if (res.success == true) {
		ElMessage.success(res.msg)
		imageUrl.value = URL.createObjectURL(file.raw)
		emit('update:modelValue', imageUrl)
	} else {
		ElMessage.error(res.msg)
	}
}
const uploadFileRequest = (file: any) => {
	let fd = new FormData() //构造一个 FormData，把后台需要发送的参数都添加进去
	fd.append('file', file.file) //传文件
	service.post(uploadUrl, fd).then(res => {
		imageUrl.value = res.data.url
		emit('update:modelValue', imageUrl)
	})
}
const beforeAvatarUpload = (file: any) => {
	const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
	const isLt2M = file.size / 1024 / 1024 < 2

	if (!isJPGOrPNG) {
		ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
	}
	if (!isLt2M) {
		ElMessage.error('上传头像图片大小不能超过 2MB!')
	}
	return isJPGOrPNG && isLt2M
}
</script>
