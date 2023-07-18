<template>
  <el-dialog v-model="visible" width="80%" title="试卷管理" :close-on-click-modal="false">
    <item-paper v-model="dataList"></item-paper>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import ItemPaper from '@/views/teach/teach-item/item-paper/item-paper.vue'
import {getItemPaperApi, submitItemPaperApi} from "@/api/teach/teachplanitem";

const dataList = ref()
const visible = ref(false)
const itemId = ref()
const init = async (id: number) => {
  itemId.value = id
  await getItemPaper(id)
  visible.value = true
}
const getItemPaper = (id: number) => {
  getItemPaperApi(id).then(res => {
    dataList.value = res.data
  })
}

const submitHandle = () => {
  dataList.value.forEach((item?: any) => {
    item.itemId = itemId.value
  })
  submitItemPaperApi(dataList.value).then((res: any) => {
    if ((res.msg = 'success')) {
      ElMessage.success('更新成功！')
      visible.value = false
    } else {
      ElMessage.warning('更新失败！')
    }
  })
}

defineExpose({
  init
})
</script>

<style scoped></style>
