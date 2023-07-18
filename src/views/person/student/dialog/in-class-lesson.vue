<template>
  <el-dialog v-model="visible" width="60%"  title="课程选择" :close-on-click-modal="false">
    <el-table v-loading="state.dataListLoading" ref="tableRef" :data="state.dataList" @selection-change="selectionChangeHandle" border row-key="id" style="max-height: 60vh; overflow: auto">
      <el-table-column type="selection" header-align="center" align="center" :reserve-selection="true" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
      <el-table-column prop="beginTime" label="开始时间" header-align="center" align="center" width="250"></el-table-column>
      <el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="250"></el-table-column>
      <el-table-column align="center" header-align="center" label="课堂状态" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.beginTime > Time">未开启</el-tag>
          <el-tag v-else-if="scope.row.beginTime <= Time && scope.row.endTime >= Time" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.endTime < Time" type="info">已结束</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import moment from "moment";
const tableRef = ref<InstanceType<typeof ElTable>>()
const emit = defineEmits(['close'])
import {useTeachClassRecordApi, useTeachClassUserSubmitApi} from '@/api/teach/classuser'
import {useTeachPaySubmitApi} from '@/api/teach/teachpay'
import {useLessonStudentApi} from '@/api/lessons/attendlog'
import {reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLessonByIdApi,updateList } from '@/api/lessons/lesson'
import {ElMessage, ElTable} from "element-plus";
import {number} from "echarts";
import {joinClassAddClassHoursSubmitApi} from "@/api/teach/student";
let LessonStudentForm = reactive({
  classId:[],
  stuId:number
})
const state = reactive({
  currentRowIndex:'',
  loading: false,
  dataListSelections: [],
  dataListLoading: false,
  planId: '',
  selectionList: [
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
  ],
  dataList: [
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
let classId: any = ref('')
const visible = ref(false)
let classUserData = ref({})

let Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
const priceRules = ref({
  remarks: [{ required: true, message: '请填写备注', trigger: 'blur' }]
})
const init = (id:number,classUser:any,stuId:number) => {
  visible.value = true
  classId = id
  getLesson(classId)
  classUserData=classUser
  LessonStudentForm.stuId=stuId
  state.selectionList.length = 0
  tableRef.value!.clearSelection()
  console.log(classUserData)
}
const selectionChangeHandle = (selections: any[]) => {
  console.log(selections)
  state.selectionList=selections
  for(let i=0;i<state.selectionList.length;i++){
    //计算已选课的课时数
    if((new Date(state.selectionList[i].endTime)).valueOf() >= new Date().valueOf()){
      console.log((new Date(state.selectionList[i].endTime)).valueOf())
      console.log((new Date(state.selectionList[i].beginTime)).valueOf())
    }
  }


}
const getLesson = (classId: any) => {
  useLessonByIdApi(classId).then(res => {
    state.dataList = res.data
    console.log(state.dataList)
  })
}
const submitHandle = async() => {
  if(state.selectionList.length === 0){
    ElMessage.warning("请选择课程！")
  }else{
    console.log( state.dataList)
    LessonStudentForm.classId.length = 0
    for(let i=0;i<state.selectionList.length;i++){
      LessonStudentForm.classId.push(state.selectionList[i].id)
    }
    let userData = {
      userId:classUserData.userId,
      joinClassId:classUserData.classId,
      joinLessonList:LessonStudentForm.classId,
      joinTime:Time,
      type:1,
    }
    console.log(userData)
    await useTeachClassUserSubmitApi(userData)
    ElMessage.success({
      message: '插班成功',
      duration: 500,
      onClose: () => {
        visible.value = false
        emit('close')
      }
    })
  }
}

defineExpose({
  init
})
</script>
