<template>
  <el-dialog v-model="visible" v-loading="loading" width="80%" :close-on-click-modal="false" draggable>
<!--	<el-card style="margin-bottom: 10px">-->
<!--		<el-form inline>-->
<!--			<el-form-item>-->
<!--				<el-input placeholder="姓名"></el-input>-->
<!--			</el-form-item>-->
<!--			<el-form-item>-->
<!--        <el-select placeholder="活动">-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value"-->
<!--          />-->
<!--        </el-select>-->
<!--			</el-form-item>-->
<!--			<el-form-item>-->
<!--      <el-select placeholder="状态">-->
<!--        <el-option-->
<!--          v-for="item in options"-->
<!--          :key="item.value"-->
<!--          :label="item.label"-->
<!--          :value="item.value"-->
<!--        />-->
<!--      </el-select>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
<!--    <div style="float: right;margin-bottom: 6px">-->
<!--      <el-button @click="communicate(scope.row.id)">重置</el-button>-->
<!--      <el-button type="primary" @click="detailsHandle">搜索</el-button>-->
<!--    </div>-->
<!--  </el-card>-->
  <el-card>
    <el-table
        border
        :data="selection"
    >
      <el-table-column prop="stuNumber" label="编号" header-align="center" align="center" width="130"></el-table-column>
      <el-table-column prop="name" label="姓名" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column prop="events" label="活动名称" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column
          prop="enrollTime"
          label="报名时间"
          header-align="center"
          align="center"
          :formatter="gridDateFormatter"
          width="150"
      ></el-table-column>
      <el-table-column prop="saleName" label="销售" align="center" width="120"></el-table-column>
      <el-table-column
          prop="lastCommunicateTime"
          label="上次沟通"
          header-align="center"
          align="center"
          :formatter="gridDateFormatter"
          width="150"
      ></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template #default="scope">
          <el-button link type="primary" disabled>沟通</el-button>
          <el-button link type="primary" @click="detailsHandle(scope.row.enrollId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
      <div style="float: right;margin-bottom: 6px;margin-top: 10px">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitAbandon()">确定归档</el-button>
      </div>
  </el-card>
</el-dialog>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {router} from "@/router";
import { usePostStuAbandonApi } from "@/api/sale/enroll/enroll";
import {ElMessage} from "element-plus";


const emit = defineEmits(['refreshDataList'])
const  detailsHandle = (id:number) => {
  router.push({path:'/details/'+id})
}
const selection = ref([])
const visible = ref(false)
const init = (selections:any) =>{
  visible.value = true
  selection.value = selections
}

const submitAbandon = () => {
  let arr = [];
  selection.value.forEach(e => {
    arr.push(e.enrollId)
  })

  usePostStuAbandonApi(arr).then(res=>{
    if (res.msg === 'success') {
      ElMessage.success({
        message: '归档成功！',
        duration: 1000,
      })
      visible.value = false
      emit('refreshDataList')
    }
  })
}

defineExpose({
  init
})
</script>

<style scoped>

</style>