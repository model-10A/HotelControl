<template>
  <el-dialog v-model="visible" width="80%">
    <div style="text-align: center;margin-bottom: 2px">
      <p style="font-size: 24px;font-weight: bold">缴费详情</p>
    </div>
    <el-form>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="报名活动" style="font-weight: bold">
          <el-input  readonly v-model="payment.activityName"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="优惠项目" :label-position="right" label-width="69px" style="font-weight: bold">
          <el-input readonly v-model="payment.discountName"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="课包名称" style="font-weight: bold">
          <el-input  readonly v-model="payment.coursePackageName"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="课时数" :label-position="right" label-width="69px" style="font-weight: bold">
          <el-input readonly v-model="payment.lesson"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="申请时间" style="font-weight: bold">
          <el-input  readonly v-model="payment.applyTime"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="状态" :label-position="right" label-width="69px" style="font-weight: bold">
          <el-input v-if="payment.status===0" readonly v-model="payment.status0"></el-input>
          <el-input v-if="payment.status===1" readonly v-model="payment.status1"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="经手人" :label-position="right" label-width="69px" style="font-weight: bold">
          <el-input readonly v-model="payment.handlerName"></el-input>
        </el-form-item>
        <el-col :span="7"></el-col>
        <el-form-item label="预计缴费时间" style="font-weight: bold;margin-left: 22px">
          <el-input readonly v-model="payment.expectTime"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="1"></el-col>
        <el-form-item label="实际所需金额" style="font-weight: bold;margin-left: 24px">
          <el-input readonly v-model="payment.actualPaymentYuan"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>

      </el-row>
      <el-row>
        <el-descriptions v-model="payment">
          <el-table-column prop="activityName" label="活动名称" width="150" align="center"/>
          <el-table-column prop="coursePackageName" label="课包名称" width="150" align="center"/>
          <el-table-column prop="lesson" label="课次数" width="150" align="center"/>
          <el-table-column prop="coursePackageType" label="课包类型" width="150" align="center"/>
          <el-table-column prop="discountType" label="折扣类型" width="150" align="center"/>
          <el-table-column prop="discount" label="折扣"  align="center"/>
        </el-descriptions>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import {ref} from "vue";

const visible = ref(false)

const props = defineProps(['payment'])
const payment = props.payment

const init = () =>{
  visible.value = true;
}



defineExpose({
  init
})
</script>

<style scoped>

</style>