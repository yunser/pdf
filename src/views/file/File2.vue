<template>
    <my-page title="我的文件">
        <input type="file" value="上传文件" @change="filechange($event)">
        <ui-list v-if="files.length">
            <ui-list-item :title="file.name" describeText="Jan 9, 2014" 
                v-for="file in files" :key="file.id">
                <ui-icon-menu slot="right" icon="more_vert" tooltip="操作">
                    <ui-menu-item title="打开" @click="open(file)" />
                    <ui-menu-item title="复制" />
                    <ui-menu-item title="删除" @click="remove(file)" />
                </ui-icon-menu>
            </ui-list-item>
        </ui-list>
        <button @click="upload">上传</button>
        =========
        <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
            <h2>单文件上传</h2>
            <div class="form-group">
                <input type="file" name="logo" class="from-control">
            </div>
            <button type="submit" class="btn btn-default">上传</button>
        </form>
        ===
        <input id="input-file" type="file" @change="filechange($event)" style="display: none">
        
        <ui-dialog title="确认删除" :open="dialog">
            确认删除文件
            <ui-flat-button slot="actions" @click="dialog = false" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="removeFile" label="确定"/>
        </ui-dialog>
    </my-page>
</template>

<script>
    import {domain} from '@/config'

    export default {
        data () {
            return {
                dialog: false,
                files: []
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.refresh()
            },
            open(file) {
                window.open(domain.img1 + file.url)
            },
            refresh() {
                let userId = this.$storage.get('user').id

                this.$http.get(`/users/${userId}/files`)
                    .then(response => {
                        let data = response.data
                        console.log(data)
                        this.files = data
                    },
                    response => {
                        console.log(response)
                    })
            },
            upload() {
                document.getElementById('input-file').click()
            },
            removeFile() {
                this.dialog = false
                this.$http.delete(domain.imgApi + '/files/' + this.removeFileId)
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
                this.removeFileId = file.id
            },
            filechange (e) {
                this.input = e.target
                if (!e.target.files.length) {
                    return
                }
                this.myfile = e.target.files[0]

                console.log('上传')
                console.log(this.myfile.name)

                let param = new FormData()
                param.append('file', this.myfile, this.myfile.name)
                param.append('chunk', '0')
                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                this.$http.post(domain.imgApi + '/files', param, config)
                    .then(response => {
                        this.refresh()
                    })

                /*
                 // 上传文件类型检测
                 let ext = this.fileExt(this.myfile.name)
                 if (this.type === 'image') {
                 if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png' && ext !== 'gif' && ext !== 'bmp') {
                 this.error('只能上传图片文件！')
                 return
                 }
                 }
                 */
                console.log('file', this.myfile.type)
//                if (this.myfile.type.indexOf('image') !== -1) {
//                    if (this.myfile.size / 100 > 500) {
//                        this.compressAndUpload()
//                        return
//                    }
//                }
            }
        }
    }
</script>

<style scoped>
</style>
