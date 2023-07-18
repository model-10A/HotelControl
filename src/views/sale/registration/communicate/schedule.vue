<template>
  <el-dialog v-model="visible" width="80%">
    <div style="text-align: center;margin-bottom: 10px">
      <p style="font-size: 24px;font-weight: bold">试听课表详情</p>
    </div>
    <el-card>
      <el-form inline style="align-items: center">
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="请选择开始时间"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="请选择结束时间"
              />
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button>重置</el-button>
          <el-button type="primary" @click="submitHandle()">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 6px">
      <el-table :data="tableData" height="250" style="width: 100%" header-align="center">
        <el-table-column prop="address" label="开课日期"/>
        <el-table-column prop="date" label="课程名称"/>
        <el-table-column prop="name" label="上课时间"/>
        <el-table-column prop="name" label="教室"/>
        <el-table-column prop="name" label="教师"/>
      </el-table>
    </el-card>
    <template #footer>
      <el-button @click="visible = false" type="primary">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue";

const visible = ref(false)
const init = () => {
  visible.value = true
}

defineExpose({
  init
})
</script>

<style scoped>

</style>