<template>
	<div />
	<el-tabs v-model="objData.repType" type="border-card" @tab-click="handleClick">
		<el-tab-pane name="text" label="文本">
			<el-input v-model="objData.repContent" type="textarea" :rows="5" placeholder="请输入内容"> </el-input>
		</el-tab-pane>
		<el-tab-pane name="image" label="图片">
			<el-row>
				<div v-if="objData.repUrl" class="select-item">
					<img class="material-img" :src="objData.repUrl" />
					<p v-if="objData.repName" class="item-name">{{ objData.repName }}</p>
					<el-row class="ope-row">
						<el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
					</el-row>
				</div>
				<div v-if="!objData.repUrl">
					<el-row style="text-align: center">
						<el-col :span="12" class="col-select">
							<el-button type="success" @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
						</el-col>
						<el-col :span="12" class="col-add">
							<!--							<el-upload-->
							<!--								:action="actionUrl"-->
							<!--								:headers="headers"-->
							<!--								multiple-->
							<!--								:limit="1"-->
							<!--								:on-success="handleUploadSuccess"-->
							<!--								:file-list="fileList"-->
							<!--								:before-upload="beforeImageUpload"-->
							<!--								:data="uploadData"-->
							<!--							>-->
							<!--								<el-button type="primary">上传图片</el-button>-->
							<!--								<div slot="tip" class="el-upload__tip">支持bmp/png/jpeg/jpg/gif格式，大小不超过2M</div>-->
							<!--							</el-upload>-->
						</el-col>
					</el-row>
				</div>
				<el-dialog v-model:visible="status.dialogImageVisible" title="选择图片" width="90%" append-to-body>
					<WxMaterialSelect :obj-data="objData" @selectMaterial="selectMaterial"></WxMaterialSelect>
				</el-dialog>
			</el-row>
		</el-tab-pane>
		<el-tab-pane name="voice" label="语音">
			<el-row>
				<div v-if="objData.repName" class="select-item2">
					<p class="item-name">{{ objData.repName }}</p>
					<div class="item-infos">
						<WxVoicePlayer :obj-data="Object.assign(tempPlayerObj, { repMediaId: objData.media_id, repName: objData.repName })"></WxVoicePlayer>
					</div>
					<el-row class="ope-row">
						<el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
					</el-row>
				</div>
				<div v-if="!objData.repName">
					<el-row style="text-align: center">
						<el-col :span="12" class="col-select">
							<el-button type="success" @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
						</el-col>
						<el-col :span="12" class="col-add">
							<!--							<el-upload-->
							<!--								:action="actionUrl"-->
							<!--								:headers="headers"-->
							<!--								multiple-->
							<!--								:limit="1"-->
							<!--								:on-success="handleUploadSuccess"-->
							<!--								:file-list="fileList"-->
							<!--								:before-upload="beforeVoiceUpload"-->
							<!--								:data="uploadData"-->
							<!--							>-->
							<!--								<el-button type="primary">点击上传</el-button>-->
							<!--								<div slot="tip" class="el-upload__tip">格式支持mp3/wma/wav/amr，文件大小不超过2M，播放长度不超过60s</div>-->
							<!--							</el-upload>-->
						</el-col>
					</el-row>
				</div>
				<el-dialog v-model:visible="status.dialogVoiceVisible" title="选择语音" width="90%" append-to-body>
					<!--					<WxMaterialSelect :obj-data="objData" @selectMaterial="selectMaterial"></WxMaterialSelect>-->
				</el-dialog>
			</el-row>
		</el-tab-pane>
		<el-tab-pane name="video" label="视频">
			<el-row>
				<el-input v-model="objData.repName" placeholder="请输入标题"></el-input>
				<div style="margin: 20px 0"></div>
				<el-input v-model="objData.repDesc" placeholder="请输入描述"></el-input>
				<div style="margin: 20px 0"></div>
				<div style="text-align: center">
					<a v-if="objData.repUrl" target="_blank" :href="objData.repUrl"><i class="icon-shipinbofang">&nbsp;播放视频</i></a>
				</div>
				<div style="margin: 20px 0"></div>
				<div style="text-align: center">
					<el-button type="success" @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
					<!--          <el-button type="primary" v-if="permissions.wxmp_wxmaterial_add">新建视频<i class="el-icon-upload el-icon--right"></i></el-button>-->
				</div>
				<el-dialog v-model:visible="status.dialogVideoVisible" title="选择视频" width="90%" append-to-body>
					<!--					<WxMaterialSelect :obj-data="objData" @selectMaterial="selectMaterial"></WxMaterialSelect>-->
				</el-dialog>
			</el-row>
		</el-tab-pane>
		<el-tab-pane name="news" label="图文">
			<el-row>
				<div v-if="objData.content" class="select-item">
					<!--					<WxNews :obj-data="objData.content.articles"></WxNews>-->
					<el-row class="ope-row">
						<el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
					</el-row>
				</div>
				<div v-if="!objData.content">
					<el-row style="text-align: center">
						<el-col :span="24" class="col-select2">
							<el-button type="success" @click="openMaterial"
								>{{ newsType == '1' ? '选择已发布图文' : '选择草稿箱图文' }}<i class="el-icon-circle-check el-icon--right"></i
							></el-button>
						</el-col>
					</el-row>
				</div>
				<el-dialog v-model:visible="status.dialogNewsVisible" title="选择图文" width="90%" append-to-body>
					<!--					<WxMaterialSelect :obj-data="objData" :news-type="newsType" @selectMaterial="selectMaterial"></WxMaterialSelect>-->
				</el-dialog>
			</el-row>
		</el-tab-pane>
		<el-tab-pane name="music" label="音乐">
			<el-row>
				<el-col :span="6">
					<div class="thumb-div">
						<img v-if="objData.repThumbUrl" style="width: 100px" :src="objData.repThumbUrl" />
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<!--						<div class="thumb-but">-->
						<!--							<el-upload-->
						<!--								:action="actionUrl"-->
						<!--								:headers="headers"-->
						<!--								multiple-->
						<!--								:limit="1"-->
						<!--								:on-success="handleUploadSuccess"-->
						<!--								:file-list="fileList"-->
						<!--								:before-upload="beforeThumbImageUpload"-->
						<!--								:data="uploadData"-->
						<!--							>-->
						<!--								<el-button slot="trigger" size="mini" type="text">本地上传</el-button>-->
						<!--								<el-button size="mini" type="text" style="margin-left: 5px" @click="openMaterial">素材库选择</el-button>-->
						<!--							</el-upload>-->
						<!--						</div>-->
					</div>
					<el-dialog v-model:visible="status.dialogThumbVisible" title="选择图片" width="80%" append-to-body>
						<!--						<WxMaterialSelect :obj-data="{ repType: 'image' }" @selectMaterial="selectMaterial"></WxMaterialSelect>-->
					</el-dialog>
				</el-col>
				<el-col :span="18">
					<el-input v-model="objData.repName" placeholder="请输入标题"></el-input>
					<div style="margin: 20px 0"></div>
					<el-input v-model="objData.repDesc" placeholder="请输入描述"></el-input>
				</el-col>
			</el-row>
			<div style="margin: 20px 0"></div>
			<el-input v-model="objData.repUrl" placeholder="请输入音乐链接"></el-input>
			<div style="margin: 20px 0"></div>
			<el-input v-model="objData.repHqUrl" placeholder="请输入高质量音乐链接"></el-input>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const props = defineProps({
	objData: {
		type: Object
	},
	//图文类型：1、已发布图文；2、草稿箱图文
	newsType: {
		type: String,
		default: '1'
	}
})
const { objData, newsType } = toRefs(props)

const status = reactive({
	tableLoading: false,
	dialogNewsVisible: false,
	dialogImageVisible: false,
	dialogVoiceVisible: false,
	dialogVideoVisible: false,
	dialogThumbVisible: false
})
</script>

<style scoped></style>
