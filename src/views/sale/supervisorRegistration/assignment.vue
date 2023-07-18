<template>
  <el-dialog
    v-model="dialogVisible"
    width="100%"
  >
  <el-card style="margin-bottom: 10px">
    <el-table style="margin-bottom: 16px" :data="studentFormForSupervisor">
      <el-table-column label="学员编号" width="150" align="center"  prop="stuNumber"/>
      <el-table-column label="姓名" width="100" align="center" prop="stuName"/>
      <el-table-column label="学校" align="center" prop="school"/>
      <el-table-column label="年级" width="100" align="center" prop="grades"/>
      <el-table-column label="活动" align="center" prop="title"/>
      <el-table-column label="报名时间" align="center" prop="registerBeginTime"/>
      <el-table-column label="状态" width="100" align="center" prop="status"/>
      <el-table-column label="报名备注" align="center" prop="description"/>
      <el-table-column label="销售" align="center">
        <template #default="scope">
          <el-select v-model="sale.id" class="m-2" placeholder="销售">
            <el-option
              v-for="item in state.saleList"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
            />
          </el-select>
        </template>
    </el-table-column>
    </el-table>
    <el-row>
      <template #default="scope">
        <el-col :span="11"></el-col>
        <el-button type="primary" @click="onSubmit(studentFormForSupervisor)">确认</el-button>
        <el-button @click="cancelHandle">取消</el-button>
      </template>
    </el-row>
  </el-card>
  <el-card>
    <el-form inline v-model="state">
      <el-form-item label="查看销售学员" style="font-weight: bold">
        <el-select v-model="state.saleId" class="m-2" placeholder="销售">
          <el-option
            v-for="item in state.saleList"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getStuInfoFromSale(state.saleId)">确认</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="报名编号" width="150" align="center" prop="enrollId"/>
      <el-table-column label="姓名" width="100" align="center" prop="stuName"/>
      <el-table-column label="学校" align="center" prop="school"/>
      <el-table-column label="年级" width="80" align="center" prop="grade"/>
      <el-table-column label="家庭住址" align="center" prop="address"/>
      <el-table-column label="备注" align="center" prop="description"/>
    </el-table>
  </el-card>
  </el-dialog>
</template>

<script setup lang="ts">


import {
  useGetSaleListApi,
  useGetSalesStudentsInfoForSupervisor, useGetStuAndSaleInfoForSupervisor,
  useSubmitAssignmentForSupervisorInsert,useSubmitAssignmentForSupervisorUpdate
} from "@/api/sale/enroll/enrollSupervisor";
import { onMounted, reactive, ref } from "vue";

const sale = reactive(
  {
    id:'',
    realName:''
  }
)

const studentFormForSupervisor = ref([
  {
    id:'',
    enrollId:'',
    stuNumber: '',
    realName: '',
    school:'',
    grades:'',
    events: '',
    registerTime: '',
    status: '',
    description:'',
    mobile:'',
    saleId:sale.id
}])

//查询销售对应的学生信息
const tableData = ref([
  {
    enrollId: '',
    stuName: '',
    school:'',
    grade: '',
    address:'',
    description:''
  }
])

const state = reactive({
  saleId:'',
  saleList:[]
})

const dialogVisible = ref(false)

const selection = ref([])

const init = (selections:any) =>{
  dialogVisible.value = true
  selection.value = selections
  console.log(selection.value)
}

const onSubmit = (form:any) =>{
  for (let i = 0;i<form.length;i++){
    if (form[i].enrollId == null){
      useSubmitAssignmentForSupervisorInsert(form[i])
    }
    else {
      useSubmitAssignmentForSupervisorUpdate(form[i])
    }
  }

  dialogVisible.value = false
}

const cancelHandle = () => {
  dialogVisible.value = false
}

//获取销售信息
const getSales = () => {
  useGetSaleListApi().then(res => {
    state.saleList =res.data
    console.log(state.saleList);
  })
}

const getStuList = () =>{
  let arr = [];
  selection.value.forEach(e => {
    arr.push(e.enrollId)
  })
  useGetStuAndSaleInfoForSupervisor(arr).then(res => {
    console.log(arr);
    studentFormForSupervisor.value=res.data
  })
}

const getStuInfoFromSale = (id:any) =>{
  useGetSalesStudentsInfoForSupervisor(id).then(res => {
    tableData.value=res.data
    console.log(tableData.value);
  })
}

onMounted(()=>{
  getSales()
})

defineExpose({
  init,
  getStuList
})
</script>

<style scoped>

</style>