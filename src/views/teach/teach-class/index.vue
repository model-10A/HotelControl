<template>
  <el-card>
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="state.queryForm.name" placeholder="班级名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.queryForm.planName" placeholder="引用教学计划" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.queryForm.teacher2Name" placeholder="任课老师" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary">
      <router-link to="/addClass">创建班级</router-link>
    </el-button>
    <!--    <el-button type="danger" @click="deleteBatchHandle()">删除</el-button>-->

    <el-table
        v-loading="state.dataListLoading"
        :data="state.dataList"
        border
        style="width: 100%; margin-top: 15px"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="expandSelect"
    >
      <el-table-column type="expand" label="展开" width="80">
        <template #default="props">
          <el-table
              style="width: 90%; margin: auto"
              max-height="400"
              :data="state2.dataList"
              border
          >
            <el-table-column align="center" header-align="center" label="课堂名称" prop="name"></el-table-column>
            <el-table-column align="center" header-align="center" label="任课老师" prop="teacherName"></el-table-column>
            <el-table-column align="center" header-align="center" label="上课地点" prop="place"></el-table-column>
            <el-table-column align="center" header-align="center" label="预计开课时间" prop="beginTime" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" header-align="center" label="预计结课时间" prop="endTime" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" header-align="center" label="课堂状态" prop="status">
              <template #default="scope">
                <el-tag v-if="scope.row.beginTime > nowDate">未开启</el-tag>
                <el-tag v-else-if="scope.row.beginTime <= nowDate && scope.row.endTime >= nowDate" type="success">进行中</el-tag>
                <el-tag v-else-if="scope.row.endTime < nowDate" type="info">已结束</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" header-align="center" label="操作" prop="status" width="300">
              <template #default="scope">
                <el-button type="primary" @click="gotoLesson(scope.row.id)">详细情况</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              :current-page="state2.page"
              :page-size="state2.limit"
              :page-sizes="state2.pageSizes"
              :total="state2.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
          >
          </el-pagination>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="班级名称" header-align="center" align="center" width="130"></el-table-column>
      <el-table-column prop="description" label="班级介绍" header-align="center" align="center"></el-table-column>
      <el-table-column prop="planName" label="引用教学计划" header-align="center" align="center"
                       width="120"></el-table-column>
      <el-table-column prop="lessonNum" label="总课时" header-align="center" align="center" width="70"></el-table-column>
      <el-table-column prop="lessonBeginTime,lessonEndTime" label="上课时间范围" header-align="center" align="center"
                       width="150">
        <template #default="scope"> {{ scope.row.lessonBeginTime }}-{{ scope.row.lessonEndTime }}</template>
      </el-table-column>
      <el-table-column prop="frequency" label="周频" header-align="center" align="center" width="60"></el-table-column>
      <el-table-column prop="status" label="班级状态" header-align="center" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 0" type="danger">未发布</el-tag>
          <el-tag v-else-if="scope.row.status == 1" type="danger">未开班</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="success">开班中</el-tag>
          <el-tag v-else type="danger">结班</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime,endTime" label="班级预计时间范围" header-align="center" align="center" width="200">
        <template #default="scope"> {{ scope.row.beginTime }}~{{ scope.row.endTime }}</template>
      </el-table-column>
      <el-table-column prop="teacher1Name" label="班主任" header-align="center" align="center"
                       width="90"></el-table-column>
      <el-table-column prop="teacher2Name" label="任课老师" header-align="center" align="center"
                       width="90"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
        <template #default="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button type="primary" size="small" class="el-dropdown-link" link>更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="scope.row.status > 1" command="openStudent">学生详情</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status < 2" command="openClass">开班</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == 2" command="endLesson">调课</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == 2" command="endClass">结班</el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == 2" command="syncLesson">同步</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
    <student-saw ref="studentRef"></student-saw>
    <end-lesson ref="endLessonRef" v-model="frequency.value"></end-lesson>
  </el-card>
</template>

<script setup lang="ts" name="TeachClassIndex">
import {useCrud} from '@/hooks'
import {onMounted, reactive, ref} from 'vue'
import AddOrUpdate from './add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'
import {router} from '@/router'
import {dataListUrl, deleteUrl, useEndingClassApi} from '@/api/teach/class'
import StudentSaw from '@/views/teach/teach-class/student-saw.vue'
import {ElMessage} from 'element-plus'
import EndLesson from '@/views/teach/teach-class/dialog/endLesson.vue'
import {onBeforeMount} from "vue-demi";
import moment from "moment";
import {useProblemFinishApi} from "@/api/judge/lessonRecord";
import {useLessonHomeworkApi} from "@/api/lessons/problem";
import {dataAllLessonPageUrl} from "@/api/lessons/lesson";
import service from "@/utils/request";
import {useUserInfoApi} from "@/api/sys/user";

const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const state: IHooksOptions = reactive({
  dataListUrl: dataListUrl,
  deleteUrl: deleteUrl,
  queryForm: {
    name: '',
    planName: '',
    teacher2Name: '',
    orgId:''
  }
})
const getOrgId = async () =>{
  const{data:data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  getDataList()
}
const state2: IHooksOptions = reactive({
  dataListUrl: dataAllLessonPageUrl,
  createdIsNeed:false,
  queryForm: {
    classId: ''
  }
})
let haveClassTime = state.dataList
let frequency: any = ref('')
const classTime = ref(1)
const addOrUpdateRef = ref()
const endLessonRef = ref()
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id)
}

const studentRef = ref()
const handleCommand = (command: string, row: any) => {
  if (command === 'openClass') {
    console.log('我在开班')
    console.log(row)
    router.push({path: '/teach/startClass/' + row.id})
  } else if (command === 'endClass') {
    useEndingClassApi(row.id)
    getDataList()
  } else if (command === 'endLesson') {
    console.log(row)
    frequency.value = row.frequency
    console.log(frequency)
    endLessonRef.value.init(row)
  } else if (command === 'openStudent') {
    studentRef.value.init(row.id)
  } else {
    router.push({path: '/teach/syncLesson/' + row.id})
  }
}
const getRowKeys = (row: any) => {
  return row.id
}


const expands = ref()
const expandSelect = (row: any, expandedRows: any) => {
  console.log(row,expandedRows)
  if (expandedRows.length) {
    expands.value = []
    if (row) {
      expands.value.push(row.id)
      state2.queryForm.classId = row.id
      useCrud(state2).getDataList()
    } else {
      expands.value = []
    }
  }
}

const gotoLesson = (id: any) => {
  router.push({ path: '/teach/info-lesson/' + id })
}
onMounted(()=>{
  getOrgId()
})
const {getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle} = useCrud(state)
</script>

<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  line-height: normal;
  margin-left: 15px;
}
</style>
