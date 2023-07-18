<template>
  <el-card>
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="state.queryForm.studentName" placeholder="学生姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.queryForm.lessonName" placeholder="课堂名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="state.queryForm.status" clearable placeholder="选择是否已安排试听">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">试听课程列表</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" >
      <el-table-column prop="studentName" label="学生" header-align="center" align="center"></el-table-column>
      <el-table-column prop="lessonName" label="试听课堂" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.lessonName === null">暂无</span>
          <span v-else>{{scope.row.lessonName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dateTime" label="安排时间" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.dateTime === null">暂无</span>
          <span v-else>{{scope.row.dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="试听备注" header-align="center" align="center" show-overflow-tooltip>
        <template #default="scope">
          <span v-if="scope.row.remarks === null">暂无</span>
          <span v-else>{{scope.row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status ===0" type="info">未安排</el-tag>
          <el-tag v-else-if="scope.row.status ===1" type="warning">已安排</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success" size="large">已试听</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template #default="scope">
          <el-button v-if="scope.row.status == 0" type="text" @click="addLessonHandle(scope.row)">加入试听课</el-button>
          <el-button v-else type="text" @click="gotoLesson(scope.row.lessonId)">详情</el-button>
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
  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
  <join-lesson ref="joinLesson" @refreshDataList="getDataList"></join-lesson>
</template>

<script setup lang="ts" name="TeachAuditionRecordIndex">
import { useCrud } from '@/hooks'
import {onMounted, reactive, ref} from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from '@/views/teach/audition-record/add-or-update.vue'
import JoinLesson from '@/views/teach/audition-record/join-lesson.vue'
import {dataListUrl,deleteUrl} from "@/api/teach/teachauditionrecord";
import {router} from "@/router";
import {useUserInfoApi} from "@/api/sys/user";

const options = ref([
  {
    value:1,
    label:'已安排'
  },
  {
    value:0,
    label:'未安排'
  },
  {
    value:2,
    label:'已试听'
  },
])

const state: IHooksOptions = reactive({
  dataListUrl: dataListUrl,
  deleteUrl: deleteUrl,
  queryForm: {
    studentName: '',
    lessonName: '',
    status: '',
    orgId:''
  }
})
const getOrgId = async () =>{
  const {data:data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  getDataList()
}
const joinLesson = ref()
const addLessonHandle = (item?: any) => {
  joinLesson.value.init(item)
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id)
}

const gotoLesson = (id:number) => {
  router.push({ path: '/classroom/tea-lesson/' + id })
}
onMounted(()=>{
  getOrgId()
})
const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)

</script>
