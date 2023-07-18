import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { i18n } from '@/i18n'
import { isExternalLink, pathToCamel } from '@/utils/tool'

NProgress.configure({ showSpinner: false })

const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/redirect',
		component: () => import('../layout/index.vue'),
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('../layout/components/Router/Redirect.vue')
			}
		]
	},
	{
		path: '/iframe/:query?',
		component: () => import('../layout/components/Router/Iframe.vue')
	},
	{
		path: '/login',
		component: () => import('../views/login/index.vue')
	},
	{
		path: '/404',
		component: () => import('../views/404.vue')
	}

]

const asyncRoutes: RouteRecordRaw = {
	path: '/',
	component: () => import('../layout/index.vue'),
	redirect: '/home',
	children: [
		{
			path: '/home',
			name: 'Home',
			component: () => import('../views/home.vue'),
			meta: {
				title: i18n.global.t('router.home'),
				affix: true
			}
		},
		{
			path: '/profile/password',
			name: 'ProfilePassword',
			component: () => import('../views/profile/password.vue'),
			meta: {
				title: i18n.global.t('router.profilePassword'),
				cache: true
			}
		},
		{
			name:'parentsRegister',
			path:'/parentsRegister',
			component:() => import('../views/sale/registration/parents-register.vue'),
			meta: {
				title: '家长报名'
			}
		},
		{
			name:'parentsRegisterSupervisor',
			path:'/parentsRegisterSupervisor',
			component:() => import('../views/sale/supervisorRegistration/parents-register-supervisor.vue'),
			meta: {
				title: '主管家长报名'
			}
		},
		{
			name:'details',
			path:'/details/:id',
			component:() => import('../views/sale/registration/details.vue'),
			meta: {
				title: '学生详情'
			}
		},
		{
			name:'communicate',
			path:'/communicate/:id',
			component:() => import('../views/sale/registration/communicate/index.vue'),
			meta: {
				title: '沟通'
			}
		},
		{
			name:'abandon',
			path:'/abandon',
			component:() => import('../views/sale/registration/abandon.vue'),
			meta: {
				title: '归档'
			}
		},
		{
			name:'abandonSupervisor',
			path:'/abandonSupervisor',
			component:() => import('../views/sale/supervisorRegistration/abandonSupervisor.vue'),
			meta: {
				title: '主管归档'
			}
		},
		{
			path: '/problem/sample/:problemId',
			name: 'ProblemSample',
			component: () => import('../views/problem/code-problem/problem-sample/sample.vue'),
			meta: {
				title: '测试样例',
				cache: true
			}
		},
		{
			path: '/exam/attend-exam/:examId',
			name: 'AttendExam',
			component: () => import('../views/classroom/exam/attend-exam/index.vue'),
			meta: {
				title: '考试',
				cache: true
			}
		},
		{
			path: '/exam/tea-exam/:examId',
			name: 'TeaExam',
			component: () => import('../views/exam/exam-detailed-info/index.vue'),
			meta: {
				title: '考场',
				cache: true
			}
		},
		{
			path: '/exam/make-paper/:examId/:userId',
			name: 'MakePaper',
			component: () => import('../views/exam/exam-detailed-info/make-paper/make-paper.vue'),
			meta: {
				title: '批改试卷',
				cache: true
			}
		},
		{
			path: '/classroom/stu-lesson/:lessonId',
			name: 'StudentLesson',
			component: () => import('../views/classroom/lesson/student/index.vue'),
			meta: {
				title: '课堂',
				cache: true
			}
		},
		{
			path: '/classroom/tea-lesson/:lessonId',
			name: 'TeacherLesson',
			component: () => import('../views/classroom/lesson/teacher/index.vue'),
			meta: {
				title: '课堂',
				cache: true
			}
		},
		{
			path: '/teach/info-lesson/:lessonId',
			name: 'AllLesson',
			component: () => import('../views/teach/history-lesson/lesson-info.vue'),
			meta: {
				title: '课堂情况',
				cache: true
			}
		},
		{
			path: '/teach/planItem/:id',
			name: 'TeachPlanItem',
			component: () => import('../views/teach/teach-item/index.vue'),
			meta: {
				title: '教学日历',
				cache: true
			}
		},
		{
			path: '/addClass',
			name: 'addClass',
			component: () => import('../views/teach/teach-class/add-class.vue'),
			meta: {
				title: '创建班级',
				cache: true
			}
		},
		{
			path: '/teachClass',
			name: 'teachClass',
			component: () => import('../views/teach/teach-class/index.vue'),
			meta: {
				title: '班级管理',
				cache: true
			}
		},
		{
			path: '/teach/startClass/:id',
			name: 'startClass',
			component: () => import('../views/teach/teach-class/start-class.vue'),
			meta: {
				title: '教学课堂',
				cache: true
			}
		},
		{
			path: '/teach/syncLesson/:id',
			name: 'syncLesson',
			component: () => import('../views/teach/teach-class/sync-Lesson.vue'),
			meta: {
				title: '同步课程',
				cache: true
			}
		},
		{
			path: '/problem/problem-explanation/:problemId/:problemType',
			name: 'problemExplanation',
			component: () => import('../views/problem/problem-explanation/problem-explanation.vue'),
			meta: {
				title: '题解管理',
				cache: true
			}
		},
		{
			path: '/classroom/homework/teacher/homework-problem/:lessonId',
			name: 'homeworkProblem',
			component: () => import('../views/classroom/homework/teacher/homework-problem.vue'),
			meta: {
				title: '课后作业题目列表',
				cache: true
			}
		},
		{
			path: '/business/Products/Hotel/ProductsHotel/addNewHotel',
			name: 'addNewHotel',
			component: () => import('../views/business/Products/Hotel/addNewHotel.vue'),
			meta: {
				title: '新增酒店',
				cache: true
			}
		},
		//新增编辑订单信息，by：WKB
		{
			path: '/business/Orders/Hotel/OrdersHotel/OrdersDetail/:id',
			name: 'OrdersDetail',
			component: () => import('../views/business/Orders/Hotel/OrdersDetail.vue'),
			meta: {
				title: '订单详情',
				cache: true
			}
		},
		{
			path: '/business/Products/Hotel/ProductsHotel/updateHotel/:id',
			name: 'updateHotel',
			component: () => import('../views/business/Products/Hotel/updateHotel.vue'),
			meta: {
				title: '编辑酒店信息',
				cache: true
			}
		},
		{
			path: '/business/Products/Hotel/ProductsHotel/addNewRoom/:id',
			name: 'addNewRoom',
			component: () => import('../views/business/Products/Hotel/addNewRoom.vue'),
			meta: {
				title: '新增房间',
				cache: true
			}
		},
		{
			path: '/business/Products/Hotel/ProductsHotel/updateRoom/:id',
			name: 'updateRoom',
			component: () => import('../views/business/Products/Hotel/updateRoom.vue'),
			meta: {
				title: '编辑房间',
				cache: true
			}
		},
		{
			path: '/business/Products/Hotel/ProductsRoom/:id',
			name: 'ProductsRoom',
			component: () => import('../views/business/Products/Hotel/ProductsRoom.vue'),
			meta: {
				title: '房间列表',
				cache: false
			}
		},
		/*{
			path:'/marketers/Products/Hotel/ProductsHotel/:id',
			name:'本地酒店列表',
			component:() => import('../views/business/Products/Hotel/LocalProductsHotel.vue'),
			meta:{
				title:'本地房间',
				cache: false,
			}
		},*/
		// {
		// 	path: 'business/Orders/Hotel/OrdersHotel/OrdersDetail',
		// 	name: 'OrdersDetail',
		// 	component: () => import('../views/business/Orders/Hotel/OrdersDetail.vue'),
		// 	meta: {
		// 		title: '订单详情',
		// 		cache: true
		// 	}
		// },
		// {
		// 	path: 'business/Orders/Hotel/OrdersHotel/updateOrders/:id',
		// 	name: 'OrdersDetail',
		// 	component: () => import('../views/business/Orders/Hotel/OrdersDetail.vue'),
		// 	meta: {
		// 		title: '订单详情',
		// 		cache: true
		// 	}
		// },

	]
}

// 配置常量菜单
export const constantMenu = [
	{
		id: 1000,
		name: 'Demo',
		url: null,
		openStyle: 0,
		icon: 'icon-windows',
		children: [
			{
				id: 1001,
				name: 'Icon 图标',
				url: 'demo/icons/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1002,
				name: '二维码生成',
				url: 'demo/qrcode/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1003,
				name: '页面打印',
				url: 'demo/printJs/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1004,
				name: '图片裁剪',
				url: 'demo/cropper/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			},
			{
				id: 1005,
				name: '富文本编辑器',
				url: 'demo/wangeditor/index',
				openStyle: 0,
				icon: 'icon-unorderedlist'
			}
		]
	}
]

export const errorRoute: RouteRecordRaw = {
	path: '/:pathMatch(.*)',
	redirect: '/404'
}

export const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
	NProgress.start()

	// token存在的情况
	if (store.userStore.token) {
		if (to.path === '/login') {
			next('/home')
		} else {
			// 用户信息不存在，则重新拉取
			if (!store.userStore.user.id) {
				try {
					await store.userStore.getUserInfoAction()
					await store.userStore.getAuthorityListAction()
					await store.appStore.getDictListAction()
				} catch (error) {
					// 请求异常，则跳转到登录页
					store.userStore?.setToken('')
					next('/login')
					return Promise.reject(error)
				}

				// 动态菜单+常量菜单
				const menuRoutes = await store.routerStore.getMenuRoutes()

				// 获取扁平化路由，将多级路由转换成一级路由
				const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

				// 添加菜单路由
				asyncRoutes.children?.push(...keepAliveRoutes)
				router.addRoute(asyncRoutes)

				// 错误路由
				router.addRoute(errorRoute)

				// 保存路由数据
				store.routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

				next({ ...to, replace: true })
			} else {
				next()
			}
		}
	} else {
		// 没有token的情况下，可以进入白名单
		if (whiteList.indexOf(to.path) > -1) {
			next()
		} else {
			next('/login')
		}
	}
})

// 路由加载后
router.afterEach(() => {
	NProgress.done()
})

// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (rs: RouteRecordRaw[], breadcrumb: string[]): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	rs.forEach((item: any) => {
		if (item.meta.title) {
			breadcrumb.push(item.meta.title)
		}

		if (item.children && item.children.length > 0) {
			routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
		} else {
			item.meta.breadcrumb.push(...breadcrumb)
			routerList.push(item)
		}

		breadcrumb.pop()
	})
	return routerList
}

// 加载vue组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
	return layoutModules[`/src/views/${path}.vue`]
}

// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
	const routerList: RouteRecordRaw[] = []

	menuList.forEach((menu: any) => {
		let component
		let path
		if (menu.children && menu.children.length > 0) {
			component = () => import('@/layout/index.vue')
			path = '/p/' + menu.id
		} else {
			// 判断是否iframe
			if (isIframeUrl(menu)) {
				component = () => import('@/layout/components/Router/Iframe.vue')
				path = '/iframe/' + menu.id
			} else {
				component = getDynamicComponent(menu.url)
				path = '/' + menu.url
			}
		}
		const route: RouteRecordRaw = {
			path: path,
			name: pathToCamel(path),
			component: component,
			children: [],
			meta: {
				title: menu.name,
				icon: menu.icon,
				id: '' + menu.id,
				url: menu.url,
				cache: true,
				newOpen: menu.openStyle === 1,
				breadcrumb: []
			}
		}

		// 有子菜单的情况
		if (menu.children && menu.children.length > 0) {
			route.children?.push(...generateRoutes(menu.children))
		}

		routerList.push(route)
	})

	return routerList
}

// 判断是否iframe
const isIframeUrl = (menu: any): boolean => {
	// 如果是新页面打开，则不用iframe
	if (menu.openStyle === 1) {
		return false
	}

	// 是否外部链接
	return isExternalLink(menu.url)
}
