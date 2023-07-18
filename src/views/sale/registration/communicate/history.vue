<template>
  <el-dialog v-model="visible" width="80%">
    <div style="text-align: center;margin-bottom: 10px">
      <p style="font-size: 24px;font-weight: bold">历史沟通记录</p>
    </div>
    <el-table :data="communicateHis" border style="width: 100%">
      <el-table-column prop="communicateTime" label="沟通时间" width="150" align="center"/>
      <el-table-column prop="saleName" label="销售人" width="150" align="center"/>
      <el-table-column prop="result" label="沟通类型" width="150" align="center">
        <template #default="scope">
          <span v-if="scope.row.result === '1'">试听沟通</span>
          <span v-else-if="scope.row.result === '2'">缴费沟通</span>
          <span v-else-if="scope.row.result === '0'">常规沟通</span>
        </template>
      </el-table-column>
      <el-table-column prop="explanation" label="沟通内容" align="center"/>
    </el-table>
    <template #footer>
      <el-button @click="visible = false" type="primary" size="large">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import { reactive, ref } from "vue";

const visible = ref(false)
const init = () => {
  visible.value = true
}

const props = defineProps(['communicateHis'])
const his = props.communicateHis
console.log(his.value)

defineExpose({
  init
})
</script>

<style scoped>

</style>