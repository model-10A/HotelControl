<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" width="70%">
    <el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-select v-model="state.queryForm.date" clearable  >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="addHandle()">新增</el-button>
      </el-form-item>
    </el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%">
			<el-table-column prop="name" label="课程名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="任课老师" show-overflow-tooltip header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="planItemName" label="教学日历名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="place" label="上课地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="beginTime" label="开课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column prop="endTime" label="结课时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="200">
				<template #default="scope">
					<el-button type="text" @click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			:current-page="state.pageIndex"
			:page-sizes="state.pageSizes"
			:page-size="state.pageSize"
			:total="state.total"
			layout="total, sizes, prev, pager, next, jumper"
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
		>
		</el-pagination>
		<template #footer>
			<el-button @click="submit">确定</el-button>
		</template>
		<add-lesson ref="addLesson" @refreshDataList="getDataList"></add-lesson>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import AddLesson from '@/views/teach/audition-record/add-lesson.vue'
import { dataListPageUrl, deleteUrl} from '@/api/lessons/lesson'
import service from "@/utils/request";
import moment from "moment";
const emit = defineEmits(['refreshDataList'])
const nowDate = ref(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
const visible = ref(false)
const state: IHooksOptions = reactive({
	dataListUrl: dataListPageUrl,
  createdIsNeed:false,
	deleteUrl: deleteUrl,
	queryForm: {
		classId: 0,
    date:'',
	}
})
const options = ref([
  {
    value:'',
    label:'全部'
  },
  {
    value:nowDate,
    label:'未结束'
  },
])

const init = async (id?: number)  => {
  state.page = 1
  if (!state.dataListUrl) {
    return
  }

  state.dataListLoading = true

  service
      .get(state.dataListUrl, {
        params: {
          order: state.order,
          asc: state.asc,
          page: state.isPage ? state.page : null,
          limit: state.isPage ? state.limit : null,
          ...state.queryForm
        }
      })
      .then((res: any) => {
        state.dataList = state.isPage ? res.data.list : res.data
        state.total = state.isPage ? res.data.total : 0
      })
      .finally(() => {
        state.dataListLoading = false
        visible.value = true
      })
}

const addLesson = ref()
const addHandle = (id?: number) => {
	console.log(id)
	addLesson.value.init(id)
}
const dataRules = ref({})

const submit = () => {
	visible.value = false
	emit('refreshDataList')
}

defineExpose({
	init
})

const { getDataList, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)
</script>
