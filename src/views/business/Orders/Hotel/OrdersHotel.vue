<template>
  <el-card>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="我的订单" name="first">
        <el-row>
          <el-input placeholder="请输入消费码或订单号进行搜索" style="width: 380px;" clearable />
          <el-button type="primary">查询</el-button>
          <el-col :span="16"></el-col>
          <el-button type="primary" @click="Reload">刷新</el-button>
        </el-row>
        <el-table v-loading="state.dataListLoading" :data="state.dataList" @selection-change="selectionChangeHandle"  style="width: 100%">
          <el-table-column prop="id" label="订单编号" header-align="center" align="center" width="200"></el-table-column>
          <el-table-column prop="orderName" label="产品名称" header-align="center" align="center" width="520"></el-table-column>
          <el-table-column prop="startTime" label="入住时间" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="endTime" label="入住时间" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="roomAmount" label="数量" header-align="center" align="center" width="100"></el-table-column>
          <el-table-column prop="totalPay" label="结算金额" header-align="center" align="center" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" header-align="center" align="center" width="100"></el-table-column>
          <el-table-column prop="action" label="查看" header-align="center" align="center" width="100">
            <template #default="scope">
              <el-button type="primary" @click="ordersDetail(scope.row.id)" :icon="Search" circle />
            </template>
          </el-table-column>
          <el-table-column prop="action" label="编辑" header-align="center" align="center" width="100">
            <template #default="scope">
              <el-button type="primary" @click="ordersDetail(scope.row.id)" :icon="Search" circle />
            </template>
          </el-table-column>
        </el-table>
        <div class="example-pagination-block">
          <el-pagination layout="prev, pager, next"
            :current-page="state.page"
            :page-sizes="state.pageSizes"  :page-size="state.limit" :total="state.total" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
        </div>
      </el-tab-pane>

    </el-tabs>
  </el-card>
</template>

<script lang="ts" setup>
import {onMounted, ref, reactive} from "vue";
import type { TabsPaneContext } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { router } from "@/router";
import OrdersDetail from "@/components/Orders/Hotel/OrdersDetail.vue";
import {getOrdersUrl} from "@/api/business/business";
import { IHooksOptions } from "@/hooks/interface";
import { useCrud } from "@/hooks";

const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const  state: IHooksOptions = reactive ({
  dataListUrl:getOrdersUrl,
  deleteUrl:'',
  queryForm:{
    id:'',
    customerName:'',
  },
  dataList:[],
  dataListSelections: []
})
const ordersDetail = (id:number) => {
  router.push({path:'/business/Orders/Hotel/OrdersHotel/OrdersDetail/'+id})
}
const LinkTest =() =>{
  router.push({path:'/business/Order/Hotel/'})
}
const Reload =() =>{
  location.reload()
}

const selectionChangeHandle = (val: any) => {
  state.dataListSelections = val
}


const {getDataList,sizeChangeHandle,currentChangeHandle} = useCrud(state)

onMounted(()=>{
   //getDataList()
})

</script>

<style scoped>
.button{
  display: flex;
  justify-content: flex-end;
}
.example-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>