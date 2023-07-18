<template>
  <el-dialog v-model="visible" width="80%" title="资源管理" :close-on-click-modal="false">
    <el-card>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="addHandle(state.problemId,state.problemType)">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
        <el-table-column label="序号" header-align="center" align="center">
          <template #default="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="filePath" label="文件路径" header-align="center" align="center"></el-table-column>
        <fast-table-column
              prop="fileType"
              label="资源类型"
              dict-type="file_type"
              header-align="center"
              align="center"
              width="130"
          ></fast-table-column>
        <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--弹窗, 新增 -->
      <add-resource ref="addRef" @refreshDataList="getList"></add-resource>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import AddResource from './add-resource.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {deleteProblemResourceApi,getProblemResource} from "@/api/problem/problemresource";

const visible = ref(false)

const state = reactive({
  dataListSelections: [],
  dataListLoading: false,
  problemId: 0,
  problemType:0,
  dataList: []
})

const getList = () => {
  state.dataListLoading = true
  getProblemResource(state.problemId).then((res: any) => {
    state.dataList = res.data
  }).finally(()=>{
    state.dataListLoading = false
  })

}


const init = (id: number,type:number) => {
  visible.value = true
  state.problemId = id
  state.problemType = type
  getList()
}

const addRef = ref()
const addHandle = (id: number,type:number) => {
  addRef.value.init(id,type)
}

const deleteBatchHandle = (key?: number) => {
  ElMessageBox.confirm('确定进行删除操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(() => {
          deleteProblemResourceApi(key).then(() => {
            ElMessage.success('删除成功')
            getList()
          })
      })
      .catch(() => {})
}

defineExpose({
  init
})
</script>
