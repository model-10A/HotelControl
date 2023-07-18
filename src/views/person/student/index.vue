<template>
  <el-card>
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="state.queryForm.username" placeholder="账户" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.queryForm.mobile" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="state.queryForm.realName" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <org-select-tree v-model="state.queryForm.orgId" placeholder="机构名称" clearable-->
      <!--                         @changeIt="changeIt"></org-select-tree>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="getDataList()">
          <svg-icon icon="icon-search"></svg-icon>
          查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteBatchHandle()">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="importFromExcel()">导入</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%"
              @selection-change="selectionChangeHandle">
      <el-table-column type="selection" header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" label="账户" header-align="center" align="center"
                       show-overflow-tooltip></el-table-column>
      <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="readingClassNum" label="在读班级数" header-align="center" align="center">
        <template #default="scope">
          <span v-if="scope.row.readingClassNum != null">{{ scope.row.readingClassNum }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalMoney" label="累计充值金额" header-align="center" align="center"></el-table-column>
      <el-table-column prop="normal" label="常规课次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="normalPresent" label="常规赠送课次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="training" label="集训课次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="trainingPresent" label="集训赠送课次" header-align="center"
                       align="center"></el-table-column>
      <el-table-column prop="likesNum" label="点赞数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="integral" label="积分" header-align="center" align="center"></el-table-column>
      <!--			<fast-table-column prop="gender" label="性别" dict-type="user_gender" width="100"></fast-table-column>-->
      <!--			<el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>-->
      <!--			&lt;!&ndash; <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip></el-table-column> &ndash;&gt;-->
      <!--			<el-table-column prop="area" label="区域" header-align="center" align="center"></el-table-column>-->
      <!--			&lt;!&ndash; <el-table-column prop="address" label="地址" header-align="center" align="center" show-overflow-tooltip></el-table-column> &ndash;&gt;-->
      <!--			<fast-table-column prop="grade" label="年级" dict-type="grade" header-align="center" align="center"></fast-table-column>-->
      <!--			&lt;!&ndash;&lt;!&ndash;			<el-table-column prop="integral" label="积分" header-align="center" align="center"></el-table-column>&ndash;&gt; &ndash;&gt;-->
      <!--			&lt;!&ndash;			 <el-table-column prop="balance" label="余额" header-align="center" align="center"></el-table-column> &ndash;&gt;-->
      <!--			<el-table-column prop="orgName" label="所属机构" header-align="center" align="center"></el-table-column>-->
      <!--			<fast-table-column prop="status" label="状态" dict-type="user_status" width="100"></fast-table-column>-->
      <!-- <el-table-column prop="createTime" label="创建时间" header-align="center" align="center" width="180"></el-table-column> -->
      <el-table-column label="操作" fixed="right" header-align="center" align="center">
        <template #default="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">查看</el-button>
          <el-button type="text" @click="ResetPassword(scope.row.id)">重置密码</el-button>

          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button type="text" class="el-dropdown-link">更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="inClass">插班</el-dropdown-item>
                <el-dropdown-item command="changeClass">换班</el-dropdown-item>
                <el-dropdown-item command="outClass">退班</el-dropdown-item>
                <el-dropdown-item command="communicate">沟通</el-dropdown-item>
                <el-dropdown-item command="particulars">详情</el-dropdown-item>
                <el-dropdown-item command="renewAmount">充值课时</el-dropdown-item>
                <el-dropdown-item command="auditionLesson">安排试听</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="state.page"
        :page-sizes="state.pageSizes"
        :page-size="state.limit"
        :total="state.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
    >
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList"></add-or-update>
    <!-- 插班 -->
    <in-class ref="inClassRef" @refreshDataList="getDataList"></in-class>

    <!-- 换班 -->
    <change-class ref="changeClassRef" @refreshDataList="getDataList"></change-class>

    <!-- 退班 -->
    <out-class ref="outClassRef" @refreshDataList="getDataList"></out-class>

    <!--沟通-->
    <communicate ref="communicateRef"></communicate>

    <!--详情-->
    <particulars ref="particularsRef"></particulars>

    <!--续费-->
    <renew-amount ref="renewAmountRef" @refreshDataList="getDataList"></renew-amount>

    <!--    安排试听-->
    <join-lesson ref="joinLessonRef" @refreshDataList="getDataList"></join-lesson>

    <student-excel ref="studentExcelRef" @refreshDataList="getDataList"></student-excel>
  </el-card>
</template>

<script setup lang="ts">
import {useCrud} from '@/hooks'
import {onMounted, reactive, ref} from 'vue'
import AddOrUpdate from './add-or-update.vue'
import {IHooksOptions} from '@/hooks/interface'
import InClass from './in-class.vue'
import ChangeClass from './change-class.vue'
import OutClass from './out-class.vue'
import {dataListUrl, deleteUrl} from '@/api/teach/student'
import StudentExcel from '@/views/person/student/student-excel.vue'
import {resetPassword} from '@/api/teach/teacher'
import {ElMessage} from 'element-plus'
import communicate from './communicate/communicate.vue'
import renewAmount from './renewAmount.vue'
import Particulars from './particulars.vue'
import Communicate from '@/views/person/student/communicate/communicate.vue'
import RenewAmount from '@/views/person/student/renewAmount.vue'
import JoinLesson from '@/views/person/student/join-lesson.vue'
import {useUserInfoApi} from "@/api/sys/user";

const state: IHooksOptions = reactive({
  dataListUrl: dataListUrl,
  deleteUrl: deleteUrl,
  queryForm: {
    username: '',
    mobile: '',
    orgName: '',
    realName: '',
    orgArr: [],
    orgId: ''
  }
})
const getOrgId = async () => {
  const {data: data} = await useUserInfoApi()
  state.queryForm.orgId = data.orgId
  getDataList()
}
const changeIt = (orgArr: []) => {
  state.queryForm.orgArr = orgArr
  console.log(state.queryForm.orgArr)
}

const query = reactive({
  id: '',
  password: ''
})

const ResetPassword = (id: number) => {
  query.id = id.toString()
  query.password = '123456'
  resetPassword(query).then(() => {
    ElMessage.success({
      message: '操作成功',
      duration: 500
    })
  })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id)
}

const inClassRef = ref()
const inClassHandle = (id: number) => {
  inClassRef.value.init(id)
}
const studentExcelRef = ref()
const importFromExcel = () => {
  studentExcelRef.value.init()
}
const changeClassRef = ref()
const changeClassHandle = (id: number) => {
  changeClassRef.value.init(id)
}

const outClassRef = ref()
const outClassHandle = (id: number) => {
  outClassRef.value.init(id)
}

const communicateRef = ref()
const communicateHandle = (id: number) => {
  communicateRef.value.init(id)
}

const particularsRef = ref()
const particularsHandle = (id: number) => {
  particularsRef.value.init(id)
}

const renewAmountRef = ref()
const renewAmountHandle = (id: number) => {
  renewAmountRef.value.init(id)
}

const joinLessonRef = ref()
const joinLessonHandle = (id: number, enrollId: number) => {
  joinLessonRef.value.init(id,enrollId)
}

// 插班是直接加入一个新的正式的班级，将学生id与班级id绑定，此时需要判断学生身份（试听，正常）
// 换班是退出一个旧的班级，加入一个新的班级，此时需要判断剩余的课时数和新的课时数（变化课时数为新课时数-旧课时数）
// 退班直接退出旧的班级，退课时费
const handleCommand = (command: string, row: any) => {
  if (command === 'inClass') {
    console.log('我在插班', row)
    inClassHandle(row.id)
  } else if (command === 'changeClass') {
    console.log('我在换班', row.id)
    changeClassHandle(row.id)
  } else if (command === 'outClass') {
    console.log('我在退班')
    outClassHandle(row.id)
  } else if (command === 'communicate') {
    console.log('我在沟通')
    communicateHandle(row.id)
  } else if (command === 'particulars') {
    console.log('我在详情')
    particularsHandle(row.id)
  } else if (command === 'renewAmount') {
    console.log('我在续费', row.id)
    renewAmountHandle(row.id)
  } else if ((command = 'auditionLesson')) {
    console.log('我在安排试听', row.id , row.enrollId)
    joinLessonHandle(row.id,row.enrollId)
  }
}
onMounted(() => {
  getOrgId()
})
const {getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle} = useCrud(state)
</script>
<style scoped>
.el-dropdown-link {
  display: flex;
  align-items: center;
  line-height: normal;
  margin-left: 10px;
  margin-top: 2px;
  padding-top: 5px;
}
</style>
