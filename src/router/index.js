import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const Temp = resolve => require(['@/views/Temp'], resolve)
const Link = resolve => require(['@/views/Link'], resolve)
const Login = resolve => require(['@/views/Login'], resolve)

const Error404 = resolve => require(['@/views/error/Error404'], resolve)

// 文件
const Viewer = resolve => require(['@/views/Viewer'], resolve)
const File = resolve => require(['@/views/file/File'], resolve)
const File2 = resolve => require(['@/views/file/File2'], resolve)
const FileDetail = resolve => require(['@/views/file/FileDetail'], resolve)
const FileEdit = resolve => require(['@/views/file/FileEdit'], resolve)
const Trash = resolve => require(['@/views/file/Trash'], resolve)
const ImageTemp = resolve => require(['@/views/ImageTemp'], resolve)

Vue.use(Router)

const APP_NAME = '云设'

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/save',
        component: Home
    },
    {
        path: '/viewer',
        component: Viewer
    },
    {
        path: '/pick',
        component: Home
    },
    {
        path: '/temp',
        component: Temp
    },
    {
        path: '/link',
        component: Link
    },
    {
        path: '/trash',
        component: Trash,
        meta: {
            title: '回收站'
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            title: '登陆'
        }
    },
    // 文件相关
    {
        path: '/files',
        component: File
    },
    {
        path: '/files2',
        component: File2
    },
    {
        path: '/files/:path/edit',
        component: FileEdit
    }, {
        path: '/files/detail',
        component: FileDetail
    },
    {
        path: '/image/temp',
        component: ImageTemp
    },
    {
        path: '*',
        component: Error404
    }
]

function getTitle(title) {
    if (title) {
        return title
    } else {
        return APP_NAME
    }
}

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = getTitle(to.meta.title)
    } else {
        document.title = getTitle()
    }
    next()
})

export default router
