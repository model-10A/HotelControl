<template>
  <el-card>
    <el-tabs v-model="HotelsList" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="酒店管理" name="first">
        <el-row>
          <el-form>
            <el-form-item>
              <el-input v-model="state.queryForm.name" placeholder="请输入酒店名称" style="width: 380px;" clearable />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="getDataList">查询</el-button>
          <el-col :span="16"></el-col>
          <el-button type="primary" @click="addNew()" >新增</el-button>
        </el-row>
        <el-table v-loading="state.dataListLoading" :data="state.dataList" @selection-change="selectionChangeHandle" style="width: 100%">
          <el-table-column prop="no" label="编号" header-align="center" align="center" width="350"></el-table-column>
          <el-table-column prop="name" label="酒店名称" header-align="left" align="left" width="900"></el-table-column>
          <el-table-column prop="action" label="操作" header-align="center" align="center" width="150">
            <template #default="scope">
              <el-button type="primary" @click="updateHotel(scope.row.id)" :icon="Edit" circle />
            </template>
          </el-table-column>
          <el-table-column prop="action" label="房型管理" header-align="center" align="center" width="150">
            <template #default="scope">
              <el-button type="primary" @click="goToRoomList(scope.row.id)" :icon="Plus" circle />
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts" setup>
import {
  Edit,
  Plus
} from '@element-plus/icons-vue'
import {IHooksOptions} from "@/hooks/interface";
import { onMounted, reactive, ref } from "vue";
import type { TabsPaneContext } from 'element-plus'
import {router} from "@/router";
import store from "@/store";
import { getHotelProductsUrl, getRoomProductsUrl, useGetHotelInfoApi } from "@/api/business/business";
import { useCrud } from "@/hooks";

const HotelsList = ref('first')

const state: IHooksOptions = reactive({
  dataListUrl: getHotelProductsUrl,
  deleteUrl: '',
  queryForm: {
    name: '',
  },
  dataList: [],
  dataListSelections: []
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const selectionChangeHandle = (val: any) => {
  state.dataListSelections = val
}

const addNew = () =>{
  router.push('/business/Products/Hotel/ProductsHotel/addNewHotel')
}
const updateHotel = (id:number) => {
  router.push({path:'/business/Products/Hotel/ProductsHotel/updateHotel/'+id})
}
const goToRoomList = (id:number) => {
  router.push({path:'/business/Products/Hotel/ProductsRoom/'+id})
}

const getHotelInfo = (id:any) => {
  useGetHotelInfoApi(id).then(res=>{

    console.log(state.dataList);
  })
}


const {getDataList,sizeChangeHandle,currentChangeHandle} = useCrud(state)

onMounted(()=>{
   getHotelInfo()
})

</script>

<style scoped>
</style>