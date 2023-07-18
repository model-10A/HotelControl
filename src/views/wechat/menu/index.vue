<template>
	<el-card>
		<div v-loading="status.saveLoading" class="public-account-management clearfix">
			<!--左边配置菜单-->
			<div class="left">
				<div class="weixin-hd">
					<div class="weixin-title">
						{{ menuName }}
					</div>
				</div>
				<div class="weixin-menu menu_main clearfix">
					<div v-for="(item, i) of menu.button" :key="i" class="menu_bottom">
						<!-- 一级菜单 -->
						<div class="menu_item el-icon-s-fold" :class="{ active: status.isActive === i }" @click="menuFun(i, item)">{{ item.name }}</div>
						<!--以下为二级菜单-->
						<div v-if="status.isSubMenuFlag === i" class="submenu">
							<div v-for="(subItem, k) in item.sub_button" :key="k" class="subtitle menu_bottom">
								<div class="menu_subItem" :class="{ active: status.isSubMenuActive === i + '' + k }" @click="subMenuFun(subItem, i, k)">
									{{ subItem.name }}
								</div>
							</div>
							<!--  二级菜单加号， 当长度 小于  5 才显示二级菜单的加号  -->
							<div v-if="!item.sub_button || item.sub_button.length < 5" class="menu_bottom menu_addicon" @click="addSubMenu(i, item)">+</div>
						</div>
					</div>
					<!-- 一级菜单加号 -->
					<div v-if="menu.button.length < 3" class="menu_bottom menu_addicon" @click="addMenu">+</div>
				</div>
				<div class="save_div">
					<!--<el-button class="save_btn" type="warning" size="small" @click="saveFun">保存菜单</el-button>-->
					<el-button class="save_btn" type="success" size="small" @click="saveAndReleaseFun">保存并发布菜单</el-button>
				</div>
			</div>
			<!--右边配置-->
			<div v-if="status.showRightFlag" class="right">
				<div class="configure_page">
					<div class="delete_btn">
						<el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteMenu(temp.tempObj)">删除当前菜单</el-button>
					</div>
					<div>
						<span>菜单名称：</span>
						<el-input
							v-model="temp.tempObj.name"
							class="input_width"
							placeholder="请输入菜单名称"
							:maxlength="status.nameMaxlength"
							clearable
						></el-input>
					</div>
					<div v-if="status.showConfigurContent">
						<div class="menu_content">
							<span>菜单内容：</span>
							<el-select v-model="temp.tempObj.type" clearable placeholder="请选择" class="menu_option">
								<el-option v-for="item in menuOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
						<div v-if="temp.tempObj.type === 'view'" class="configur_content">
							<span>跳转链接：</span>
							<el-input v-model="temp.tempObj.url" class="input_width" placeholder="请输入链接" clearable></el-input>
						</div>
						<div v-if="temp.tempObj.type === 'miniprogram'" class="configur_content">
							<div class="applet">
								<span>小程序的appid：</span>
								<el-input v-model="temp.tempObj.appid" class="input_width" placeholder="请输入小程序的appid" clearable></el-input>
							</div>
							<div class="applet">
								<span>小程序的页面路径：</span>
								<el-input
									v-model="temp.tempObj.pagepath"
									class="input_width"
									placeholder="请输入小程序的页面路径，如：pages/index"
									clearable
								></el-input>
							</div>
							<div class="applet">
								<span>备用网页：</span>
								<el-input v-model="temp.tempObj.url" class="input_width" placeholder="不支持小程序的老版本客户端将打开本网页" clearable></el-input>
							</div>
							<p class="blue">tips:需要和公众号进行关联才可以把小程序绑定带微信菜单上哟！</p>
						</div>
						<div v-if="temp.tempObj.type === 'article_view_limited'" class="configur_content">
							<el-row>
								<div v-if="temp.tempObj && temp.tempObj.content && temp.tempObj.content.articles" class="select-item">
									<WxNews :obj-data="temp.tempObj.content.articles"></WxNews>
									<el-row class="ope-row">
										<el-button type="danger" icon="el-icon-delete" circle @click="deleteTempObj"></el-button>
									</el-row>
								</div>
								<div v-if="!temp.tempObj.content || !temp.tempObj.content.articles">
									<el-row>
										<el-col :span="24" style="text-align: center">
											<el-button type="success" @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
										</el-col>
									</el-row>
								</div>
								<el-dialog v-model="status.dialogNewsVisible" title="选择图文" width="90%">
									<!--									<WxMaterialSelect :obj-data="{ repType: 'news' }" @selectMaterial="selectMaterial"></WxMaterialSelect>-->
								</el-dialog>
							</el-row>
						</div>
						<div v-if="temp.tempObj.type === 'click' || temp.tempObj.type === 'scancode_waitmsg'" class="configur_content">
							<wx-reply v-if="status.hackResetWxReplySelect" :obj-data="temp.tempObj"></wx-reply>
						</div>
					</div>
				</div>
			</div>
			<!--一进页面就显示的默认页面，当点击左边按钮的时候，就不显示了-->
			<div v-if="!status.showRightFlag" class="right">
				<p>请选择菜单配置</p>
			</div>
		</div>
	</el-card>
</template>

<script setup lang="ts">
import WxReply from '/src/components/wx-reply/index.vue'
import { reactive, ref } from 'vue'
import { useSaveMenuApi, useWxMenuApi } from '@/api/wechat/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
const status = reactive({
	showRightFlag: false,
	saveLoading: false,
	isSubMenuFlag: -1,
	isSubMenuActive: -1,
	isActive: -1,
	showConfigurContent: true,
	dialogNewsVisible: false,
	hackResetWxReplySelect: false,
	nameMaxlength: 0
})
const menuOptions = [
	{
		value: 'view',
		label: '跳转网页'
	},
	{
		value: 'miniprogram',
		label: '跳转小程序'
	},
	// {
	// 	value: 'click',
	// 	label: '点击回复'
	// },
	// {
	// 	value: 'article_view_limited',
	// 	label: '跳转图文消息'
	// },
	{
		value: 'scancode_push',
		label: '扫码直接返回结果'
	},
	// {
	// 	value: 'scancode_waitmsg',
	// 	label: '扫码回复'
	// },
	{
		value: 'pic_sysphoto',
		label: '系统拍照发图'
	},
	{
		value: 'pic_photo_or_album',
		label: '拍照或者相册'
	},
	{
		value: 'pic_weixin',
		label: '微信相册'
	},
	{
		value: 'location_select',
		label: '选择地理位置'
	}
]
const menuName = ref('')
//横向菜单
const menu = reactive({
	button: [
		{
			name: '',
			sub_button: []
		}
	]
})
menu.button.length = 0
const temp = reactive({
	tempObj: {
		repName: '',
		repUrl: '',
		type: '',
		pagepath: '',
		content: {
			articles: ''
		}
	},
	tempSelfObj: {
		grand: '',
		index: 0,
		secondIndex: 0
	}
})

const getMenu = () => {
	useWxMenuApi().then((res: any) => {
		console.log(res.data)
		menu.button = JSON.parse(res.data).button
	})
}
const addMenu = () => {
	let addButton = {
		name: '菜单名称',
		sub_button: []
	}
	console.log(menu.button)
	menu.button.push(addButton)
	menuFun(menu.button.length - 1, addButton)
}
// 一级菜单点击事件
const menuFun = (index: number, item: any) => {
	status.hackResetWxReplySelect = false //销毁组件
	status.hackResetWxReplySelect = true //重建组件
	status.showRightFlag = true //右边菜单
	temp.tempObj = item //这个如果放在顶部，flag会没有。因为重新赋值了。
	temp.tempSelfObj.grand = '1' //表示一级菜单
	temp.tempSelfObj.index = index //表示一级菜单索引
	status.isActive = index //一级菜单选中样式
	status.isSubMenuFlag = index //二级菜单显示标志
	status.isSubMenuActive = -1 //二级菜单去除选中样式
	status.nameMaxlength = 4
}
const deleteMenu = (obj: any) => {
	ElMessageBox.confirm('确定要删除该菜单吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			// 一级菜单的删除方法
			if (temp.tempSelfObj.grand == '1') {
				menu.button.splice(temp.tempSelfObj.index, 1)
			}
			// 二级菜单的删除方法
			if (temp.tempSelfObj.grand == '2') {
				menu.button[temp.tempSelfObj.index].sub_button.splice(temp.tempSelfObj.secondIndex, 1)
			}
			ElMessage.success('删除成功!')
			temp.tempObj = {}
			status.showRightFlag = false
			status.isActive = -1
			status.isSubMenuActive = -1
		})
		.catch(() => {})
}
// 二级菜单点击事件
const subMenuFun = (subItem: any, index: number, k: number) => {
	status.hackResetWxReplySelect = true //重建组件

	status.showRightFlag = true //右边菜单
	temp.tempObj = subItem //将点击的数据放到临时变量，对象有引用作用
	temp.tempSelfObj.grand = '2' //表示二级菜单
	temp.tempSelfObj.index = index //表示一级菜单索引
	temp.tempSelfObj.secondIndex = k //表示二级菜单索引
	status.isSubMenuActive = Number(index + '' + k) //二级菜单选中样式
	status.isActive = -1 //一级菜单去除样式
	status.showConfigurContent = true
	status.nameMaxlength = 7
}
const deleteTempObj = () => {
	console.log('deleteTempObj')
	temp.tempObj.repName = ''
	temp.tempObj.repUrl = ''
	temp.tempObj.content = {}
}

const openMaterial = () => {
	status.dialogNewsVisible = true
}
const addSubMenu = (index: number, item: any) => {
	console.log('addSubMenu')
	if (!item.sub_button || item.sub_button.length <= 0) {
		item['sub_button'] = []
		delete item.type
		delete item.pagepath
		delete item.url
		delete item.key
		delete item.article_id
		delete item.textContent
		status.showConfigurContent = false
	}
	let subMenuKeyLength = item.sub_button.length //获取二级菜单key长度
	let addButton = {
		name: '子菜单名称'
	}
	item.sub_button.push(addButton)
	subMenuFun(item.sub_button[subMenuKeyLength], index, subMenuKeyLength)
}
const saveAndReleaseFun = () => {
	ElMessageBox.confirm('确定要保证并发布该菜单吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			status.saveLoading = true
			useSaveMenuApi({
				strWxMenu: menu
			})
				.then((res: any) => {
					status.saveLoading = false
					ElMessage.success('发布成功')
				})
				.catch(() => {
					status.saveLoading = false
				})
		})
		.catch(() => {})
}
getMenu()
</script>

<style scoped lang="scss">
/* 公共颜色变量 */
.clearfix {
	*zoom: 1;
}
.clearfix::after {
	content: '';
	display: table;
	clear: both;
}
div {
	text-align: left;
}
.weixin-hd {
	color: #fff;
	text-align: center;
	position: relative;
	bottom: 426px;
	left: 0px;
	width: 300px;
	height: 64px;
	background: transparent url('assets/menu_head.png') no-repeat 0 0;
	background-position: 0 0;
	background-size: 100%;
}
.weixin-title {
	color: #fff;
	font-size: 14px;
	width: 100%;
	text-align: center;
	position: absolute;
	top: 33px;
	left: 0px;
}
.weixin-menu {
	background: transparent url('assets/menu_foot.png') no-repeat 0 0;
	padding-left: 43px;
	font-size: 12px;
}
.menu_option {
	width: 40% !important;
}
.public-account-management {
	min-width: 1200px;
	width: 1200px;
	margin: 0 auto;
	.left {
		float: left;
		display: inline-block;
		width: 350px;
		height: 715px;
		background: url('assets/iphone_backImg.png') no-repeat;
		background-size: 100% auto;
		padding: 518px 25px 88px;
		position: relative;
		box-sizing: border-box;
		/*第一级菜单*/
		.menu_main {
			.menu_bottom {
				position: relative;
				float: left;
				display: inline-block;
				box-sizing: border-box;
				width: 85.5px;
				text-align: center;
				border: 1px solid #ebedee;
				background-color: #fff;
				cursor: pointer;
				&.menu_addicon {
					height: 46px;
					line-height: 46px;
				}
				.menu_item {
					height: 44px;
					line-height: 44px;
					text-align: center;
					box-sizing: border-box;
					width: 100%;
					&.active {
						border: 1px solid #2bb673;
					}
				}
				.menu_subItem {
					height: 44px;
					line-height: 44px;
					text-align: center;
					box-sizing: border-box;
					&.active {
						border: 1px solid #2bb673;
					}
				}
			}
			i {
				color: #2bb673;
			}
			/*第二级菜单*/
			.submenu {
				position: absolute;
				width: 85.5px;
				bottom: 45px;
				.subtitle {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
		.save_div {
			margin-top: 15px;
			text-align: center;
			.save_btn {
				bottom: 20px;
				left: 100px;
			}
		}
	}
	/*右边菜单内容*/
	.right {
		float: left;
		width: 63%;
		background-color: #e8e7e7;
		padding: 20px;
		margin-left: 20px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		.configure_page {
			.delete_btn {
				text-align: right;
				margin-bottom: 15px;
			}
			.menu_content {
				margin-top: 20px;
			}
			.configur_content {
				margin-top: 20px;
				background-color: #fff;
				padding: 20px 10px;
				border-radius: 5px;
			}
			.blue {
				color: #29b6f6;
				margin-top: 10px;
			}
			.applet {
				margin-bottom: 20px;
				span {
					width: 20%;
				}
			}
			.material {
				.input_width {
					width: 30%;
				}
				.el-textarea {
					width: 80%;
				}
			}
		}
	}
}
.public-account-management .el-input {
	width: 70%;
	margin-right: 2%;
}

.pagination {
	text-align: right;
	margin-right: 25px;
}
.select-item {
	width: 280px;
	padding: 10px;
	margin: 0 auto 10px auto;
	border: 1px solid #eaeaea;
}
.select-item2 {
	padding: 10px;
	margin: 0 auto 10px auto;
	border: 1px solid #eaeaea;
}
.ope-row {
	padding-top: 10px;
	text-align: center;
}
.item-name {
	font-size: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
}
</style>
