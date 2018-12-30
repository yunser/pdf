<template>
    <div class="page page-file-detail">
        <header class="page-header">
            <mu-appbar title="文本编辑">
                <mu-icon-button icon="arrow_back_ios" slot="left" @click="$router.go(-1)" />
                <mu-icon-menu icon="more_vert" slot="right">
                    <mu-menu-item title="剪切"/>
                    <mu-menu-item title="复制"/>
                    <mu-menu-item title="粘贴"/>
                    <mu-menu-item title="删除"/>
                    <mu-menu-item title="分享"/>
                </mu-icon-menu>
            </mu-appbar>
        </header>
        <main class="page-body">
            文件详情

        </main>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                file: {}
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                let query = this.$qs.parse(location.href.split('?')[1])
                let path = query.path
                console.log(path)
                this.$http.get('/files/detail?path=' + encodeURI(path))
                    .then(response => {
                        let data = response.data
                        console.log(data)
                        if (data === 0) {
                            this.file = data.data
                        }
                    },
                    response => {
                        console.log(response)
                    })
            }
        }
    }
</script>

<style scoped>
</style>
