<template>
	<el-dialog v-model="visible" width="60%"  title="课程调整" :close-on-click-modal="false">
		<el-table v-loading="state.dataListLoading" :row-class-name="tableRowClassName" :data="state.dataList" border style="max-height: 60vh; overflow: auto">
			<el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="beginTime" label="开始时间" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-date-picker
						v-model="scope.row.beginTime"
						type="datetime"
						:clearable="false"
						placeholder="开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
						class="item"
						@blur="scope.row.isEdit1 = false"
					></el-date-picker>
				</template>
			</el-table-column>
			<el-table-column prop="endTime" label="结束时间" header-align="center" align="center" width="250">
				<template #default="scope">
					<el-date-picker
						v-model="scope.row.endTime"
						type="datetime"
						:clearable="false"
						placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
						class="item"
						@blur="scope.row.isEdit2 = false"
					></el-date-picker>
				</template>
			</el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="100">
        <template #default="scope">
          <el-button type="text" size="small" @click="stopClass(scope.row)">停课</el-button>
        </template>
      </el-table-column>
		</el-table>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitHandle()">确定</el-button>
    </template>
	</el-dialog>
</template>

<script setup lang="ts" name="TeachPlanItemIndex">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLessonByIdApi,updateList } from '@/api/lessons/lesson'
import moment from "moment/moment";
import {useUserSubmitApi} from "@/api/teach/teacher";
import {ElMessage} from "element-plus";
import {onBeforeMount} from "vue-demi";
const props = defineProps({
  modelValue: {
    type: Number,
    required: false
  }
})
const state = reactive({
  currentRowIndex:'',
	loading: false,
	dataListSelections: [],
	dataListLoading: false,
	planId: '',
	dataList: [
		{
      index:'',
			teacherId: '',
			beginTime: '0000-00-00 00:00:00',
			endTime: '0000-00-00 00:00:00',
			teacher1Name: '',
			teacher2Name: '',
			planItemId: '',
			classId: '',
			place: '',
			id: '',
			isEdit1: false,
			isEdit2: false
		}
	]
})

const route = useRoute()
const planId: any = ref('')
let classId: any = ref('')
let frequency: any = ref(props.modelValue)
const visible = ref(false)
const init = (row: any) => {
	visible.value = true
	classId = row.id
  frequency=row.frequency
  console.log(props.modelValue)
	getLesson(classId)
}

const getLesson = (classId: any) => {
	useLessonByIdApi(classId).then(res => {
		state.dataList = res.data
	})
}

const advance = () => {
  for(var i=0;i<state.dataList.length;i++){
    console.log(state.dataList[i].beginTime)
    state.dataList[i].beginTime=moment(state.dataList[i].beginTime).subtract(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
    state.dataList[i].endTime=moment(state.dataList[i].endTime).subtract(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
    state.dataList[i].classId=classId
  }
}

const tableRowClassName = ({row, rowIndex}:any) => {
  row.index = rowIndex;
}

const stopClass = (row:any) => {
  var length=state.dataList.length
  var index=row.index
  console.log(row)
  console.log(index)
  for(var i=index;i<length-1;i++){
    console.log(state.dataList[i].beginTime)
    state.dataList[i].beginTime=state.dataList[i+1].beginTime
    state.dataList[i].endTime=state.dataList[i+1].endTime
    state.dataList[i].classId=classId
  }
  state.dataList[length-1].beginTime=moment(state.dataList[length-1].beginTime).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
  state.dataList[length-1].endTime=moment(state.dataList[length-1].endTime).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
}

const Delay = () => {
  var length=state.dataList.length
  for(var i=0;i<length-1;i++){
    console.log(state.dataList[i].beginTime)
    var transferTime=new Date();
    state.dataList[i].beginTime=state.dataList[i+1].beginTime
    state.dataList[i].endTime=state.dataList[i+1].endTime
    state.dataList[i].classId=classId
  }
  state.dataList[length-1].beginTime=moment(state.dataList[length-1].beginTime).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
  state.dataList[length-1].endTime=moment(state.dataList[length-1].endTime).add(frequency, 'days').format('YYYY-MM-DD HH:mm:ss')
}

const submitHandle = () => {
    console.log( state.dataList)
    updateList( state.dataList).then(() => {
      ElMessage.success({
        message: '操作成功',
        duration: 500,
        onClose: () => {
          visible.value = false
        }
      })
    })
}

defineExpose({
	init
})
</script>
