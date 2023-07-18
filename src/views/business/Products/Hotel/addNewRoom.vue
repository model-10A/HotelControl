<template>
  <div class="container">
    <el-button type="primary" :icon="RefreshRight">刷新</el-button>
  </div>
  <el-card class="group">
    <el-form :model="form"  label-width="120px">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="添加房型" name="first">
          <el-form-item label="酒店编号：">
            <el-input v-model="form.no" style="width: 400px;"/>
          </el-form-item>
          <el-form-item label="当前酒店:">
            <el-input v-model="form.name" style="width: 400px"/>
          </el-form-item>
          <el-form-item label="房型来源:">
            <el-select v-model="form.region" >
              <el-option label="手动添加:" value="handle" />
            </el-select>
          </el-form-item>
          <el-form-item label="房型名称:">
            <el-input v-model="form.date1" style="width: 400px"/>
          </el-form-item>
          <el-form-item label="门市价:">
            <el-input v-model="form.date2" style="width: 400px"/>元
          </el-form-item>
          <el-form-item label="限购数量:">
            每个账号限购<el-input v-model="form.limitnum" style="width: 10%"/>间
          </el-form-item>
          <el-form-item label="结算方式:">
            <el-radio-group v-model="form.resource">
              <el-radio label="1" >结算价</el-radio>
              <el-radio label="2" >销售价</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item label="会员预定方式:">
              <el-switch v-model="form.delivery" />全款支付
            </el-form-item>
            <el-form-item label="会员支付方式:">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="线上支付" name="type" />
                <el-checkbox label="线下支付" name="type" />
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="设置库存:">
              总数<el-input v-model="form.totalNum" style="width: 20%"/>间
            </el-form-item>
          <el-form-item label="日历报价:">
            <el-input v-model="form.totalNum" style="width: 20%"/>元
          </el-form-item>
            <el-form-item label="退款类型:">
              <el-radio-group v-model="form.resource">
                <el-radio label="1" >可退</el-radio>
                <el-radio label="2" >不可退</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="预订确认方式:">
              <el-radio-group v-model="form.resource">
                <el-radio label="1" >无需确认</el-radio>
                <el-radio label="2" >支付后确认</el-radio>
                <el-radio label="3" >支付前确认</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="房型信息">
          <el-form-item label="房型说明：">
            <WangEditor v-model="form.Notes" placeholder="请输入..." style="height: 200px; border: 0px; width: 800px"></WangEditor>
          </el-form-item>
          <el-form-item label="房间面积：">
            <el-input v-model="form.name" style="width: 400px;"/>㎡
          </el-form-item>
          <el-form-item label="房间楼层：">
            <el-input v-model="form.name" style="width: 400px;"/>层
          </el-form-item>
          <el-form-item label="人数限制：">
            <el-input v-model="form.name" style="width: 400px;"/>人 （*0表示不限）
          </el-form-item>
          <el-form-item label="床型：">
            <el-radio-group v-model="radio">
              <el-radio :label="1">单床1.5米 </el-radio>
              <el-radio :label="2">大床1.8米 </el-radio>
              <el-radio :label="3">大床2米 </el-radio>
              <el-radio :label="4">双床1.2米 </el-radio>
              <el-radio :label="5">双床1.5米 </el-radio>
              <el-radio :label="6">双床1.8米 </el-radio>
              <el-radio :label="7">三床1.2米 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="窗户：">
            <el-radio-group v-model="radio">
              <el-radio :label="1">有窗 </el-radio>
              <el-radio :label="2">内窗 </el-radio>
              <el-radio :label="3">无窗 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="餐标：">
            <el-radio-group v-model="radio">
              <el-radio :label="1">单早 </el-radio>
              <el-radio :label="2">双早 </el-radio>
              <el-radio :label="3">含 </el-radio>
              <el-radio :label="4">不含 </el-radio>
              <el-radio :label="5">早餐 </el-radio>
              <el-radio :label="6">早晚餐 </el-radio>
              <el-radio :label="7">三餐 </el-radio>
              <el-radio :label="8">一价全包 </el-radio>
              <el-radio :label="9">用晚含早 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="宽带：">
            <el-radio-group v-model="radio">
              <el-radio :label="1">有线 </el-radio>
              <el-radio :label="2">WIFI </el-radio>
              <el-radio :label="3">不含 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房型图片：">
            <el-upload
                v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>  （建议上传尺寸1024*695px）

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="房型设施">
          <el-form-item>
            <el-checkbox-group v-model="form.checked" class="group">
              <el-checkbox v-for="(item, index) in form.checked" :label="item" :key="index">{{ item }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-button type="primary" class="group">新增</el-button>
        </el-tab-pane>
      </el-tabs>

      <el-divider />
      <el-row>
        <el-col :span="1"></el-col>
        <el-button type="primary" size="large">保存</el-button>
      </el-row>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import {
  RefreshRight,
  Plus
} from '@element-plus/icons-vue'
import { ref,reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import WangEditor from '@/components/wang-editor/index.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const activeName = ref('first')
const radio = ref()
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

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
  checked:['拖鞋','24小时热水'],
  limitnum:'',
  exit1:true,
  exit2:false,
})
const onSubmit = () => {
  console.log('submit!')
}

const butt1 = () => {
  form.exit1 = true;
  form.exit2 = false;
}
const butt2 = () => {
  form.exit1 = false;
  form.exit2 = true;
}
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