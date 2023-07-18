<template>
  <el-dialog v-model="visible" :title="dataForm.status === 0 ? '销课' : '详情'" :close-on-click-modal="false" width="70%">
    <div style="margin-bottom: 20px;">
      <el-descriptions :column="3">
        <el-descriptions-item label="生成时间：">
          <span v-if="dataForm.createTime === null">暂无</span>
          <span v-else>{{ dataForm.createTime }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="学号：">{{ dataForm.studentNumber }}</el-descriptions-item>
        <el-descriptions-item label="姓名：">{{ dataForm.studentName }}</el-descriptions-item>
        <el-descriptions-item label="班级名：">{{ dataForm.className }}</el-descriptions-item>
        <el-descriptions-item label="课次：">{{ lessonForm.name }}</el-descriptions-item>
        <el-descriptions-item label="开始时间：">{{ lessonForm.beginTime }}</el-descriptions-item>
        <el-descriptions-item label="时长：">{{ dataForm.duration }}h</el-descriptions-item>
        <el-descriptions-item label="签到状态：">
          <el-tag v-show="dataForm.studentLessonStatus === -1" type="danger">未签到</el-tag>
          <el-tag v-show="dataForm.studentLessonStatus === 0" type="warning">请假</el-tag>
          <el-tag v-show="dataForm.studentLessonStatus === 1" type="success">签到</el-tag>
          <el-tag v-show="dataForm.studentLessonStatus === 2">迟到</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="教师：">{{ lessonForm.teacherName }}</el-descriptions-item>
        <el-descriptions-item label="课程类型：">
          <span v-if="dataForm.type == 0">常规课</span>
          <span v-else-if="dataForm.type == 1">集训课</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-row>
      <el-col :span="12">
        <div style="margin-left: 20px; width:400px;">
          <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" >
            <el-form-item label="实际扣课" prop="actualDeduction">
              <el-input-number v-model="dataForm.actualDeduction" :precision="1" :step="0.5" :min="0" :max="24" placeholder="实际扣时"
                               :disabled="dataForm.status != 0"></el-input-number>
              （h）
            </el-form-item>
            <el-form-item label="说明" prop="direction">
              <el-input v-model="dataForm.direction" placeholder="说明" type="textarea"
                        :disabled="dataForm.status != 0"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="9">
        <div v-if="dataForm.status === 0" >
          <el-descriptions  :column="1" border>
            <el-descriptions-item
                label="剩余常规课时"
                label-align="left"
                align="center"
                label-class-name="my-label"
                class-name="my-content"
                width="150px"
            >
              {{ userForm.normal }}
            </el-descriptions-item>
            <el-descriptions-item label="剩余常规赠送课时" label-align="left" align="center">{{ userForm.normalPresent }}</el-descriptions-item>
            <el-descriptions-item label="剩余集训课时" label-align="left" align="center">{{ userForm.training }}</el-descriptions-item>
            <el-descriptions-item label="剩余集训赠送课时" label-align="left" align="center">{{ userForm.trainingPresent }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-if="dataForm.status === 1">
          <el-descriptions  :column="1" border>
            <el-descriptions-item
                label="本次扣常规课时"
                label-align="left"
                align="center"
                label-class-name="my-label"
                class-name="my-content"
                width="200px"
            >
              {{ flowForm.normal }}
            </el-descriptions-item>
            <el-descriptions-item label="本次扣常规赠送课时" label-align="left" align="center">{{ flowForm.normalPresent }}</el-descriptions-item>
            <el-descriptions-item label="本次扣集训课时" label-align="left" align="center">{{ flowForm.training }}</el-descriptions-item>
            <el-descriptions-item label="本次扣集训赠送课时" label-align="left" align="center">{{ flowForm.trainingPresent }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>
    <template #footer v-if="dataForm.status === 0">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus/es'
import {
  useTeachDestroyedLessonRecordApi,
  saveTeachDestroyedLessonApi
} from '@/api/teach/teachdestroyedlessonrecord.ts'
import {useLessonApi} from "@/api/lessons/lesson";
import {useTeachClassHoursFlowRecordApi} from "@/api/teach/teachclasshoursflowrecord";
import {useUserPayApi} from "@/api/sale/user";

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataFormRef = ref()
//消课记录
const dataForm = reactive({
  id: '',
  stuId: '',
  classId: '',
  lessonId: '',
  status: 0,
  duration: '',
  actualDeduction: '',
  type: 0,
  version: '',
  deleted: '',
  creator: '',
  createTime: '',
  updater: '',
  updateTime: '',
})
//课堂信息
const lessonForm = reactive({})
//用户信息
const userForm = reactive({})
//课时流水记录信息
const flowForm = reactive({})

const init = (item?: any) => {
  visible.value = true
  dataForm.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  Object.assign(dataForm, item)
  console.log(dataForm);
  getLessonInfoHandle(item.lessonId);
  if (item.status === 0) {
    getUserInfoHandle(item.stuId);
  } else if (item.status === 1) {
    getFlowRecord(item.lessonId, item.stuId);
  }

}

const getFlowRecord = (lessonId: number, stuId: number) => {
  useTeachClassHoursFlowRecordApi(lessonId, stuId).then(res => {
    Object.assign(flowForm, res.data);
    console.log(flowForm);
  })
}

const getUserInfoHandle = (id: number) => {
  useUserPayApi(id).then(res => {
    Object.assign(userForm, res.data);
    console.log(userForm)
  })
}

const getLessonInfoHandle = (id: number) => {
  useLessonApi(id).then(res => {
    Object.assign(lessonForm, res.data)
    console.log(lessonForm)
  })
}

const getTeachDestroyedLessonRecord = (id: number) => {
  useTeachDestroyedLessonRecordApi(id).then((res: any) => {
    Object.assign(dataForm, res.data)
  })
}

const dataRules = ref({})

// 表单提交
const submitHandle = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    saveTeachDestroyedLessonApi(dataForm).then(() => {
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
<style scoped>
.my-label {
  background: var(--el-color-success-light-9);
}
.my-content {
  background: var(--el-color-danger-light-9);
}
</style>