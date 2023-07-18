<template>
  <div class="container">
    <el-button type="primary" :icon="RefreshRight">刷新</el-button>
  </div>
  <el-card class="group">
    <el-form :model="hotelForm"  ref="hotelFormRef" label-width="90px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first">
          <el-form-item label="酒店编号：">
            <el-input v-model="hotelForm.no" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="站点：">
            <el-select v-model="hotelForm.siteId" placeholder="主站">
              <el-option label="主站" value="主站" />
              <el-option label="九寨沟" value="九寨沟" />
              <el-option label="未命名" value="未命名" />
              <el-option label="重庆" value="重庆" />
            </el-select>
          </el-form-item>
          <el-form-item label="酒店名称：">
            <el-input v-model="hotelForm.name" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="酒店卖点：">
            <el-input v-model="hotelForm.sellingPoint" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="酒店地址：">
            <el-input v-model="hotelForm.address" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="酒店坐标：">
            <span style="width: 50px;">经度</span>
            <el-input
              v-model="hotelForm.lat"
              style="width: 200px;"
            />
            <span style="width: 50px;">纬度</span>
            <el-input
              v-model="hotelForm.lon"
              style="width: 200px;"
            />

            <!--            <el-button type="primary" @click="CoordinateVisible()">选择</el-button>-->
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="hotelForm.phone" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="开业时间：">
            <el-date-picker
              v-model="hotelForm.startTime"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开业时间"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="装修时间：">
            <el-date-picker
              v-model="hotelForm.decorationTime"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="装修时间"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="目的地：">
            <el-cascader
              v-model="hotelForm.noticeTags"
              :options="options"
              :props="props"
              @change="handleChange"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="属性：">
            <el-button type="primary" @click="IfDestinition = true">选择</el-button>
          </el-form-item>
          <el-form-item label="星级：">
            <el-select v-model="hotelForm.star" placeholder="顶级酒店">
              <el-option label="顶级酒店" value="顶级酒店" />
              <el-option label="四星级酒店" value="四星级酒店" />
              <el-option label="奢华酒店" value="奢华酒店" />
              <el-option label="三星级酒店" value="三星级酒店" />
              <el-option label="五星级酒店" value="五星级酒店" />
              <el-option label="豪华酒店" value="豪华酒店" />
              <el-option label="二星级酒店" value="二星级酒店" />
              <el-option label="高级酒店" value="高级酒店" />
              <el-option label="六星级酒店" value="六星级酒店" />
              <el-option label="七星级酒店" value="七星级酒店" />
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="酒店设施">
          <el-form-item>
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              size="medium"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="ml-1 w-20"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag ml-1" size="large" @click="showInput">
              新增设施
            </el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="酒店详细">
          <el-form-item label="酒店详情：">
            <el-input
              v-model="hotelForm.details"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="服务项目">
          <el-form-item label="服务项目：">
            <el-input
              v-model="hotelForm.service"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="交通指南">
          <el-form-item label="交通指南：">
            <el-input
              v-model="hotelForm.travel"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="注意事项">
          <el-form-item label="注意事项：">
            <el-input
              v-model="hotelForm.notice"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="周边景点">
          <el-form-item label="周边景点：">
            <el-input
              v-model="hotelForm.scenicSite"
              :autosize="{ minRows: 6, maxRows: 10 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="酒店图片">
          <el-upload
            v-model:file-list="fileList"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
      <el-divider />
      <el-row>
        <el-col :span="1"></el-col>
        <el-button type="primary" @click="onSubmit(hotelForm)" size="large" >保存</el-button>
        <el-button @click="cancelHandle">取消</el-button>
      </el-row>
    </el-form>
  </el-card>
  <coordinate ref="coordinateRef"/>
  <el-dialog v-model="IfDestinition" title="设置属性">
    <el-checkbox-group v-model="selectedLabels" class="group">
      <el-checkbox label="亲子酒店" size="large" />
      <el-checkbox label="星级酒店" size="large" />
      <el-checkbox label="网红民宿" size="large" />
      <el-checkbox label="度假酒店" size="large" />
      <el-checkbox label="设计师酒店" size="large" />
      <el-divider/>
      <el-checkbox label="叫醒服务" size="large" />
      <el-checkbox label="洗衣服务" size="large" />
      <el-checkbox label="免费停车" size="large" />
    </el-checkbox-group>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  RefreshRight,
  Plus
} from '@element-plus/icons-vue'
import { ref, reactive, watch, nextTick, onMounted } from "vue";
import type { TabsPaneContext } from 'element-plus'
import WangEditor from '@/components/wang-editor/index.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import Coordinate from '/src/views/business/Products/Hotel/Select/coordinate.vue';
import {router} from "@/router";
import { ElInput } from 'element-plus'
import { useGetHotelInfoApi, useSubmitHotelFormApi, useUpdateHotelFormApi } from "@/api/business/business";
import {ElMessage} from "element-plus";

const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const selectedLabels = ref<string[]>([]);
const hotelAttr = ref({
  attr: ''
});
watch(selectedLabels, (newLabels) => {
  hotelAttr.value.attr = newLabels.join(',');
});
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const activeName = ref('first')
const IfDestinition = ref(false)
const coordinateRef = ref()
const dynamicTags  = ref(['客服WIFI免费', '吹风机', '中餐厅','西餐厅','酒吧','桑拿','宴会厅','健身房','洗衣服务','票务服务','免费停车'])
const hotelFormRef = ref()
import {useRoute} from "vue-router";
import { objectExpression } from "@babel/types";

const route = useRoute()
const hotelForm = reactive({
  id:route.params.id,
  no:'',
  siteId: '',
  name: '',
  sellingPoint: '',
  address: '',
  lat: '',
  lon: '',
  phone: '',
  startTime:'',
  decorationTime:'',
  noticeTag:'',
  noticeTags:[],
  star:'',
  installation:'',
  details:'',
  service:'',
  travel:'',
  notice:'',
  scenicSite:'',
  attr:hotelAttr.value.attr,
})

watch(dynamicTags, (newTags) => {
  hotelForm.installation = newTags.join(',')
})

const handleClose = (tag: string) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}
const getHotelInfo = (id:any) => {
  useGetHotelInfoApi(id).then(res=>{
   Object.assign(hotelForm,res.data)
    console.log(hotelForm);
  })
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const props = {
  expandTrigger: 'hover' as const,
}
const handleChange = (value:any) => {
  console.log(value)
}

const CoordinateVisible = () =>{
  coordinateRef.value.init()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const fileList = ref<UploadUserFile[]>([])

const onSubmit = (form:any) => {
  hotelFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      console.log(valid)
      return valid
    }
    form.attr = hotelAttr.value.attr
    form.noticeTag = form.noticeTags[0] + ',' + form.noticeTags[1] + ',' + form.noticeTags[2]
    console.log(form)
    useUpdateHotelFormApi(form).then(res => {
      if (res.msg === 'success') {
        ElMessage.success({
          message: '修改成功！',
          duration: 1000,
        })
        cancelHandle()
      }
    })
  })
}
const cancelHandle = () => {
  router.push('/business/Products/Hotel/ProductsHotel')
}

const options = ref([
  {
    value: '国内旅游',
    label: '国内旅游',
    children: [
      {
        value: '北京',
        label: '北京',
        children: [
          {
            value: '朝阳',
            label: '朝阳',
          },
          {
            value: '石景山',
            label: '石景山',
          },
          {
            value: '西城',
            label: '西城',
          },
        ],
      },
      {
        value: '贵州',
        label: '贵州',
        children: [
          {
            value: '贵阳',
            label: '贵阳',
          },
          {
            value: '六盘水',
            label: '六盘水',
          },
          {
            value: '遵义',
            label: '遵义',
          },
        ],
      },
      {
        value: '四川',
        label: '四川',
        children: [
          {
            value: '峨眉乐山',
            label: '峨眉乐山',
          },
          {
            value: '九寨沟',
            label: '九寨沟',
          },
        ],
      },
      {
        value: '西藏',
        label: '西藏',
        children: [
          {
            value: '昌都',
            label: '昌都',
          },
          {
            value: '拉萨',
            label: '拉萨',
          },
          {
            value: '那曲',
            label: '那曲',
          },
        ],
      },
    ],
  },
])

onMounted( () =>{
  getHotelInfo(route.params.id)
  }
)
</script>

<style scoped>
.demo-tabs {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.group {
  display: flex;
  flex-wrap: wrap;
}
.container {
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>