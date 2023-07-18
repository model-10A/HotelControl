<template>
  <el-dialog
    v-model="dialogVisible"
    width="100%"
  >
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
          <el-button link type="primary" @click="detailsHandle(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right;margin-bottom: 6px;margin-top: 10px">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAbandon()">确定归档</el-button>
    </div>
  </el-card>
  </el-dialog>
</template>

<script setup lang="ts">

import {ElMessageBox} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import {useGetEventsApi, usePostStuAbandonApi} from "@/api/sale/enroll/enroll";
import {router} from "@/router";
import {useGetSaleListApi} from "@/api/sale/enroll/enrollSupervisor";
import {useCrud} from "@/hooks";
import {IHooksOptions} from "@/hooks/interface";
import {ElMessage} from "element-plus";

const stateList = reactive({
  saleList:[],
  activeList:[]
})

const options =[
  {
    value:0,
    label:'线索阶段'
  },
  {
    value:1,
    label:'已分配阶段'
  },
  {
    value:2,
    label:'已沟通阶段'
  },
  {
    value:3,
    label:'待试听阶段'
  },
  {
    value:4,
    label:'已试听阶段'
  },
  {
    value:5,
    label:'待缴费阶段'
  },
  {
    value:6,
    label:'已缴费阶段'
  },
]

const emit = defineEmits(['refreshDataList'])
const dialogVisible = ref(false)
const selection = ref([])
const init = (selections:any) =>{
  dialogVisible.value = true
  selection.value = selections
}

const detailsHandle = (id:number) => {
  router.push({path:'/details/'+id})
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
      dialogVisible.value = false
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