<template>
  <el-card style="margin-bottom: 10px">
    <el-form>
      <el-row>
        <el-form-item prop="stuName">
          <el-input v-model="state.queryForm.stuName" placeholder="学生姓名" size="small" clearable/>
        </el-form-item>
        <el-col :span="1"></el-col>
        <el-form-item>
          <el-select v-model="state.queryForm.saleId" class="m-2" placeholder="销售" size="small">
            <el-option
                v-for="item in sale"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-col :span="1"></el-col>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.beginTime"
                  type="date"
                  size="small"
                  placeholder="缴费开始时间"
              />
            </div>
          </div>
        </el-form-item>
        <el-col :span="1"></el-col>
        <el-form-item>
          <div class="demo-date-picker" >
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.endTime"
                  type="date"
                  placeholder="缴费结束时间"
                  size="small"
              />
            </div>
          </div>
        </el-form-item>
        <el-col :span="1"></el-col>
        <el-form-item>
          <el-select v-model="state.queryForm.status" class="m-2" placeholder="状态" size="small">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="20">
        </el-col>
        <el-form-item>
          <el-button size="small" type="primary" @click="getDataList">搜索</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
  <el-card>
    <el-table :data="state.dataList" v-loading="state.dataListLoading" style="width: 100%">
      <el-table-column fixed prop="stuName" header-align="center" align="center" label="学生姓名" width="120"/>
      <el-table-column prop="createTime" header-align="center" align="center" label="申请缴费日期" width="200"/>
      <el-table-column prop="activityName" header-align="center" align="center" label="报名活动" width="200"/>
      <el-table-column prop="discountName" header-align="center" align="center" label="报名优惠" width="200"/>
      <el-table-column prop="status" header-align="center" align="center" label="缴费状态" width="200">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="primary" effect="light" size="large">待缴费</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success" effect="light" size="large">已缴费</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="saleName" header-align="center" align="center" label="销售"/>
      <el-table-column fixed="right" header-align="center" align="center" label="操作">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="payment(scope.row.enrollId,scope.row.teachPayId,scope.row.status)"
          >缴费
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="state.page"
        :page-sizes="state.pageSizes"
        :page-size="state.limit"
        :total="state.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
    >
    </el-pagination>
  </el-card>
  <Payment ref="paymentRef"></Payment>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import store from "@/store";
import {IHooksOptions} from "@/hooks/interface";
import {dataListURL} from "@/api/teach/handler";
import {useCrud} from "@/hooks";
import {useGetSaleListApi} from "@/api/sale/enroll/enrollSupervisor";
import Payment from "@/views/teach/handler/payment.vue";

const id = store.userStore.user.id
const tableData = ref([])

const state:IHooksOptions = reactive({
  dataListUrl: dataListURL,
  deleteUrl: '',
  queryForm: {
    handlerId:store.userStore.user.id,
    stuName: '',
    saleId: '',
    beginTime: '',
    endTime:'',
    status: '',
  },
  dataList: [],
})

const options = [
  {
    value: 0,
    label: '未缴费'
  },
  {
    value: 1,
    label: '已缴费'
  },
]
const paymentRef =  ref()
const payment = (id:number,teachPayId:number,status:number) =>{
  paymentRef.value.init(id,teachPayId,status)
}

const sale = ref([])
const getSale = () =>{
  useGetSaleListApi().then(res=>{
    sale.value = res.data
  })
}

const reset = () => {
  state.queryForm = {}
  state.queryForm.handlerId = store.userStore.user.id
  getDataList()
}

const{getDataList,sizeChangeHandle,currentChangeHandle} = useCrud(state)
onMounted(()=>{
  getSale()
})
</script>

<style scoped>

</style>