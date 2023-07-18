<template>
  <el-dialog v-model="visible" width="80%">
    <div style="text-align: center;margin-bottom: 2px">
      <p style="font-size: 24px;font-weight: bold">完善信息</p>
    </div>
    <el-form ref="infoRef" :model="stuInfo" :rules="infoRules">
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="学生学号" style="font-weight: bold">
          <el-input disabled v-model="stuInfo.stuNumber"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="报名时间" style="font-weight: bold">
          <el-input disabled v-model="stuInfo.enrollTime"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="学生姓名" style="font-weight: bold">
          <el-input disabled v-model="stuInfo.stuName"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="联系方式" style="font-weight: bold">
          <el-input disabled v-model="stuInfo.phone"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item prop="eventsId" label="报名活动" style="font-weight: bold">
          <el-select v-model="stuInfo.eventsId" class="m-2" placeholder="选择活动" @change="refresh">
            <el-option
              v-for="item in selectList.activeList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
              v-loading
            />
          </el-select>
        </el-form-item>
        <el-col :span="7"></el-col>
        <el-form-item prop="discountProgramId" label="优惠方案" style="font-weight: bold">
          <el-select v-model="stuInfo.discountProgramId" class="m-2" placeholder="选择方案">
            <el-option
              v-for="item in selectList.discountList"
              :key="item.id"
              :label="item.discountName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row style="margin-bottom: 14px">
        <el-col :span="2"></el-col>
        <el-form-item label="就读学校" style="font-weight: bold">
          <el-input v-model="stuInfo.school"></el-input>
        </el-form-item>
        <el-col :span="8"></el-col>
        <el-form-item label="就读年级" style="font-weight: bold">
          <el-select v-model="stuInfo.grade">
            <el-option
              v-for="item in gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-form-item label="联系人关系" style="font-weight: bold">
          <el-input v-model="stuInfo.urgentIdentity"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-form-item label="家庭住址" style="font-weight: bold">
          <el-input  style="width: 900px;" v-model="stuInfo.address"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-form-item label="学员情况" style="font-weight: bold">
          <el-input
            style="width: 900px"
            v-model="stuInfo.stuLevel"
            :autosize="{ minRows: 7 }"
            type="textarea"
            placeholder="请输入沟通备注">
          </el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { getActivityDiscountApi, submitCommunicateStuInfoApi } from "@/api/sale/enroll/communicate/communicate";
import { ElMessage } from "element-plus";
import { useGetEventsApi } from "@/api/sale/enroll/enroll";

const infoRef = ref();

const infoRules = ref({
  eventsId: [{ required: true, message: '必须填写报名的活动', trigger: 'change' }],
  discountProgramId: [{ required: true, message: '必须填写选择的优惠', trigger: 'change' }],
})

const visible = ref(false);
const init = () => {
  getDiscount(stuInfo.eventsId)

  visible.value = true;
};

const props = defineProps(["stuInfo"]);
const stuInfo = props.stuInfo;

const selectList = reactive(
  {
    activeList: [],
    discountList: []
  }
);

const getEvents = () => {
  useGetEventsApi().then(res => {
    selectList.activeList = res.data;
  });
};

const getDiscount = (id: any) => {
  getActivityDiscountApi(id).then(res => {
    selectList.discountList = res.data;
  });
  //给discount赋值
};

const refresh = (id: any) => {
  getActivityDiscountApi(id).then(res => {
    selectList.discountList = res.data;
    stuInfo.discountProgramId = ''
  });
  //给discount赋值
};

const submitHandle = () => {
  console.log(stuInfo)
  infoRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false;
    }
    submitCommunicateStuInfoApi(stuInfo).then(res => {
      if (res.msg === "success") {
        ElMessage.success({
          message: "完善信息成功！",
          duration: 1000
        });
        visible.value = false;
      }
    });
  });
};
const gradeOptions = ref([
  {
    value: "1",
    label: "一年级"
  },
  {
    value: "2",
    label: "二年级"
  },
  {
    value: "3",
    label: "三年级"
  },
  {
    value: "4",
    label: "四年级"
  },
  {
    value: "5",
    label: "五年级"
  },
  {
    value: "6",
    label: "六年级"
  },
  {
    value: "7",
    label: "初一"
  },
  {
    value: "8",
    label: "初二"
  },
  {
    value: "9",
    label: "初三"
  },
  {
    value: "10",
    label: "高一"
  },
  {
    value: "11",
    label: "高二"
  },
  {
    value: "12",
    label: "高三"
  },
  {
    value: "13",
    label: "大一"
  },
  {
    value: "14",
    label: "大二"
  },
  {
    value: "15",
    label: "大三"
  },
  {
    value: "16",
    label: "大四"
  }
]);

defineExpose({
  init
});

onMounted(() => {
  getEvents();

});

</script>

<style scoped>

</style>