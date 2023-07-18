<template>
  <el-card v-loading="state.loading">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="已发布课程" name="1">
        <el-table v-loading="state.dataListLoading" :data="state.dataLessonList" border style="max-height: 60vh; overflow: auto">
          <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
          <el-table-column prop="beginTime" label="开始时间" header-align="center" align="center" width="250"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="250"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <br />
    <el-table v-loading="state.dataListLoading" :data="state.dataPlanList" border style="width: 100%">
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="description" label="说明" show-overflow-tooltip header-align="center" align="center"></el-table-column>
      <el-table-column prop="sort" label="子项顺序" header-align="center" align="center"></el-table-column>
      <el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
      <el-table-column prop="duration" label="时长（分钟）" header-align="center" align="center"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" header-align="center" align="center" width="250">
        <template #default="scope">
          <el-date-picker
              v-if="scope.row.isEdit1"
              v-model="scope.row.beginTime"
              type="datetime"
              :clearable="false"
              placeholder="开始时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="item"
              @blur="scope.row.isEdit1 = false"
          ></el-date-picker>
          <div v-else class="txt" @click="scope.row.isEdit1 = true">{{ scope.row.beginTime }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="250">
        <template #default="scope">
          <el-date-picker
              v-if="scope.row.isEdit2"
              v-model="scope.row.endTime"
              type="datetime"
              :clearable="false"
              placeholder="结束时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              class="item"
              @blur="scope.row.isEdit2 = false"
          ></el-date-picker>
          <div v-else class="txt" @click="scope.row.isEdit2 = true">{{ scope.row.endTime }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="300">
        <template #default="scope">
          <el-button type="text" size="small" @click="editPaper(scope.row.planItemId)">试卷详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    试卷管理弹窗-->
    <item-paper-saw ref="editPaperRef"></item-paper-saw>
    <el-form style="margin-left: 95%; margin-top: 30px">
      <el-form-item>
        <el-button type="primary" @click="addLesson()">发布</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLessonByIdApi} from '@/api/lessons/lesson'
import { useTeachPlanApi } from '@/api/teach/teachplan'
import { useTeachClassApi, useTeachClassSubmitApi } from '@/api/teach/class'
import service from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createLessonsApi } from '@/api/lessons/lesson'
import { dataListUrl, deleteUrl } from '@/api/teach/teachplanitem'
import ItemPaperSaw from '@/views/teach/teach-class/item-paper-saw.vue'
import { router } from '@/router'
import moment from "moment/moment";
const state = reactive({
  loading: false,
  lessonNum:'',
  dataListSelections: [],
  dataListLoading: false,
  dataListUrl: dataListUrl,
  deleteUrl: deleteUrl,
  planId: '',
  dataPlanList: [
    {
      teacherId: '',
      beginTime: '0000-00-00 00:00:00',
      endTime: '0000-00-00 00:00:00',
      teacher1Name: '',
      teacher2Name: '',
      planItemId: '',
      classId: '',
      place: '',
      id: '',
      isEdit1: false,
      isEdit2: false
    }
  ],
  dataClass: {
    teacher1Id: '',
    teacher2Id: '',
    beginTime: '',
    endTime: '',
    lessonBeginTime: '',
    lessonEndTime: '',
    teacher1Name: '',
    teacher2Name: '',
    frequency: 0,
    place: '',
    classId: ''
  },
  dataLessonList: [
    {
      index:'',
      teacherId: '',
      beginTime: '0000-00-00 00:00:00',
      endTime: '0000-00-00 00:00:00',
      teacher1Name: '',
      teacher2Name: '',
      planItemId: '',
      classId: '',
      place: '',
      id: ''
    }
  ]
})

const route = useRoute()
const planId: any = ref('')
let planName: any = ref('')
const classId: any = ref('')
onMounted(() => {
  classId.value = route.path.split('/').pop()
  getClass(classId.value)
  state.planId = planId.value
})
const editPaperRef = ref()
const editPaper = (id?: number) => {
  editPaperRef.value.init(id)
}

const editResourceRef = ref()


const updateItemRef = ref()
// const updateHandle = (planId: number, id?: number) => {
//   updateItemRef.value.init(planId, id)
// }

// const getSyncLesson = () =>{
//   useLessonByIdApi(classId.value).then(res=>{
//     state.dataLessonList=res.data
//   })
// }
const getList=()=>{
  state.dataListLoading = true
  useLessonByIdApi(classId.value).then(res=>{
    state.dataLessonList=res.data
    console.log(state.dataLessonList)
  }).finally(()=>{
    service.get(state.dataListUrl + state.planId).then((res: any) => {
      let list = res.data
      state.lessonNum=res.data.length
      console.log(state.lessonNum)
      state.dataPlanList=list.filter((item:any)=>{
        let flag=true;
        for (let i=0;i<state.dataLessonList.length;i++){
          if(state.dataLessonList[i].planItemId===item.id){
            flag=false;
            break
          }
        }
        return flag;
      })
      console.log(state.dataPlanList)
      let frequency = state.dataClass.frequency

      let data1 = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let data2 = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      if(state.dataLessonList.length>0) {
        data1 = state.dataLessonList[state.dataLessonList.length - 1].beginTime
        data2 = state.dataLessonList[state.dataLessonList.length - 1].endTime
      }
      for (let i = 0; i < state.dataPlanList.length; i++) {
        state.dataPlanList[i].teacherId = state.dataClass.teacher2Id
        state.dataPlanList[i].teacher1Name = state.dataClass.teacher1Name
        state.dataPlanList[i].teacher2Name = state.dataClass.teacher2Name
        state.dataPlanList[i].classId = classId.value
        state.dataPlanList[i].planItemId = state.dataPlanList[i].id
        state.dataPlanList[i].place = state.dataClass.place
        state.dataPlanList[i].id = ''
        console.log(frequency)
        if (frequency != 0) {
          data1 = moment(data1).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
          data2 = moment(data2).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        state.dataPlanList[i].beginTime = data1
        state.dataPlanList[i].endTime = data2
      }
    })
  }).finally(()=>{
    state.dataListLoading = false
  })
}
const getClass = (id: number) => {
  console.log(id)
  useTeachClassApi(id)
      .then(res => {
        console.log('0000000')
        state.dataClass = res.data
        state.planId = res.data.planId
        planId.value = res.data.planId
        console.log(res.data)
      })
      .finally(() => {
        getList()
      })
}

const activeNames = ref('')

const addLesson = () => {
  state.loading = true
  console.log(state.dataPlanList)
  createLessonsApi(state.dataPlanList)
      .then(res => {
        ElMessage.success({
          message: '操作成功',
          duration: 500
        })
      })
      .finally(() => {
        useTeachClassSubmitApi({ id: classId.value, status: 2 ,lessonNum: state.lessonNum}).then(res => {
          state.loading = false
          router.push({ path: '/teachClass' })
        })
      })
}
</script>
