<template>
  <el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="订单详情" name="first">
        <el-form v-model="OrderForm" label-width="90px">
          <el-form-item label="订单号:">{{route.params.id}}</el-form-item>
          <el-form-item label="产品名称:">{{OrderForm.orderName}}</el-form-item>
          <el-form-item label="订单渠道:">同业采购</el-form-item>
          <el-form-item label="下单时间:">{{OrderForm.creatTime}}</el-form-item>
          <el-form-item label="结算金额:">{{OrderForm.totalPay}}</el-form-item>
          <el-form-item label="订单状态:">{{OrderForm.status}}</el-form-item>
        </el-form>
<!--
        <el-table :data="OrderForm" border style="width: 100%">
          <el-table-column prop="productsName" label="产品名称" header-align="center" align="center" width="640">川主寺岷江源国际大酒店</el-table-column>
          <el-table-column prop="time" label="入住时间" header-align="center" align="center" width="250">2023-02-14</el-table-column>
          <el-table-column prop="time" label="离店时间" header-align="center" align="center" width="250">2023-02-24</el-table-column>
          <el-table-column prop="time" label="房间数量" header-align="center" align="center" width="100">2</el-table-column>
          <el-table-column prop="time" label="结算金额" header-align="center" align="center" width="150">¥3500.00</el-table-column>
        </el-table>
-->

        <el-form v-model="OrderForm" label-width="300px">
        <el-row>
          <span style="font-size: 20px;">联系人信息</span>
          <el-form-item label="姓名:"></el-form-item>
          <el-form-item label="手机号码:"></el-form-item>
          <el-form-item label="电子邮箱:"></el-form-item>
        </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { TabsPaneContext } from 'element-plus'
import {useRoute} from "vue-router";
import { useGetOrderInfoApi } from "@/api/business/business";

const route = useRoute()
const activeName = ref('first')

const OrderForm = reactive({
  id:route.params.id,
  creatTime:'',
  totalPay:'',
  startTime:'',
  endTime:'',
  roomAmount:'',
  status:'',
  orderName:'',
  customerName:'',
  phone:'',
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const getOrderInfo=(id:any) => {
  useGetOrderInfoApi(id).then(res=> {
    Object.assign(OrderForm,res.data);
    console.log("Successfully Get Info from Data")
  })
}

onMounted( ()=>{getOrderInfo(route.params.id)
})
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>