<template>
  <el-dialog
      v-model="dialogVisible"
      title="导入excel文件"
      width="30%"
  >
    <el-upload
        v-model:file-list="excelList"
        accept=".xls,.xlsx"
        class="upload-demo"
        action="#"
        :auto-upload="false"
        multiple=""
        method="post"
        style="margin-left: 10px"
        name="files"
    >
      <el-button type="primary">导入文件</el-button>
      <template #tip>
        <div class="el-upload__tip">.xlsx格式文件或.xls格式文件</div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle()"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, UploadInstance } from 'element-plus'
import { UploadProps, UploadUserFile } from 'element-plus'
import {uploadSampleProblemApi} from "@/api/problem/problemsample";
import {importExcelFillProblemApi} from "@/api/problem/importExcel";
const excelList = ref<UploadUserFile[]>([])
const init = ()=>{
  dialogVisible.value=true
}
const dialogVisible = ref(false)
const submitHandle = () =>{
  if(excelList.value.length===0){
    ElMessage.warning('未选择文件')
    return
  }
  console.log(excelList)
  const formData = new FormData()
  formData.append('file', excelList.value[0].raw)
  importExcelFillProblemApi(formData).then(res => {
    ElMessage.success('上传文件成功')
  })
  dialogVisible.value=false
}

defineExpose({
  init
})
</script>

<style scoped>

</style>