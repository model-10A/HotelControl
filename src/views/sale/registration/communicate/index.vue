<template>
  <el-card style="float: right;width: 35%;margin-left: 4px">
    <p style="font-weight: bolder">备注信息</p>
    <div style="height: 20px"></div>
    <ul v-infinite-scroll="load" style="overflow: auto;height:460px;margin-bottom: 50px">
      <div v-if="description.length=='0'">暂无数据</div>
      <li v-if="description.length!='0'" style="margin-left: 20px;height:30px;font-size: medium"
          v-for="item in description" show-header="false">
        {{ item }}
      </li>
    </ul>
    <p style="font-weight: bolder;margin-top: 20px;margin-bottom: 31px">沟通备注</p>
    <el-input
        v-model="communicateDescription"
        :autosize="{ minRows: 14 }"
        type="textarea"
        placeholder="请输入沟通备注">
    </el-input>
    <div style="margin-top: 26px;text-align: right">
      <el-button @click="reset()">放弃</el-button>
      <el-button type="primary" @click="addDescription">添加</el-button>
    </div>
  </el-card>
  <el-card style="width: 64%">
    <el-row>
      <el-card style="width: 83%;">
        <div style="height: 8px"></div>
        <el-table :data="stuInfoShow" border style="width: 100%;height: auto" max-height="250"
                  :cell-style="{ textAlign: 'center',height:'55px' }"
                  :header-cell-style="{textAlign:'center',height:'30px'}">
          <el-table-column prop="stuName" label="姓 名" show-overflow-tooltip width="100"/>
          <el-table-column prop="phone" label="手机号" width="120"/>
          <el-table-column prop="school" label="学 校" show-overflow-tooltip width="180"/>
          <el-table-column prop="grade" label="年 级" width="100"/>
          <el-table-column prop="address" label="住 址" show-overflow-tooltip/>
        </el-table>

        <div style="height: 30px"></div>
        <el-table :data="communicateInfo" border style="width: 100% ;height: auto" max-height="250"
                  :cell-style="{ textAlign: 'center',height:'55px' }"
                  :header-cell-style="{textAlign:'center',height:'30px'}">
          <el-table-column v-if="communicateInfo[0].communicateTime===''" prop="null" label="沟通情况"/>
          <el-table-column v-if="communicateInfo[0].communicateTime!==''" prop="communicateTime" label="沟通日期"/>
          <el-table-column v-if="communicateInfo[0].communicateTime!==''" prop="saleName" label="沟通人"
                           show-overflow-tooltip/>
          <el-table-column v-if="communicateInfo[0].communicateTime!==''" prop="explanation" label="沟通内容"
                           show-overflow-tooltip/>
          <el-table-column  prop="type" label="沟通类型">
          <template #default="scope">
            <span v-if="scope.row.type === '1'">试听沟通</span>
            <span v-else-if="scope.row.type === '2'">缴费沟通</span>
            <span v-else-if="scope.row.type === '0'">常规沟通</span>
          </template>
          </el-table-column>
        </el-table>
        <div style="height: 20px"></div>

        <el-table :data="auditionArray" border style="width: 100% ;height: auto" max-height="250"
                  :cell-style="{ textAlign: 'center',height:'55px' }"
                  :header-cell-style="{textAlign:'center',height:'30px'}">
          <el-table-column v-if="auditionArray[0].applyTime===''" prop="null" label="试听申请"/>
          <el-table-column v-if="auditionArray[0].applyTime!==''" prop="applyTime" label="申请时间"/>
          <el-table-column v-if="auditionArray[0].status==='0'&&auditionArray[0].applyTime!==''" prop="statusFalse"
                           label="试听状态"/>
          <el-table-column v-if="auditionArray[0].status==='1'&&auditionArray[0].applyTime!==''" prop="statusTrue"
                           label="试听状态"/>
          <el-table-column v-if="auditionArray[0].applyTime!==''" prop="auditionCourse" label="试听课程"/>
          <el-table-column v-if="auditionArray[0].applyTime!==''" prop="courseId" label="课堂编号"/>
        </el-table>
        <div style="height: 20px"></div>

        <el-table :data="paymentArray" border style="width: 100% ;height: auto" max-height="250"
                  :cell-style="{ textAlign: 'center',height:'55px' }"
                  :header-cell-style="{textAlign:'center',height:'30px'}">
          <el-table-column v-if="paymentArray[0].expectTime===''" prop="null" label="缴费信息"/>
          <el-table-column v-if="paymentArray[0].expectTime!==''" prop="activityName" label="报名活动"/>
          <el-table-column v-if="paymentArray[0].expectTime!==''" prop="discountName" label="优惠项目"/>
          <el-table-column v-if="paymentArray[0].expectTime!==''" prop="coursePackageName" label="课包名称" show-overflow-tooltip/>
        </el-table>
      </el-card>
      <el-card style="width: 16%;">
        <div style="margin-top: 32px;text-align: center">
          <el-button type="primary" @click="informationRefHandle" style="min-height: 50px;min-width: 120px">完善信息
          </el-button>
        </div>
        <div style="margin-top: 76px;text-align: center">
          <el-button type="primary" @click="historyRefHandle" style="min-height: 50px;min-width: 120px">沟通历史
          </el-button>
        </div>
        <div style="margin-top: 58px;text-align: center">
          <el-button type="primary" @click="auditionDetailRefHandle" style="min-height: 50px;min-width: 120px">
            试听详情
          </el-button>
        </div>
        <div style="margin-top: 68px;text-align: center">
          <el-button type="primary" @click="paymentRefHandle" style="min-height: 50px;min-width: 120px">缴费详情
          </el-button>
        </div>
      </el-card>
    </el-row>
  </el-card>
  <el-card style="width: 64%;margin-top: 4px ">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-change="cancelHandle">
      <el-tab-pane label="试听沟通" name="1">
        <el-form :rules="dataRuleOne">
          <el-row>
            <el-form-item label="试听内容" style="font-weight: bold">
              <el-input v-model="communicateForm.auditionContent"></el-input>
            </el-form-item>
            <el-col :span="4"></el-col>
            <el-form-item label="沟通方式" style="font-weight: bold">
              <el-select v-model="communicateForm.communication" class="m-2" placeholder="沟通方式">
                <el-option
                    v-for="item in communicationWay"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="意向说明" style="font-weight: bold;">
              <el-input v-model="communicateForm.purpose"></el-input>
            </el-form-item>
            <el-col :span="4"></el-col>
            <el-form-item label="沟通时间" style="font-weight: bold">
              <div class="demo-date-picker">
                <div class="block">
                  <el-date-picker
                      v-model="communicateForm.communicateTime"
                      type="date"
                      placeholder="沟通时间"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-form-item label="沟通内容" style="font-weight: bold;margin-top: 2px">
            <el-input style="width: 97%;padding-bottom: 8px"
                      v-model="communicateForm.communicateContent"
                      :autosize="{ minRows: 9, maxRows: 9 }"
                      type="textarea"
                      placeholder="请输入沟通内容">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          <el-button @click="cancelHandle">重置</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="缴费沟通" name="2">
        <el-form :rules="dataRuleTwo">
          <el-row>
            <el-form-item label="沟通方式" style="font-weight: bold">
              <el-select v-model="communicateForm.communication" class="m-2" placeholder="沟通方式">
                <el-option
                    v-for="item in communicationWay"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-col :span="4"></el-col>
          </el-row>
          <el-row>
            <el-form-item label="缴费时间" style="font-weight: bold">
              <div class="demo-date-picker">
                <div class="block">
                  <el-date-picker
                      type="date"
                      placeholder="预计缴费时间"
                      v-model="communicateForm.expectTime"
                  />
                </div>
              </div>
            </el-form-item>
            <el-col :span="4"></el-col>
            <el-form-item label="经手人" style="font-weight: bold">
              <el-select v-model="communicateForm.handlerId" class="m-2" placeholder="经手人">
                <el-option
                    v-for="item in handler"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
              <el-form-item label="沟通时间" style="font-weight: bold">
                <div class="demo-date-picker">
                  <div class="block">
                    <el-date-picker
                      v-model="communicateForm.communicateTime"
                      type="date"
                      placeholder="沟通时间"
                    />
                  </div>
                </div>
              </el-form-item>
            <el-col :span="4"></el-col>
            <el-col :span="6">
              <el-form-item label="实际缴费金额" style="font-weight: bold;margin-top: 2px">
                <el-input v-model="paymentArray[0].actualPaymentYuan" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="沟通内容" style="font-weight: bold;margin-top: 2px">
            <el-input style="width: 97%;"
                      v-model="communicateForm.communicateContent"
                      :autosize="{ minRows: 7, maxRows: 7 }"
                      type="textarea"
                      placeholder="请输入沟通内容">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 18px;text-align: center">
          <el-button @click="cancelHandle">重置</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常规沟通" name="0">
        <el-form :rules="dataRuleThree">
          <el-row>
            <el-form-item label="沟通方式" style="font-weight: bold">
              <el-select v-model="communicateForm.communication" class="m-2" placeholder="沟通方式">
                <el-option
                    v-for="item in communicationWay"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-col :span="4"></el-col>
            <el-form-item label="沟通时间" style="font-weight: bold">
              <div class="demo-date-picker">
                <div class="block">
                  <el-date-picker
                      v-model="communicateForm.communicateTime"
                      type="date"
                      placeholder="沟通时间"
                      format="YYYY-MM-DD"
                  />
                </div>
              </div>
            </el-form-item>
          </el-row>
          <el-form-item label="沟通内容" style="font-weight: bold">
            <el-input style="width: 97%;padding-bottom: 18px"
                      v-model="communicateForm.communicateContent"
                      :autosize="{ minRows: 11, maxRows: 11 }"
                      type="textarea"
                      placeholder="请输入沟通内容">
            </el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 20px;text-align: center">
          <el-button @click="cancelHandle">重置</el-button>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <Information ref="informationRef" :stu-info="stuInfo"></Information>
  <!--  <Schedule ref="scheduleRef"></Schedule>-->
  <History ref="historyRef" :communicate-his="communicateHis"></History>
  <AuditionDetail ref="auditionDetailRef" :audition="audition"></AuditionDetail>
  <Payment ref="paymentRef" :payment="payment"></Payment>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import Information from './information.vue'
import Schedule from './schedule.vue'
import History from './history.vue'
import AuditionDetail from "@/views/sale/registration/communicate/audition-detail.vue";
import Payment from "@/views/sale/registration/communicate/payment.vue";
import {useGetEventsApi} from "@/api/sale/enroll/enroll";
import {
  getAuditionLessonApi,
  getCommunicateAuditionApi,
  getCommunicateHistoryApi,
  getCommunicatePaymentApi,
  getCommunicateStuInfoApi,
  getDescriptionApi, getDiscountApi, getHandlerApi,
  submitCommunicateDescriptionApi,
  submitCommunicateFormApi, submitCommunicateStuInfoApi,
} from "@/api/sale/enroll/communicate/communicate";
import {useRoute} from "vue-router";
import moment from "moment";
import {ElMessage, ElMessageBox} from "element-plus";
import store from "@/store";
import {router} from "@/router";
import { FormRules } from "element-plus/es";
// import load from "postcss-load-config";

const stuId = ref()
const activeName = ref('1')

const informationRef = ref()
const informationRefHandle = () => {
  informationRef.value.init(stuId.value)
}
const scheduleRef = ref()
const scheduleRefHandle = () => {
  scheduleRef.value.init()
}
const historyRef = ref()
const historyRefHandle = () => {
  historyRef.value.init(stuId.value)
}
const auditionDetailRef = ref()
const auditionDetailRefHandle = () => {
  auditionDetailRef.value.init(stuId.value)
}
const paymentRef = ref()
const paymentRefHandle = () => {
  paymentRef.value.init(stuId.value)
}
const cancelHandle = () => {
  communicateForm.communicateResult = Number(activeName.value)
  communicateForm.auditionContent = ''
  communicateForm.coursePackageId = ''
  communicateForm.discountProgramId = ''
  communicateForm.events = ''
  communicateForm.purpose = ''
  communicateForm.communicateContent = ''
  communicateForm.communication = ''
  communicateForm.expectTime = ''
  communicateForm.handlerId = ''
  communicateForm.communicateTime = ''
}
const count = ref(0)
const load = () => {
  count.value += 2
}
const communicationWay = ref([
  {name: '线下拜访', value: 1},
  {name: '群/私聊', value: 2},
  {name: '电话沟通', value: 3},
  {name: '视频会议', value: 4},
  {name: '其他', value: 5},
])
const dataRuleOne = ref({
  stuName: [{required: true, message: '请填写学生姓名', trigger: 'blur'}],
  mobile: [{required: true, message: '请填写电话', trigger: 'blur'}]
})

const dataRuleTwo = ref({
  stuName: [{required: true, message: '请填写学生姓名', trigger: 'blur'}],
  mobile: [{required: true, message: '请填写电话', trigger: 'blur'}]
})

const dataRuleThree = ref({
  stuName: [{required: true, message: '请填写学生姓名', trigger: 'blur'}],
  mobile: [{required: true, message: '请填写电话', trigger: 'blur'}]
})

const route = useRoute()
const communicateForm = reactive({
  enrollId: route.params.id,
  auditionContent: '',
  coursePackageId: '',
  discountProgramId: '',
  events: '',
  communicateResult: 1,
  purpose: '',
  communicateContent: '',
  communication: '',
  expectTime: '',
  handlerId: '',
  communicateTime: '',
  lessonId: '',
  actualPayment:'',
})

const handler = ref([])

//学生信息
const stuInfo = reactive({
  enrollId: route.params.id,
  enrollTime: '',
  stuName: '',
  contactName: '',
  phone: '',
  urgentIdentity: '',
  school: '',
  grade: '',
  eventsId: '',
  discountProgramId: '',
  address: '',
  stuLevel: ''
})
//课表详情
const scheduleInfo = ref({
  beginTime: '',
  courseName: '',
  lessonTime: '',
  classroom: '',
  teacher: ''
})

//试听详情
const audition = reactive({
  applyTime: '',
  status: '',
  auditionCourse: '',
  teacher: '',
  classroom: '',
  courseId: '',
  remarks: '',
})
//转数组形式
const auditionArray = reactive([{
  applyTime: '',
  status: '',
  auditionCourse: '',
  teacher: '',
  classroom: '',
  courseId: '',
  remarks: '',
  statusTrue: '已试听',
  statusFalse: '未试听',
  null: '/'
}])

//缴费详情
const payment = reactive({
  applyTime: '',
  status: '',
  status0: '未缴费',
  status1: '已缴费',
  expectTime: '',
  handlerId: '',
  handlerName: '',
  realTime: '',
  realPayment: '',
  eventId: '',
  coursePackageName: '',
  lesson: '',
  payment: '',
  coursePackageType: '',
  discountType: '',
  discountName:'',
  discount: '',
  activityName: '',
  actualPayment:'',
  actualPaymentYuan:'',
})
//转数组
const paymentArray = reactive([{
  expectTime:'',
  activityName: '',
  coursePackageName: '',
  discountName: '',
  actualPaymentYuan:'',
  null: '/',

}])

const communicateHis = ref([])
const onSubmit = () => {
  if (!stuInfo.eventsId||!stuInfo.discountProgramId){
    ElMessageBox.alert('请先在"完善信息"中填入报名的活动与优惠类型', '', {
      confirmButtonText:'好的',
    })
    return
  }
  else {
    communicateForm.actualPayment=paymentDetail.value[0].realPayment
    communicateForm.communicateTime = moment(communicateForm.communicateTime).format("YYYY-MM-DD");
    submitCommunicateFormApi(communicateForm).then(res => {
      if (res.msg === 'success') {
        ElMessage.success({
          message: '沟通成功！',
          duration: 1000,
        })
        clearForm()
        router.go(0)
      }
    })
  }
}

const communicateDescription = ref()

const stuInfoShow = ref([]);
//获取学生信息
const getStuInfo = (id: number) => {
  getCommunicateStuInfoApi(id).then(res => {
    Object.assign(stuInfo, res.data)
    stuInfo.enrollId = stuId.value
    stuInfoShow.value.push(stuInfo)
    console.log(stuInfoShow);
    console.log('11111111111111111')
  })
  //stuInfo 赋值
}

//获取活动
const events = ref([])
const getEvents = () => {
  useGetEventsApi().then(res => {
    events.value = res.data
  })
}

//获取备注
const description = ref([])
const getDescription = (id: any) => {
  getDescriptionApi(id).then(res => {
    description.value = res.data
    //输入框初始化
    communicateDescription.value = ''
  })
}

//获取优惠
const discount = ref([])
const getDiscount = (id: number) => {
  getDiscountApi(id).then(res => {
    discount.value = res.data
  })
}
//获取试听课
const auditionLesson = ref([])
const getAuditionLesson = () => {
  getAuditionLessonApi().then(res => {
    auditionLesson.value = res.data;

  })
  //给auditionLesson赋值
}
const communicateInfo = reactive([{
  saleName: '默认销售名',
  communicateTime: '',
  explanation: '',
  actualPayment:'1',
  type: '',
  null: '/'
}])



const getCommunicateHistory = (id: number) => {
  getCommunicateHistoryApi(id).then(res => {
    // clearForm()
    communicateHis.value = res.data
    communicateHis.value.reverse()
    communicateInfo[0].communicateTime = communicateHis.value[0].communicateTime
    communicateInfo[0].saleName = communicateHis.value[0].saleName
    communicateInfo[0].explanation = communicateHis.value[0].explanation
    communicateInfo[0].type = communicateHis.value[0].result
    communicateHis.value.reverse()
  })
}

const auditionDetail = ref([])
const getAuditionDetail = (id: number) => {
  getCommunicateAuditionApi(id).then(res => {
    auditionDetail.value = res.data
    audition.applyTime = auditionDetail.value[0].auditionApplyTime
    audition.auditionCourse = auditionDetail.value[0].auditionContent
    audition.teacher = auditionDetail.value[0].teacherName
    audition.status = auditionDetail.value[0].status
    audition.classroom = auditionDetail.value[0].classroom
    audition.courseId = auditionDetail.value[0].courseId
    audition.remarks = auditionDetail.value[0].remarks
    auditionDetail.value.reverse()
    auditionArray[0].applyTime = auditionDetail.value[0].auditionApplyTime
    auditionArray[0].status = auditionDetail.value[0].status
    auditionArray[0].auditionCourse = auditionDetail.value[0].auditionContent
    auditionArray[0].courseId = auditionDetail.value[0].courseId
    auditionDetail.value.reverse()
  })
}

const paymentDetail = ref([])
const getPayment = (id: number) => {
  getCommunicatePaymentApi(id).then(res => {
    paymentDetail.value = res.data
    payment.payment = paymentDetail.value[0].payment
    payment.applyTime = paymentDetail.value[0].paymentBeginTime
    payment.discount = paymentDetail.value[0].discount
    payment.discountType = paymentDetail.value[0].discountType
    payment.coursePackageType = paymentDetail.value[0].coursePackageType
    payment.coursePackageName = paymentDetail.value[0].coursePackageName
    payment.eventId = paymentDetail.value[0].eventId
    payment.handlerName = paymentDetail.value[0].handlerName
    payment.status = paymentDetail.value[0].status
    payment.activityName = paymentDetail.value[0].activityName
    payment.discountName=paymentDetail.value[0].discountName
    payment.actualPayment=paymentDetail.value[0].realPayment
    payment.lesson=paymentDetail.value[0].lesson
    payment.actualPaymentYuan=paymentDetail.value[0].realPayment+'元'
    payment.expectTime= paymentDetail.value[0].expectTime
    paymentDetail.value.reverse()
    paymentArray[0].expectTime = paymentDetail.value[0].expectTime
    paymentArray[0].coursePackageName = paymentDetail.value[0].coursePackageName
    paymentArray[0].activityName = paymentDetail.value[0].activityName
    paymentArray[0].actualPaymentYuan = paymentDetail.value[0].realPayment+'元'
    paymentArray[0].discountName = paymentDetail.value[0].discountName
    paymentDetail.value.reverse()
  })
}
const getHandler = () => {
  getHandlerApi().then(res => {
    handler.value = res.data
  })
}

const reset = () => {
  communicateDescription.value = ''
}
const communicateRemark = reactive({
  enrollId: route.params.id,
  saleId: '',
  description: '',
  type: 1
})
const addDescription = () => {
  communicateRemark.saleId = store.userStore.user.id;
  communicateRemark.description = communicateDescription.value
  if (communicateDescription.value == '') {
    ElMessageBox.alert('沟通备注不能为空', '提示', {
      autofocus: true,
    })
  } else {
    submitCommunicateDescriptionApi(communicateRemark).then(res => {
      if (res.msg === 'success') {
        ElMessage.success({
          message: '提交备注成功！',
          duration: 800,
        })
        getDescription(stuId.value)
      }
    })
  }
  communicateDescription.value = ''
}
const clearForm = () => {
  communicateForm.auditionContent = ''
  communicateForm.coursePackageId = ''
  communicateForm.discountProgramId = ''
  communicateForm.events = ''
  communicateForm.purpose = ''
  communicateForm.communicateContent = ''
  communicateForm.communication = ''
  communicateForm.expectTime = ''
  communicateForm.handlerId = ''
  communicateForm.communicateTime = ''
}
onMounted(() => {
  stuId.value = route.params.id
  getEvents()
  getStuInfo(stuId.value)
  getDiscount(stuId.value)
  getDescription(stuId.value)
  getAuditionLesson()
  getCommunicateHistory(stuId.value)
  getAuditionDetail(stuId.value)
  getPayment(stuId.value)
  getHandler()

})

</script>

<style scoped>

</style>