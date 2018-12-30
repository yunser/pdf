<template>
    <ui-page name="file">
        <ui-header title="回收站"></ui-header>
        <main class="page-body">

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

            <div class="ui-empty" v-if="!files.length">
                <img class="ui-empty-icon" src="/static/img/empty-trash.png">
                <div class="ui-empty-text">您的回收站为空噢～</div>
            </div>
        </main>
        <ui-footer></ui-footer>
        <ui-dialog title="确认删除" :open="dialog">
            确认删除文件
            <ui-flat-button slot="actions" @click="dialog = false" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="removeFile" label="确定"/>
        </ui-dialog>
    </ui-page>
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

                this.$http.get(`/users/${userId}/files/trash`)
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
            }
        }
    }
</script>

<style scoped>
</style>
