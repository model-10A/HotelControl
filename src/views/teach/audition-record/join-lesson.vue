<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" width="70%">
    <el-card>
      <el-button-group>
        <el-button size="large" :type="buttonFlag === 1 ? 'primary' : ''" :icon="EditPen" @click="buttonFlag = 1">未结束的试听课堂</el-button>
        <el-button size="large" :type="buttonFlag === 2 ? 'primary' : ''" :icon="Bell" @click="buttonFlag = 2">进行中的课堂 </el-button>
      </el-button-group>
      <br />
      <el-divider />
      <div v-if="buttonFlag === 1">
        <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
          <el-table-column prop="teacherName" label="任课老师" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
          <el-table-column prop="name" label="课程名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="planItemName" label="教学日历名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
          <el-table-column prop="beginTime" label="开课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" label="结课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
            <template #default="scope">
              <el-button type="text" size="small" @click="addHandle(scope.row.id)">加入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :current-page="state.pageIndex"
            :page-sizes="state.pageSizes"
            :page-size="state.pageSize"
            :total="state.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
        >
        </el-pagination>
      </div>
      <div v-else>
        <el-table v-loading="state2.dataListLoading" :data="state2.dataList" border style="width: 100%">
          <el-table-column prop="teacherName" label="任课老师" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
          <el-table-column prop="name" label="课程名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="planItemName" label="教学日历名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
          <el-table-column prop="beginTime" label="开课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" label="结课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
            <template #default="scope">
              <el-button type="text" size="small" @click="addHandle(scope.row.id)">加入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            :current-page="state2.pageIndex"
            :page-sizes="state2.pageSizes"
            :page-size="state2.pageSize"
            :total="state2.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="useCrud(state2).sizeChangeHandle"
            @current-change="useCrud(state2).currentChangeHandle"
        >
        </el-pagination>
      </div>
    </el-card>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { dataListPageUrl,deleteUrl,afootLessonPageUrl} from '@/api/lessons/lesson'
import { ElMessage } from 'element-plus'
import { EditPen, Bell } from '@element-plus/icons-vue'
import {userJoinAuditionLessonApi} from "@/api/teach/teachauditionrecord";
import moment from "moment";
import {useUserInfoApi} from "@/api/sys/user";
import {onMounted} from "_vue@3.2.37@vue";
const emit = defineEmits(['refreshDataList'])
const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const visible = ref(false)
const buttonFlag = ref(1)
const state: IHooksOptions = reactive({
  dataListUrl: dataListPageUrl,
  createdIsNeed:false,
  queryForm: {
    classId: 0,
    date:nowDate,
    orgId:''
  }
})

const state2: IHooksOptions = reactive({
  dataListUrl: afootLessonPageUrl,
  createdIsNeed:false,
  queryForm: {
    date:nowDate,
    orgId:''
  }
})
const data = reactive({
  lessonId: '',
  studentId: '',
  status:1,
  dateTime:'',
})
const init = (item?: any) => {
  getOrgId()
  getDataList()
  useCrud(state2).getDataList()
  visible.value = true
  Object.assign(data,item)
  console.log(data)
}
const getOrgId = async () =>{
  const {data:data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  state2.queryForm.orgId = data.orgId
}

const addHandle = (id: any) => {
  data.lessonId = id
  data.status = 1
  data.dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  console.log(data)
  userJoinAuditionLessonApi(data).then(res => {
    ElMessage.success({
      message: '操作成功',
      duration: 500,
      onClose: () => {
        visible.value = false
        emit('refreshDataList')
      }
    })
  })
}
const dataRules = ref({})

defineExpose({
  init
})

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)
</script>
