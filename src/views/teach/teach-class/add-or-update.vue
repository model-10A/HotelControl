<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false">
    <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="150px" @keyup.enter="submitHandle()">
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
      </el-form-item>
      <el-form-item label="班级介绍" prop="description">
        <el-input v-model="dataForm.description" placeholder="班级介绍"></el-input>
      </el-form-item>
<!--      <el-form-item label="班级封面" prop="img">-->
<!--        <el-input v-model="dataForm.img" placeholder="班级封面"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="图片" prop="img">
        <fast-upload-img v-model="dataForm.img" img-width="100px"></fast-upload-img>
      </el-form-item>
      <el-form-item label="引用教学计划" prop="planName">
        <el-input v-model="dataForm.planName" placeholder="引用教学计划" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="上课时间" prop="lessonIme">
        <el-time-picker
            v-model="lessonTime"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="总课时" prop="lessonNum">
            <el-input-number v-model="dataForm.lessonNum" :precision="0" :step="1" :min="0" :disabled="true"/>
            <span style="padding-left: 20px; font-size: 15px">(课时)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="周频" prop="frequency">
            <el-input-number v-model="dataForm.frequency" :precision="0" :step="1" :min="0" :max="7" :disabled="true"/>
            <span style="padding-left: 20px; font-size: 15px">周频(0-7)</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="班级状态" prop="status">
        <template #default="scope">
          <el-tag v-if="dataForm.status == 0" type="danger">未发布</el-tag>
          <el-tag v-else-if="dataForm.status == 1" type="danger">未开班</el-tag>
          <el-tag v-else-if="dataForm.status == 2" type="success">开班中</el-tag>
          <el-tag v-else type="danger">结班</el-tag>
        </template>
      </el-form-item>
      <el-form-item label="班级开始结束时间" prop="beTime">
        <el-date-picker
            v-model="classTime"
            type="daterange"
            range-separator="至"
            start-placeholder="班级预计开始时间"
            end-placeholder="班级预计结束时间"
            value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="班主任" prop="teacher1Name">
        <el-select v-model="dataForm.teacher1Name" placeholder="班主任" @change="selectChange1(dataForm.teacher1Name)">
          <el-option v-for="(item, index) in options" :key="index" :label="item.realName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="任课老师" prop="teacher2Name">
        <el-select v-model="dataForm.teacher2Name" placeholder="任课老师" @change="selectChange2(dataForm.teacher2Name)">
          <el-option v-for="(item, index) in teachers" :key="index" :label="item.realName" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { ElMessage } from 'element-plus/es'
import FastUploadImg from '@/components/fast-upload-img/fast-upload-img.vue'
import { useTeachClassApi, useTeachClassSubmitApi } from '@/api/teach/class'
import moment from "moment";
import {useSelectTeacherApi} from "@/api/teach/teacher";

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
const lessonTime  =ref([])
const classTime = ref([])

const options: any[] = []
const teachers: any[] = []
onMounted(() => {
  selectTeacher1()
  selectTeacher2()
})

const selectTeacher1 = () => {
  useSelectTeacherApi().then(res => {
    Object.assign(options, res.data)
    console.log(res.data)
  })
}
const selectTeacher2 = () => {
  useSelectTeacherApi().then(res => {
    Object.assign(teachers, res.data)
    console.log(res.data)
  })
}

const dataForm = reactive({
  id: '',
  name: '',
  description: '',
  img: '',
  planName:'',
  planId: '',
  lessonNum: '',
  lessonIme: '',
  frequency: '',
  status: '',
  lessonBeginTime:'',
  lessonEndTime:'',
  teacher1Name:'',
  teacher2Name:'',
  beginTime: '',
  endTime: '',
  teacher1Id: '',
  teacher2Id: '',
  nextLesson: '',
  createTime: '',
  updateTime: '',
  deleted: '',
  updater: '',
  creator: '',
  version: ''
})

const init = (id?: number) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (id) {
    getTeachClass(id)
  }
}

const selectChange1 = (valueTeacher1: any) => {
  console.log(valueTeacher1)
  dataForm.teacher1Id = valueTeacher1
}

const selectChange2 = (valueTeacher2: any) => {
  console.log(valueTeacher2)
  dataForm.teacher2Id = valueTeacher2
}

const getTeachClass = (id: number) => {
  useTeachClassApi(id).then(res => {
    Object.assign(dataForm, res.data)
    lessonTime.value[0]=dataForm.lessonBeginTime
    lessonTime.value[1]=dataForm.lessonEndTime
    classTime.value[0]=dataForm.beginTime
    classTime.value[1]=dataForm.endTime
  })
}

const dataRules = ref({
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  planId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  lessonNum: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  lessonTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  frequency: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  classTime: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  teacher1Id: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  teacher2Id: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})


// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    dataForm.lessonBeginTime=lessonTime.value[0]
    dataForm.lessonEndTime=lessonTime.value[1]
    console.log(lessonTime)
    console.log(classTime)
    dataForm.beginTime=classTime.value[0]
    dataForm.endTime=classTime.value[1]
    console.log(dataForm)
    useTeachClassSubmitApi(dataForm).then(() => {
      ElMessage.success({
        message: '操作成功',
        duration: 500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
        }
      })
    })
  })
}

defineExpose({
  init
})
</script>
