<template>
  <el-card>
    <el-card>
      <el-descriptions
          title="学员信息"
          :column="4"
          border
      >
        <el-descriptions-item label="学号">{{stuInfo.stuNumber}}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{stuInfo.stuName}}</el-descriptions-item>
        <el-descriptions-item label="就读学校">{{ stuInfo.school }}</el-descriptions-item>
        <el-descriptions-item label="就读年级">
          <el-tag size="small">{{ stuInfo.grade }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="家庭地址"
        >{{ stuInfo.address }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions
          title="活动信息"
          :column="4"
          :size="size"
          :style="blockMargin"
          style="margin-top: 10px"
          border
      >
        <el-descriptions-item label="活动名称">{{eventInfo.name}}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{eventInfo.beginTime}}</el-descriptions-item>
        <el-descriptions-item label="持续时间">{{eventInfo.durationDays}}</el-descriptions-item>
        <el-descriptions-item label="课包名称">
          <el-tag size="small">{{eventInfo.packageName}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="课次数">{{eventInfo.lessonTime}}</el-descriptions-item>
        <el-descriptions-item label="价格">{{eventInfo.price}}</el-descriptions-item>
        <el-descriptions-item label="优惠类型">{{eventInfo.discountType}}</el-descriptions-item>
        <el-descriptions-item label="优惠数量">{{eventInfo.discount}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions
          :column="4"
          :size="size"
          :style="blockMargin"
          style="margin-top: 10px"
          border
      >
      <el-descriptions-item label="报名时间">{{ stuInfo.enrollTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-row style="margin-top: 4px">
      <el-card style="margin-right: 20px;width: 49%">
        <el-descriptions
            title="沟通信息"
            :column="2"
            style="margin-top: 4px"
            border
        >
          <el-descriptions-item label="首次沟通时间">{{communicate.firstCommunicateTime}}</el-descriptions-item>
          <el-descriptions-item label="销售">{{ communicate.saleName }}</el-descriptions-item>
          <el-descriptions-item label="最后沟通时间">{{ communicate.lastCommunicateTime }}</el-descriptions-item>
          <el-descriptions-item label="沟通次数">
            <el-tag size="small">{{ communicate.communicate }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            title="试听信息"
            :column="2"
            style="margin-top: 4px"
            border
        >
          <el-descriptions-item label="试听申请时间">{{ audition.auditionApplyTime }}</el-descriptions-item>
          <el-descriptions-item label="试听安排时间">{{audition.auditionBeginTime}}</el-descriptions-item>
          <el-descriptions-item label="试听内容">{{ audition.auditionContent }}</el-descriptions-item>
          <el-descriptions-item label="试听老师">
            <el-tag size="small">{{ audition.teacherName }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
            title="缴费信息"
            :column="2"
            style="margin-top: 4px"
            border
        >
          <el-descriptions-item label="缴费申请时间">{{ payment.paymentBeginTime }}</el-descriptions-item>
          <el-descriptions-item label="缴费完成时间">{{ payment.paymentEndTime }}</el-descriptions-item>
          <el-descriptions-item label="缴费金额">{{ payment.payment }}</el-descriptions-item>
          <el-descriptions-item label="优惠金额">
            <el-tag size="small">{{ payment.discount }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card style="width: 49%">
        <p style="font-weight: bolder">备注信息</p>
        <div style="height: 400px;text-align: left;margin-top: 20px;border: 2px solid gray;">
          <p style="margin-left: 20px;font-size: medium" v-for="item in description">
            {{item}}
          </p>
        </div>
      </el-card>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="11"></el-col>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="cancelHandle">取消</el-button>
      </el-form-item>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {router} from "@/router";
import {onMounted, reactive, ref} from "vue";
import {
  useGetEnrollAuditionInfoApi,
  useGetEnrollCommunicateInfoApi,
  useGetEnrollEventsInfoApi, useGetEnrollPaymentInfoApi,
  useGetEnrollStuInfoApi
} from "@/api/sale/enroll/enrollStuDetails";
import { useRoute } from "vue-router"
import {getDescriptionApi} from "@/api/sale/enroll/communicate/communicate";

const cancelHandle = () =>{
  router.push('/sale/registration/index')
}
const onSubmit = () =>{
  router.push('/sale/registration/index')
}
const route = useRoute()
const stuId = ref()
const stuInfo = reactive({})

const getStuInfo = (id:number) =>{
  useGetEnrollStuInfoApi(id).then(res=>{
    Object.assign(stuInfo,res.data)
    console.log(stuInfo)
  })
}
const eventInfo = reactive({})
const getEventInfo = (id:number) =>{
  useGetEnrollEventsInfoApi(id).then(res=>{
    Object.assign(eventInfo,res.data)
  })
}
const communicate = reactive({})
const communicateInfo = (id:number) =>{
  useGetEnrollCommunicateInfoApi(id).then(res=>{
    Object.assign(communicate,res.data)
    console.log(communicate)
  })
}
const audition = reactive({})
const auditionInfo = (id:number) =>{
  useGetEnrollAuditionInfoApi(id).then(res=>{
    Object.assign(audition,res.data)
    console.log(audition)
  })
}
const payment = reactive({})
const paymentInfo = (id:number) =>{
  useGetEnrollPaymentInfoApi(id).then(res=>{
    Object.assign(payment,res.data)
    console.log(payment)
  })
}
const description = ref([])
const descriptionInfo = (id:number) =>{
  getDescriptionApi(id).then(res => {
    description.value = res.data
  })
}

onMounted(()=>{
  stuId.value = route.params.id
  getStuInfo(stuId.value)
  getEventInfo(stuId.value)
  communicateInfo(stuId.value)
  auditionInfo(stuId.value)
  paymentInfo(stuId.value)
  descriptionInfo(stuId.value)
})

</script>

<style scoped>

</style>