<template>
    <my-page title="本地文件" :page="page">
        <div class="tool-box">
            <div class="left">
                <ui-raised-button class="btn-new" label="新建" primary ref="button" @click="toggleMenu"/>
                <ui-popover :trigger="trigger" :open="menuVisible" @close="handleClose">
                    <ui-menu>
                        <ui-menu-item title="文本文件" @click="newFile" />
                    </ui-menu>
                    <ui-menu>
                        <ui-menu-item title="文件夹" @click="newFolder" />
                    </ui-menu>
                </ui-popover>
                <ui-raised-button class="file-select-btn" label="上传文件" secondary>
                    <input type="file" class="ui-file-button" @change="fileChange($event)">
                </ui-raised-button>
            </div>
            <div class="right">
            </div>
        </div>
        <div>当前目录：{{ rootPath }}
            <a href="#" @click.prevent="back">返回上一级</a>
        </div>
        <div class="empty" v-if="!files.length">暂无文件</div>
        <ul class="my-file-list">
            <li class="item" v-for="file, index in files" :key="file.id">
                <div class="link"
                    @click="selectFile(file)">
                    <img class="icon" :src="iconUrl(file)">
                    <div class="info">
                        <div class="name">{{ file.name }}</div>
                        <div class="size">{{ file.size | size }}</div>
                    </div>
                </div>
                <ui-icon-menu
                    class="more"
                    icon="more_vert"
                    :anchorOrigin="{horizontal: 'right', vertical: 'top'}"
                    :targetOrigin="{horizontal: 'right', vertical: 'top'}"
                    @click.prevent="asd = 0"
                    >
                    <ui-menu-item title="重命名" @click.prevent="rename(file)" />
                    <ui-menu-item title="下载" @click.prevent="download(file)" />
                    <ui-menu-item title="删除" @click.prevent="removeFile(file)" />
                    <ui-menu-item title="快速复制" @click.prevent="quickCopyFile(file)" />
                    <ui-menu-item title="属性" @click.prevent="viewAttribute(file)" />
                </ui-icon-menu>
                <!-- <a class="remove" href="#" @click.prevent="removeFile(index)">删除</a> -->
                <!-- <a class="download" href="#" @click.prevent="download(file)">下载</a> -->
                <!-- <a class="edit" href="#" @click.prevent="edit(file)">编辑</a> -->
            </li>
        </ul>
        <ui-dialog :open="dialog" title="保存文件" @close="close">
            <ui-text-field v-model="fileName" />
            <ui-flat-button slot="actions" @click="close" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="save" label="确定"/>
        </ui-dialog>
        <ui-dialog :open="renameVisible" title="重命名" @close="toggleRename">
            <ui-text-field v-model="newName" />
            <ui-flat-button slot="actions" @click.nactive="toggleRename" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="renameOK" label="确定"/>
        </ui-dialog>
        <ui-drawer class="viewer-box" right :docked="false" :open="ViewerVisible" @close="toggle()">
            <ui-appbar :title="viewedFile.name" v-if="viewedFile">
                <ui-icon-button icon="close" slot="left" @click="toggle()" />
                <ui-icon-button icon="all_inclusive" slot="right" @click="openWith()" title="用其他应用打开" />
            </ui-appbar>
            <div class="body" v-if="viewedFile">
                <pre v-if="viewedFile.type.match(/^text/)">{{ viewedFile.data }}</pre>
                <img :src="viewedFile.data" v-else-if="viewedFile.type.match(/^image/)">
                <div v-else>不支持的文件类型</div>
            </div>
        </ui-drawer>
        <ui-drawer class="attr-box" right :docked="false" :open="attrVisible" @close="toggleAttr()">
            <ui-appbar title="属性">
                <ui-icon-button icon="close" slot="left" @click="toggleAttr" />
            </ui-appbar>
            <div class="body" v-if="viewedFile">
                <ul>
                    <li class="item">
                        <span class="key">文件名：</span>
                        <span class="value">{{ viewedFile.name }}</span>
                    </li>
                    <li class="item">
                        <span class="key">类型：</span>
                        <span class="value">{{ viewedFile.type }}</span>
                    </li>
                    <li class="item">
                        <span class="key">打开方式：</span>
                        <span class="value"></span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">位置：</span>
                        <span class="value">{{ viewedFile.path }}</span>
                    </li>
                    <li class="item">
                        <span class="key">大小：</span>
                        <span class="value">{{ viewedFile.size || size }}</span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">创建时间：</span>
                        <span class="value"></span>
                    </li>
                    <li class="item">
                        <span class="key">修改时间：</span>
                        <span class="value"></span>
                    </li>
                    <li class="item">
                        <span class="key">访问时间：</span>
                        <span class="value"></span>
                    </li>
                    <ui-divider />
                    <li class="item">
                        <span class="key">来源：</span>
                        <span class="value"></span>
                    </li>
                </ul>
            </div>
        </ui-drawer>
        <ui-dialog class="new-box" :open="newVisible" title="新建文本文件" @close="toggleNew">
            <ui-text-field v-model="newFileName" />
            <ui-flat-button slot="actions" @click="toggleNew" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click.nactive="newOk" label="确定"/>
        </ui-dialog>
        <!-- <h1>文件</h1>
        <router-link to="/files">本地文件列表</router-link>
        <router-link to="/files2">网络文件列表</router-link> -->
    </my-page>
</template>

<script>
    const saveAs = window.saveAs
    const Intent = window.Intent
    const localforage = window.localforage

    export default {
        data () {
            return {
                rootPath: '/',
                isPick: false,
                fileName: '',
                dialog: false,
                files: [
                ],
                renameVisible: false,
                newName: '',
                attrVisible: false,
                viewedFile: null,
                ViewerVisible: false,
                menuVisible: false,
                trigger: null,
                newVisible: false,
                newFileName: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'search',
                            href: 'https://search.yunser.com?utm_source=file',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=file',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
            this.trigger = this.$refs.button.$el
        },
        filters: {
            size(value) {
                if (!value) {
                    return ''
                }
                return value + 'B'
            }
        },
        methods: {
            back() {
                if (this.rootPath === '/') {
                    return
                }
                let index = this.rootPath.lastIndexOf('/')
                this.rootPath = this.rootPath.substring(0, index)
                if (!this.rootPath) {
                    this.rootPath = '/'
                }
                this.loadFile()
            },
            toggleRename() {
                this.nameVisible = !this.nameVisible
            },
            async addFile(file) {
                let id = this.getId()
                let files = await localforage.getItem('files')
                files.unshift({
                    id: id,
                    path: this.rootPath,
                    type: file.type,
                    name: file.name,
                    size: file.size,
                    data: file.data
                })
                await localforage.setItem('files', files)
                this.loadFile()
            },
            quickCopyFile(file) {
                let index = file.name.lastIndexOf('.')
                if (index === -1) {
                    file.name = file.name + ' 复制'
                } else {
                    file.name = file.name.substring(0, index) + ' 复制' + file.name.substring(index)
                }

                this.addFile(file)
            },
            newOk() {
                this.newVisible = false
                if (this.newFileType === 'folder') {
                    this.addFile({
                        type: 'folder',
                        name: this.newFileName,
                        size: 0
                    })
                } else {
                    this.addFile({
                        type: 'text/plain',
                        name: this.newFileName,
                        data: '',
                        size: 0
                    })
                }
            },
            toggleNew() {
                this.newVisible = !this.newVisible
            },
            newFile() {
                this.newName = ''
                this.menuVisible = false
                this.newVisible = true
                this.newFileType = 'text'
            },
            newFolder() {
                this.newName = ''
                this.menuVisible = false
                this.newVisible = true
                this.newFileType = 'folder'
            },
            toggleMenu () {
                this.menuVisible = !this.menuVisible
            },
            handleClose (e) {
                this.menuVisible = false
            },
            toggleAttr() {
                this.attrVisible = !this.attrVisible
            },
            goggleRename() {
                this.renameVisible = !this.renameVisible
            },
            async renameOK() {
                this.renameVisible = false
                this.renameFile.name = this.newName
                let files = localforage.getItem('files')
                for (let i = 0; i < files.length; i++) {
                    if (files[i].id === this.renameFile.id) {
                        files.splice(i, 1, this.renameFile)
                        break
                    }
                }
                await localforage.setItem('files', files)
            },
            rename(file) {
                this.renameFile = file
                this.newName = file.name
                this.renameVisible = true
            },
            toggle () {
                this.ViewerVisible = !this.ViewerVisible
            },
            init() {
                this.loadFile()
                this.initWebIntents()
                this.debug()
            },
            async loadFile() {
                let files = await localforage.getItem('files')
                if (!files) {
                    this.files = []
                    await localforage.setItem('files', [])
                }
                this.files = files.filter(file => file.path === this.rootPath)
            },
            debug() {
                // this.saveText('666666666666666666')
            },
            initWebIntents() {
                console.log('路径')
                // console.log(this.$route.path)
                if (!window.intent) {
                    return
                }
                console.log(window.intent.data)
                // let data = window.intent.data
                console.log('要处理的数据')
                console.log(window.intent)
                this.isPick = this.$route.path.includes('pick')
                if (!this.isPick) {
                    if (window.intent.type.includes('text/')) {
                        this.saveText(window.intent.data)
                    } else if (window.intent.type.includes('image/')) {
                        this.saveImage(window.intent.data)
                    }
                }
            },
            getMineType(fileName) {
                let index = fileName.lastIndexOf('.')
                if (index === -1) {
                    return ''
                }
                let ext = fileName.substring(index + 1)
                console.log('格栅板', index, ext)
                switch (ext) {
                    case 'md':
                        return 'text/plain'
                }
                return ''
            },
            fileChange(e) {
                this.input = e.target
                if (!e.target.files.length) {
                    return
                }
                this.myfile = e.target.files[0]
                console.log('上传')
                console.log(this.myfile)
                let fr = new FileReader()
                fr.onloadend = e => {
                    this.addFile({
                        type: this.myfile.type || this.getMineType(this.myfile.name),
                        name: this.myfile.name,
                        data: e.target.result,
                        size: this.myfile.size
                    })
                }
                if (this.myfile.type.match(/^image/)) {
                    fr.readAsDataURL(this.myfile)
                } else {
                    fr.readAsText(this.myfile)
                }
            },
            selectFile(file) {
                if (file.type === 'folder') {
                    if (this.rootPath === '/') {
                        this.rootPath = '/' + file.name
                    } else {
                        this.rootPath = this.rootPath + '/' + file.name
                    }
                    this.loadFile()
                    return
                }
                this.isPick = this.$route.path.includes('pick')
                if (this.isPick) {
                    window.intent.postResult(file.data, {
                        fileName: file.name
                    })
                    setTimeout(() => {
                        let owner = window.opener || window.parent
                        owner.window.close()
                    }, 100)
                } else {
                    this.ViewerVisible = true
                    this.viewedFile = file
                    // let extension = this.getFileExtension(fileName)
                    // if (file.type === 'text') {
                    // }
                }
            },
            openWith() {
                if (this.viewedFile.type.match(/^text/)) {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: 'text/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            let files = await localforage.getItem('files')
                            for (let i = 0; i < files.length; i++) {
                                if (files[i].id === this.viewedFile.id) {
                                    files.splice(i, 1, this.viewedFile)
                                    break
                                }
                            }
                            await localforage.setItem('files', files)
                        }
                        console.log('成功了', data)
                    }, data => {
                        console.log('失败')
                    })
                } else if (this.viewedFile.type.match(/^image/)) {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: 'image/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            let files = await localforage.getItem('files')
                            for (let i = 0; i < files.length; i++) {
                                if (files[i].id === this.viewedFile.id) {
                                    files.splice(i, 1, this.viewedFile)
                                    break
                                }
                            }
                            await localforage.setItem('files', files)
                        }
                        console.log('成功了')
                    }, data => {
                        console.log('失败')
                    })
                } else {
                    let intent = new Intent({
                        action: 'http://webintent.yunser.com/?',
                        type: '*/*',
                        data: this.viewedFile.data
                    })
                    navigator.startActivity(intent, async data => {
                        if (data) {
                            this.viewedFile.data = data
                            let files = await localforage.getItem('files')
                            for (let i = 0; i < files.length; i++) {
                                if (files[i].id === this.viewedFile.id) {
                                    files.splice(i, 1, this.viewedFile)
                                    break
                                }
                            }
                            await localforage.setItem('files', files)
                        }
                        console.log('成功了')
                    }, data => {
                        console.log('失败')
                    })
                }
            },
            open() {
                this.dialog = true
            },
            close() {
                this.dialog = false
            },
            saveText(text) {
                let fileName = ''
                if (window.intent.action.extras && window.intent.action.extras.fileName) {
                    fileName = window.intent.action.extras.fileName
                }
                this.dialog = true
                this.fileName = fileName
                this.data = text
            },
            saveImage(text) {
                this.dialog = true
                // 123.png
                let fileName = ''
                if (window.intent.action.extras && window.intent.action.extras.fileName) {
                    fileName = window.intent.action.extras.fileName
                }
                this.fileName = fileName
                this.data = text
            },
            save() {
                this.dialog = false
                this.addFile({
                    type: window.intent.type,
                    name: this.fileName,
                    data: this.data
                })
            },
            getId() {
                return new Date().getTime()
            },
            viewAttribute(file) {
                this.attrVisible = true
                this.viewedFile = file
            },
            async removeFile(file) {
                let files = await localforage.getItem('files')
                for (let i = 0; i < files.length; i++) {
                    if (files[i].id === file.id) {
                        files.splice(i, 1)
                        break
                    }
                }
                if (file.type === 'folder') {
                    files = files.filter(f => f.path !== file.path + '/' + file.name)
                }
                await localforage.setItem('files', files)
                this.loadFile()
            },
            download(file) {
                console.log('download', file)
                if (file.type === 'text') {
                    let f = new File([file.data], {type: 'text/plain;charset=utf-8'})
                    saveAs(f, file.name)
                } else if (file.type === 'image') {
                    window.open(file.data)
                }
            },
            iconUrl(file) {
                if (file.type === 'folder') {
                    return '/static/icon/folder.svg'
                }
                let fileName = file.name
                let extension = this.getFileExtension(fileName)
                let types = ['css', 'doc', 'html', 'jpeg', 'jpg', 'mp3', 'png', 'txt']
                if (types.includes(extension)) {
                    return '/static/icon/' + extension + '.svg'
                } else {
                    return '/static/icon/default.svg'
                }
            },
            getFileExtension(fileName) {
                let arr = fileName.split('.')
                return arr[arr.length - 1]
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../scss/var";

.empty {
    padding: 16px 0;
    color: #999;
}
.tool-box {
    margin-bottom: 16px;
    @include clearfix;
    .left {
        float: left;
    }
    .right {
        float: right;
    }
    .btn-new {
        margin-right: 8px;
    }
}

.my-file-list {
    margin-top: 16px;
    max-width: 1000px;
    .item {
        float: left;
        position: relative;
        padding: 16px;
        width: 300px;
        height: 72px;
        margin-right: 16px;
        margin-bottom: 16px;
        // border: 1px solid #eee;
        box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
    }
    .link {
        cursor: pointer;
    }
    .icon {
        width: 40px;
        height: 40px;
        margin-right: 8px;
        float: left;
    }
    .info {
        float: left;
    }
    .name {
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // margin-bottom: 8px;
        display: block;
        // line-height: 40px;
    }
    .size {
        color: #ccc;
    }
    .more {
        position: absolute;
        top: 8px;
        right: 8px;
    }
    .remove {
        position: absolute;
        top: 16px;
        right: 16px;
    }
    .download {
        position: absolute;
        top: 16px;
        right: 56px;
    }
    .edit {
        position: absolute;
        top: 16px;
        right: 100px;
    }
}
.viewer-box {
    // width: 400px;
    width: 100%;
    max-width: 800px;
    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        // background-color: #f1f1f1;
        overflow: auto;
        img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            max-height: 100%;
            border: 1px solid #ccc;
        }
    }
}
.new-box {
    width: 300px;
}
.attr-box {
    width: 100%;
    max-width: 360px;
    .body {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
    }
    .item {
        margin: 16px 0;
    }
    .key {
        display: inline-block;
        width: 80px;
    }
}
</style>
