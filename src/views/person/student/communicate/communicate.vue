<template>
  <el-drawer v-model="visible" :title=" '沟通' " size="50%" :close-on-click-modal="false">
    <el-button type="primary" style="margin-left: 15px;margin-bottom: 10px;" @click="studentInfoHandle">学生情况</el-button>
    <el-form ref="dataFormRef" :model="dataForm"  :rules="dataRules" label-width="100px" @keyup.enter="submitHandle()">
      <el-form-item label="沟通对象" prop="target">
        <el-input v-model="dataForm.target" placeholder="沟通对象"></el-input>
      </el-form-item>
      <el-form-item label="沟通时间" prop="time">
        <el-date-picker type="datetime" placeholder="沟通时间" format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.time" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="沟通主题" prop="theme">
        <el-input v-model="dataForm.theme" placeholder="沟通主题"></el-input>
      </el-form-item>
      <el-form-item label="沟通内容" prop="content">
        <el-input type="textarea" placeholder="沟通内容" v-model="dataForm.content"></el-input>
      </el-form-item>
    </el-form>
    <el-alert :closable="false" style="margin-bottom: 25px" type="info">
      <h1 slot="title" style="color: #242424">沟通记录</h1>
    </el-alert>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%" >
      <el-table-column prop="studentName" label="学生" header-align="center" align="center"></el-table-column>
      <el-table-column prop="teacherName" label="教务老师" header-align="center" align="center"></el-table-column>
      <el-table-column prop="target" label="沟通对象" header-align="center" align="center"></el-table-column>
      <el-table-column prop="time" label="沟通时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="theme" label="沟通主题" header-align="center" align="center"></el-table-column>
      <el-table-column prop="content" label="沟通内容" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
    <student-info ref="studentInfoRef"></student-info>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es'
import {dataListUrl, deleteUrl, useTeachCommunicateRecordSubmitApi} from '@/api/teach/teachcommunicaterecord.ts'
import StudentInfo from "@/views/person/student/communicate/studentInfo.vue";
import store from "@/store";
import moment from "moment";
import {IHooksOptions} from "@/hooks/interface";
import {useCrud} from "@/hooks";
const visible = ref(false)
const dataFormRef = ref()

const state: IHooksOptions = reactive({
  dataListUrl: dataListUrl,
  createdIsNeed:false,
  deleteUrl: deleteUrl,
  queryForm: {
    studentId:0,
  }
})

const dataForm = reactive({
  id: '',
  teacherId: '',
  studentId: 0,
  target: '',
  time: '',
  theme: '',
  content: '',
  createTime: '',
  updateTime: '',
  creator: '',
  updater: '',
  deleted: '',
  version: '',
})

const init = (id: number) => {
  visible.value = true
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  dataForm.studentId = id
  dataForm.teacherId = store.userStore.user.id
  dataForm.time =moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  state.queryForm.studentId = id
  getDataList()
}

const studentInfoRef = ref()
const studentInfoHandle = () => {
  studentInfoRef.value.init(dataForm.studentId)
}

const dataRules = ref({
  target: [{required: true, message: '请填写沟通对象', trigger: 'blur'}],
  time: [{required: true, message: '请选择沟通时间', trigger: 'blur'}],
  theme: [{required: true, message: '请填写沟通主题', trigger: 'blur'}],
  content: [{required: true, message: '请填写沟通内容', trigger: 'blur'}],
})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    useTeachCommunicateRecordSubmitApi(dataForm).then(() => {
      ElMessage.success({
        message: '操作成功',
        duration: 500,
        onClose: () => {
          visible.value = false
        }
      })
    })
  })
}

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)
defineExpose({
  init
})
</script>
