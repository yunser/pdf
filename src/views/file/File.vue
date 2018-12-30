<template>
    <div class="page page-file" @resize="resize">
        <header class="page-header">
            <ui-appbar title="文件管理">
                <ui-icon-button icon="arrow_back_ios" slot="left" @click="$router.go(-1)" />
            </ui-appbar>
        </header>
        <main class="page-body">
            <div>当前目录：{{ curPath }}</div>
            <button @click="back">返回上一级</button>
            <button @click="refresh">刷新</button>
            <div v-if="!files.length">空文件夹</div>
            <ui-list v-if="files.length">
                <ui-sub-header>最近聊天记录</ui-sub-header>
                <ui-list-item :title="file.name" describeText="Jan 9, 2014" 
                    v-for="file in files" :key="file.id">
                    <ui-avatar icon="folder" slot="leftAvatar" v-if="file.type === 'directory'" @click="viewFile(file)"/>
                    <ui-avatar icon="assignment" backgroundColor="blue" slot="leftAvatar" v-if="file.type === 'file'" @click="viewFile(file)" />
                    <ui-icon-menu slot="right" icon="more_vert" tooltip="操作">
                        <ui-menu-item title="打开" />
                        <ui-menu-item title="复制" />
                        <ui-menu-item title="删除" @click="remove(file)" />
                    </ui-icon-menu>
                </ui-list-item>
            </ui-list>
        </main>

        <ui-dialog title="确认删除" :open="dialog">
            确认删除文件
            <ui-flat-button slot="actions" @click="dialog = false" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="removeFile" label="确定"/>
        </ui-dialog>
        <ui-drawer :open="largeScreen" :docked="true">
            <ui-list>
                <ui-list-item title="Menu Item 1"/>
                <ui-list-item title="Menu Item 2"/>
                <ui-list-item title="Menu Item 3"/>
            </ui-list>
        </ui-drawer>
        <ui-float-button class="ui-float-btn" icon="add" @click="add"/>
        <ui-dialog class="ui-dialog" :open="nameDialogVisible" title="Scrollable Dialog" scrollable>
            2121212
            <ui-flat-button primary label="关闭" @click="add" slot="actions"/>
        </ui-dialog>
    </div>
</template>

<script>
    const os = require('os')
    const path = require('path')

    export default {
        data () {
            return {
                nameDialogVisible: false,
                largeScreen: false,
                dialog: false,
                curPath: '',
                file: {}, // 当前文件
                // 文件列表
                files: [
                    {
                        type: 'file',
                        name: '123.txt'
                    },
                    {
                        type: 'directory',
                        name: '123.txt'
                    }
                ]
            }
        },
        mounted() {
            console.log(new Date().getTime())
            console.log('操作系统')
            console.log(os.platform())
            console.log(process.platform)
            this.init()
        },
        destroyed() {
//            window.removeEventListener('resize', this.listener)
        },
        methods: {
            add() {
                this.$http.post('/files?path=' + this.curPath + '' + '123.txt') // TODO
                    .then(response => {
                            let data = response.data
                            console.log(data)
                            this.refresh()
                        },
                        response => {
                            console.log(response)
                        })
            },
            init() {
                this.$http.get('/root')
                    .then(response => {
                        let data = response.data
                        console.log(data)

                        this.files = data.data

                        console.log('呵呵')
//                        this.files = data.data
                    },
                    response => {
                        console.log(response)
                    })
//                let query = this.$qs.parse(location.href.split('?')[1]) // 有 bug
//                let path = query.path
//                if (!path) {
//                    path = 'D://' // TODO 写死
//                }
//                this.showPath(path)
                //
//                largeScreen = window.innerWidth > 500
//                this.listener = () => {
//                    console.log('调整大小啦' + window.innerWidth)
//                    this.largeScreen = window.innerWidth > 500
//                }
//                window.addEventListener('resize', this.listener)
            },
            resize() {
                console.log('调整大小啦' + window.innerWidth)
                this.largeScreen = window.innerWidth > 500
            },
            back() {
                let parentPath = path.resolve(this.curPath.replace(/\\/, '/'), '..')
                console.log(path.resolve('D:/test/隐藏目录', '..'))
                this.showPath(parentPath)
            },
            removeFile() {
                this.dialog = false
                this.$http.delete('/files?path=' + encodeURI(this.removePath))
                    .then(response => {
                            let data = response.data
                            console.log(data)
                            this.refresh()
                        },
                        response => {
                            console.log(response)
                            alert('删除失败') // Toast
                        })
            },
            remove(file) {
                this.dialog = true
                this.removePath = file.path
            },
            showPath(path) {
                this.curPath = path
                this.$http.get('/files?path=' + encodeURI(path))
                    .then(response => {
                            let data = response.data
                            console.log(data)

                            console.log('呵呵')
                            this.files = data.data
                        },
                        response => {
                            console.log(response)
                        })
            },
            viewFile(file) {
                if (file.type === 'directory') {
                    this.showPath(file.path)
//                    this.$router.push('files?path=' + file.path)
                } else {
                    this.$router.push('files/detail?path=' + encodeURI(file.path))
                }
            },
            refresh() {
                this.showPath(this.curPath)
            },
            time(item) {
                let startTime = new Date(item.startTime)
                let endTime = new Date(item.endTime)
                let minute = (endTime.getTime() - startTime.getTime()) / 1000 / 60
                return minute
            },
            handleChange(val) {
                this.bottomNav = val
            }
        }
    }
</script>

<style scoped>

</style>
