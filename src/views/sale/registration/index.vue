<template>
  <el-card>
    <el-form>
      <el-row>
        <el-form-item prop="stuName">
          <el-input v-model="state.queryForm.stuName" placeholder="学生姓名" clearable style="width: 216px"/>
        </el-form-item>
        <el-col :span="2"></el-col>
        <el-form-item>
          <el-select v-model="state.queryForm.eventsId" class="m-2" placeholder="活动">
            <el-option
                v-for="item in selectList.activeList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-col :span="2"></el-col>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.registerBeginTime"
                  type="date"
                  placeholder="报名开始时间"
              />
            </div>
          </div>
        </el-form-item>
        <el-col :span="2"></el-col>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.registerEndTime"
                  type="date"
                  placeholder="报名结束时间"
              />
            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-select v-model="state.queryForm.status" class="m-2" placeholder="状态">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-col :span="2"></el-col>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.communicateBeginTime"
                  type="date"
                  placeholder="最后沟通开始时间"
              />
            </div>
          </div>
        </el-form-item>
        <el-col :span="2"></el-col>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="state.queryForm.communicateEndTime"
                  type="date"
                  placeholder="最后沟通结束时间"
              />
            </div>
          </div>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-radio-group v-model="state.queryForm.sort" @change="getDataList">
            <el-radio :label="0" style="font-weight: bold">报名时间</el-radio>
            <el-radio :label="1" style="font-weight: bold">上次沟通时间</el-radio>
            <el-radio :label="2" style="font-weight: bold">状态</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-col :span="14">
        </el-col>
        <el-form-item>
          <el-button type="primary" @click="getDataList">搜索</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
  <el-card style="margin-top: 4px">
    <div style="float: right;margin-bottom: 14px">
      <el-row class="mb-4">
        <el-button type="primary" plain @click="parentRegisterRefHandle">家长报名</el-button>
        <el-button type="primary" plain @click="downloadStudentTemplate">模板下载</el-button>
        <el-button type="primary" plain @click="multiImportHandle">批量导入</el-button>
        <el-button type="primary" plain @click="abandonRefHandle">归档</el-button>
      </el-row>
    </div>
    <el-table
        ref="multipleTableRef"
        v-loading="state.dataListLoading"
        :data="state.dataList"
        border
        @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection"/>
      <el-table-column prop="stuNumber" label="编号" header-align="center" align="center" width="130"></el-table-column>
      <el-table-column prop="name" label="姓名" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column prop="events" label="活动名称" header-align="center" align="center"
                       width="200"></el-table-column>
      <el-table-column
          prop="enrollTime"
          label="报名时间"
          header-align="center"
          align="center"
          :formatter="gridDateFormatter"
          width="200"
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
      <el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info" size="large">线索</el-tag>
          <el-tag v-if="scope.row.status === 1" type="primary" size="large">已分配</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success" size="large">已沟通</el-tag>
          <el-tag v-if="scope.row.status === 3" type="warning" size="large">待试听</el-tag>
          <el-tag v-if="scope.row.status === 4" type="danger" size="large">已试听</el-tag>
          <el-tag v-if="scope.row.status === 5" type="primary" effect="light" size="large">待缴费</el-tag>
          <el-tag v-if="scope.row.status === 6" type="success" effect="light" size="large">已缴费</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="communicate(scope.row.enrollId)">沟通</el-button>
          <el-button link type="primary" @click="detailsHandle(scope.row.enrollId)">详情</el-button>
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
  <MultiImport ref="multiImportRef" @refreshDataList="getDataList"></MultiImport>
  <Abandon ref="abandonRef" @refreshDataList="getDataList"></Abandon>
</template>

<script setup lang="ts">
import {IHooksOptions} from "@/hooks/interface";
import {onMounted, reactive, ref} from "vue";
import {router} from "@/router";
import MultiImport from './multiImport.vue'
import {useCrud} from "@/hooks";
import { getEnrollStudentUrl, useGetEventsApi} from "@/api/sale/enroll/enroll";
import Abandon from "./abandon.vue"
import store from "@/store";
import {downloadStudentTemplateApi} from "@/api/file/file";

const parentRegisterRefHandle = () => {
  router.push('/parentsRegister')
}
const detailsHandle = (id:number) => {
  router.push({path:'/details/'+id})
}
const communicate = (id:number) => {
  router.push({path:'/communicate/'+id})
}

const multiImportRef = ref()
const multiImportHandle = () => {
  multiImportRef.value.init()
}

const abandonRef = ref()
const abandonRefHandle = () => {
  abandonRef.value.init(state.dataListSelections)
}
const downloadStudentTemplate = () => {
  downloadStudentTemplateApi()
}
const state: IHooksOptions = reactive({
  dataListUrl: getEnrollStudentUrl,
  deleteUrl: '',
  queryForm: {
    stuName: '',
    eventsId: '',
    saleId: store.userStore.user.id,
    registerBeginTime: '',
    registerEndTime: '',
    status: '',
    communicateBeginTime: '',
    communicateEndTime: '',
    sort: ''
  },
  dataList: [],
  dataListSelections: []
})

const selectList = reactive(
  {
    activeList:[],
  }
)

const options = [
  {
    value: 0,
    label: '线索阶段'
  },
  {
    value: 1,
    label: '已分配阶段'
  },
  {
    value: 2,
    label: '已沟通阶段'
  },
  {
    value: 3,
    label: '待试听阶段'
  },
  {
    value: 4,
    label: '已试听阶段'
  },
  {
    value: 5,
    label: '待缴费阶段'
  },
  {
    value: 6,
    label: '已缴费阶段'
  },
]
const reset = () => {
  state.queryForm = {}
  state.queryForm.saleId = store.userStore.user.id
  getDataList()
}

const selectionChangeHandle = (val: any) => {
  state.dataListSelections = val
}

const getEvents = () =>{
  useGetEventsApi().then(res => {
    selectList.activeList = res.data
    console.log(selectList.activeList);
  })
  //给events赋值
}

const {getDataList,sizeChangeHandle,currentChangeHandle} = useCrud(state)

onMounted(() => {
  getEvents()
  getDataList()
})

</script>

<style scoped></style>
