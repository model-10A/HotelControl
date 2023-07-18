<template>
  <el-card>
    <el-card style="height: 100px">
      <el-page-header :icon="null" @back="onBack">
        <template #icon> <svg-icon icon="icon-left"></svg-icon></template>
        <template #content>
          <span style="font-size: 25px">《{{ state.name }}》</span>
          <el-tag v-if="state.endTime < state.nowTime" type="danger">已结束</el-tag>
          <el-tag v-if="state.beginTime > state.nowTime">未开始</el-tag>
        </template>
      </el-page-header>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="学生列表" name="first">
          <lesson-chat v-model="lessonId" />
        </el-tab-pane>

        <el-tab-pane label="题目列表" name="second">
          <lesson-problem ref="lessProblemRef" v-model="lessonId" />
        </el-tab-pane>

        <el-tab-pane label="答题情况" name="third">
          <answer-situation ref="answerSituationRef" v-model="lessonId"></answer-situation>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </el-card>


</template>

<script lang="ts" name="ClassroomLessonTeacherIndex" setup>
import { useRoute, useRouter } from 'vue-router'
import { provide, reactive, ref} from 'vue'
import LessonProblem from './lesson-problem.vue'
import { useLessonApi} from '@/api/lessons/lesson'
import AnswerSituation from './answer-situation.vue'
import moment from 'moment'
import LessonChat from './lesson-chat.vue'
const lessProblemRef = ref()
const activeName = ref('first')
const route = useRoute()
const router = useRouter()
const state = reactive({
  id: 0,
  name: '',
  beginTime: '',
  endTime: '',
  nowTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
})
const active = ref(0)
const lessonId = ref(route.params.lessonId)
provide('lessonId', route.params.lessonId)
const answerSituationRef = ref()
const getClassInfo = () => {
  useLessonApi(lessonId.value).then(res => {
    state.id = Number(lessonId.value)
    state.name = res.data.name
    state.beginTime = res.data.beginTime
    state.endTime = res.data.endTime
    lessProblemRef.value.init(state)
    answerSituationRef.value.init(state)
  })
  provide('state', state)
}
getClassInfo()
const onBack = () => {
  router.push({ path: '/teach/history-lesson/index' })
}

</script>

<style scoped></style>
