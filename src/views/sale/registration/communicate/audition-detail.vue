<template>
  <el-dialog v-model="visible" width="80%">
    <div style="text-align: center;margin-bottom: 10px">
      <p style="font-size: 24px;font-weight: bold">试听详情</p>
    </div>
    <el-row>
      <el-col :span="2"></el-col>
      <el-form-item label="申请时间">
        <el-input disabled v-model="audition.applyTime">
        </el-input>
      </el-form-item>
      <el-col :span="10"></el-col>
      <el-form-item label="试听状态">
        <el-input disabled v-model="audition.status">
        </el-input>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :span="2"></el-col>
      <el-form-item label="试听课程">
        <el-input disabled v-model="audition.auditionCourse">
        </el-input>
      </el-form-item>
      <el-col :span="10"></el-col>
      <el-form-item  label="试听老师">
        <el-input disabled v-model="audition.teacher">
        </el-input>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :span="2"></el-col>
      <el-form-item label="试听教室">
        <el-input disabled v-model="audition.classroom">
        </el-input>
      </el-form-item>
      <el-col :span="10"></el-col>
      <el-form-item label="课堂编号">
        <el-input disabled v-model="audition.courseId">
        </el-input>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :span="2"></el-col>
      <el-form-item label="课堂反馈">
        <el-input
            disabled
            style="width: 900px"
            v-model="audition.remarks"
            :autosize="{ minRows: 7 }"
            type="textarea"
            placeholder="">
        </el-input>
      </el-form-item>
    </el-row>
    <template #footer>
      <el-button @click="visible = false" type="primary" size="large">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";

const visible = ref(false)
const init = () => {
  visible.value = true
}
const props = defineProps(['audition'])
const audition = props.audition

defineExpose({
  init
})
</script>

<style scoped>

</style>