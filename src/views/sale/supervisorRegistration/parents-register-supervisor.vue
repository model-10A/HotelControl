<template>
  <el-card style="margin-bottom: 10px">
    <div style="text-align: center">
      <p style="font-size: 30px;font-weight: bold">报名信息</p>
    </div>
  </el-card>
  <el-card>
    <el-form :rules="dataRules">
      <el-row style="margin-bottom: 30px">
        <el-col :span="4"></el-col>
        <el-form-item label="学生姓名" style="font-weight: bold" prop="stuName">
          <el-input v-model="registrationForm.stuName" placeholder="请输入姓名" clearable style="width: 250px"/>
        </el-form-item>
        <el-col :span="4"></el-col>
        <el-form-item label="联系电话" style="font-weight: bold" prop="phone">
          <el-input v-model="registrationForm.phone" placeholder="请输入联系电话" clearable style="width: 250px"/>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="4"></el-col>
        <el-form-item label="家庭住址" style="font-weight: bold">
          <el-cascader
            v-model="registrationForm.address"
            :options="options"
            :props="props"
            @change="handleChange"
            style="width: 250px"
          />
        </el-form-item>
        <el-col :span="4"></el-col>
        <el-form-item label="就读学校" style="font-weight: bold">
          <el-input v-model="registrationForm.school" placeholder="请输入就读学校" clearable style="width: 250px"/>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 30px">
        <el-col :span="4"></el-col>
        <el-form-item label="活动名称" style="font-weight: bold">
          <el-select style="width: 250px" v-model="registrationForm.eventsId">
            <el-option
              v-for="item in selectList.activeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-col :span="4"></el-col>
        <el-form-item label="就读年级" style="font-weight: bold">
          <el-select style="width: 250px" v-model="registrationForm.grade">
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="4"></el-col>
        <el-form-item label="报名备注" style="font-weight: bold">
          <el-input
            v-model="registerDescription.description"
            :autosize="{ minRows: 6, maxRows: 10 }"
            type="textarea"
            placeholder="请输入备注"
            style="width: 800px;"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="4"></el-col>
        <el-form-item label="指定销售" style="font-weight: bold">
          <el-row>
            <el-checkbox  label="暂不指派" size="large" />
          </el-row>
          <el-col :span="1"></el-col>
          <el-row>
            <el-select style="width: 250px" v-model="registrationForm.saleId">
              <el-option
                v-for="item in selectList.saleList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="11"></el-col>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(registrationForm)">确认</el-button>
          <el-button @click="cancelHandle">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import {router} from "@/router";
import { onMounted, reactive, ref } from "vue";
import store from "@/store";
import { useGetEventsApi, useSubmitRegisterFormForSaleApi } from "@/api/sale/enroll/enroll";
import {logicalExpression} from "@babel/types";
import { useGetSaleListApi, useSubmitRegisterFormForSupervisorApi } from "@/api/sale/enroll/enrollSupervisor";
import { ElMessage } from "element-plus";

const cancelHandle = () => {
  router.push('/sale/supervisorRegistration/index')
}
//报名表
const registrationForm = reactive({
  stuName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  street: '',
  address: '',
  school: '',
  eventsId: '',
  grade: null,
  coursePackageId: '',
  saleId:store.userStore.user.id,
  description:''
})


const selectList = reactive(
  {
    activeList:[],
    saleList:[]
  }
)

const registerDescription = reactive({
  description:'',
  time:'',
  saleId:store.userStore.user.id
})

const dataRules = ref({
  stuName: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
  mobile: [{ required: true, message: '请填写电话', trigger: 'blur' }]
})
const props = {
  expandTrigger: 'hover' as const,
}

const handleChange = (value:any) => {
  console.log(value)
}
const onSubmit = (form:any) =>{
  form.address = form.address[0]+form.address[1]+form.address[2]
  console.log(form)
  useSubmitRegisterFormForSaleApi(form).then(res=>{
    if (res.msg === 'success') {
      ElMessage.success({
        message: '报名成功！',
        duration: 1000,
      })
      cancelHandle()
    }
  })
}

const getEvents = () =>{
  useGetEventsApi().then(res => {
    selectList.activeList = res.data
    console.log(selectList.activeList);
  })
  //给events赋值
}

const getSales = () => {
  useGetSaleListApi().then(res => {
    selectList.saleList =res.data
    console.log(selectList.saleList);
  })
}

const options = [
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '宁波市',
        label: '宁波市',
        children: [
          {
            value: '海曙区',
            label: '海曙区',
          },
          {
            value: '江北区',
            label: '江北区',
          },
          {
            value: '北仑区',
            label: '北仑区',
          },
          {
            value: '镇海区',
            label: '镇海区',
          },
          {
            value: '鄞州区',
            label: '鄞州区',
          },
          {
            value: '奉化区',
            label: '奉化区',
          },
          {
            value: '象山县',
            label: '象山县',
          },
          {
            value: '宁海县',
            label: '宁海县',
          },
          {
            value: '余姚市',
            label: '余姚市',
          },
          {
            value: '慈溪市',
            label: '慈溪市',
          },
        ],
      },
    ],
  },
]
onMounted(()=>{
  getEvents()
  getSales()
})

</script>