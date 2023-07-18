<template>
  <el-dialog v-model="visible" width="50%">
    <div style="text-align: center;margin-bottom: 10px">
      <p style="font-size: 24px;font-weight: bold;padding-bottom: 20px">缴费信息确认</p>
    </div>
    <div style="font-size: 20px;font-weight: bold;padding-left: 70px;padding-bottom: 15px">基础信息</div>
    <el-form label-width="120px" style="padding-left: 40px;padding-bottom: 20px">
      <el-row style="padding-bottom: 10px">
        <el-col :span="7">
          <el-form-item label="学生姓名">
            <el-input v-model="stuInfo.stuName" style="padding-left:10px;width: 120px" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="学号">
            <el-input v-model="stuInfo.stuNumber" style="width: 150px" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号">
            <el-input v-model="stuInfo.phone" style="width: 150px" readonly/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="销售者">
        <el-input v-model="stuInfo.saleName" style="padding-left:10px;width: 120px" readonly/>
      </el-form-item>
    </el-form>
    <div style="font-size: 20px;font-weight: bold;padding-left: 70px;padding-bottom: 15px">缴费信息</div>
    <el-form :model="form" label-width="120px" style="padding-left: 40px">
      <el-row style="padding-bottom: 5px">
        <el-col :span="13">
          <el-form-item label="活动">
            <el-input v-model="stuInfo.activityTitle" style="padding-left:10px;width: 300px" readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="优惠名称">
            <el-input v-model="stuInfo.discountName" style="padding-left:10px;width: 250px" readonly/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item label="应付金额">
            <el-input v-model="stuInfo.lessonPackageMoney" style="width: 140px;padding-left: 10px">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="优惠金额">
            <el-input v-model="stuInfo.lessPackageMoney" style="width: 140px;padding-left: 10px">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="实际金额">
        <el-input v-model="stuInfo.realPackageMoney" style="width: 140px;padding-left: 10px">
          <template #append>元</template>
        </el-input>
      </el-form-item>
      <el-col :span="12">
        <el-form-item label="缴费时间">
          <el-date-picker v-model="data.time" placeholder="Arbitrary time" style="padding-left: 10px;width: auto"
                          type="datetime"/>
        </el-form-item>
      </el-col>
      <el-col :span="22">
        <el-form-item label="备注">
          <el-input style="padding-left: 10px;" :autosize="{ minRows: 5, maxRows: 5 }"
                    type="textarea"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-button @click="visible = false" size="large">关闭</el-button>
      <el-button @click="submit(data)" type="primary" size="large">确认缴费</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {submitPaymentInfoConfirmByIdApi, useGetPaymentInfoConfirmById} from "@/api/teach/handler/handler";
import {ElMessage} from "element-plus";
import { router } from "@/router";

const submit = (data: any) => {
  data.status = 1
  submitPaymentInfoConfirmByIdApi(data).then(res => {
    if (res.msg === 'success') {
      ElMessage.success({
        message: '缴费成功！',
        duration: 1000,
        onClose:()=>{
          visible.value = false
          router.go(0)
        }
      })

    }


  })
}
const data = reactive({
  teachPayId: '',
  time: '',
  status: ''
})
const visible = ref(false);
const init = (id: number, teachPayId: any, status: any) => {
  visible.value = true;
  data.teachPayId = teachPayId
  data.status = status
  getPaymentInfoConfirm(id)
};

const stuId = ref()
const stuInfo = reactive({})
const getPaymentInfoConfirm = (id: number) => {
  useGetPaymentInfoConfirmById(id).then(res => {
    Object.assign(stuInfo, res.data)
  })
}

defineExpose({
  init
})

onMounted(() => {

})

</script>
