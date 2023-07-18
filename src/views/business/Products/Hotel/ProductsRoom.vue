<template>
  <el-card>
    <el-tabs v-model="RoomList" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="房型管理" name="first">
        <el-row justify="end">
          <span>{{ state.dataList.name }}</span>
          <el-button type="primary" @click="addNewRoom(route.params.id)" style=" text-align:right;">新增</el-button>
        </el-row>
        <el-table v-loading="state.dataListLoading" :data="state.dataList" @selection-change="selectionChangeHandle" style="width: 100%">
          <el-table-column prop="id" label="编号" header-align="center" align="center" width="280"></el-table-column>
          <el-table-column prop="roomType" label="房型名称" header-align="left" align="left" width="550"></el-table-column>
          <el-table-column prop="roomSize" label="房型面积" header-align="center" align="center" width="200"></el-table-column>
          <el-table-column prop="price" label="报价" header-align="center" align="center" width="200"></el-table-column>
          <el-table-column prop="roomRemark" label="房型备注" header-align="center" align="center" width="200"></el-table-column>
          <el-table-column prop="action" label="编辑" header-align="center" align="center" width="100">
            <template #default="scope">
              <el-button type="primary" @click="updateRoom(scope.row.id)" :icon="Edit" circle />
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
  Edit
} from '@element-plus/icons-vue'
import {IHooksOptions} from "@/hooks/interface";
import { onMounted, reactive, ref } from "vue";
import type { TabsPaneContext } from 'element-plus'
import {router} from "@/router";
import store from "@/store";
import { getRoomProductsUrl, useGetHotelInfoApi } from "@/api/business/business";
import { useCrud } from "@/hooks";
import {useRoute} from "vue-router";



const RoomList = ref('first')
const route = useRoute()
const state: IHooksOptions = reactive({
  dataListUrl: getRoomProductsUrl,
  deleteUrl: '',
  queryForm: {
    hotelId: route.params.id,
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

const updateRoom = (id:number) => {
  router.push({path:'/business/Products/Hotel/ProductsHotel/updateRoom/'+id})
}

const addNewRoom = (id:number) => {
  router.push({ path:'/business/Products/Hotel/ProductsHotel/addNewRoom/' +id})
}


const {getDataList,sizeChangeHandle,currentChangeHandle} = useCrud(state)

onMounted(()=>{
})

</script>

<style scoped>
</style>