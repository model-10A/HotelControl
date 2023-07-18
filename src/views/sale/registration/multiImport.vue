<template>
  <el-dialog v-model="visible" v-loading="loading" width="80%" :close-on-click-modal="false" draggable>
    <div class="gradient"></div>
    <el-card style="box-shadow: silver 0px 1px !important; border-radius: 0px 0px 10px 10px">
      <p style="font-size: 20px; font-weight: bold">数据导入</p>
    </el-card>
    <el-card style="margin-top: 20px; box-shadow: silver 0px 0px 2px !important; border-radius: 10px">
      <el-upload
          v-model:file-list="fileList"
          class="upload"
          drag
          accept=".xlsx"
          action="#"
          :limit="1"
          :on-exceed="handleExceedIn"
          :auto-upload="false"
      >
         <svg-icon style="font-size: 100px;" color="#bcbaba" icon="icon-upload"></svg-icon>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">文件格式仅支持xls/xlsx，且不超过5M</div>
        </template>
      </el-upload>
    </el-card>
    <el-card>
      <el-row type="flex" justify="center" align="middle">
          <el-button type="primary" @click="importExcel">导入</el-button>
          <el-col :span="4"> </el-col>
          <el-button type="primary" plain @click="visible.value = false">取消</el-button>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {IHooksOptions} from "@/hooks/interface";
import {ElMessage, UploadProps, UploadUserFile} from "element-plus";
import {useImportExcelApi} from "@/api/file/file";

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const init = () =>{
  visible.value = true
}
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {
    stuName: '',
    mobile: '',
    realName: ''
  }
})
const fileList = ref<UploadUserFile[]>([])
const handleExceedIn: UploadProps['onExceed'] = () => {
  ElMessage.warning(`仅限1个文件`)
}
const loading = ref(false)
const importExcel = () =>{
  if (fileList.value.length === 0) {
    ElMessage.warning('文件为空')
    return
  }
  loading.value = true
  const formData = new FormData()
  formData.append('file', fileList.value[0].raw!)
  useImportExcelApi(formData)
      .then(res => {
        ElMessage.success('导入成功')
        fileList.value.slice(0, 1)
        emit('refreshDataList')
      })
      .finally(() => {
        loading.value = false
        visible.value = false
      })
}

defineExpose({
  init
})
</script>

<style scoped>

</style>