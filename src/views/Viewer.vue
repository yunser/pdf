<template>
    <my-page title="文件查看" :page="page">
        <div class="container">
            <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <input id="file" type="file" name="logo" class="from-control">
                </div>
                <div class="tip">支持 10+ 种格式，包含 md、jpg、png 等。生成的链接有效期为 2 天，你可以复制链接分享文件给其他人查看。</div>
                <ui-raised-button class="btn" label="上传" primary @click="upload" />

                <div v-if="result">
                    {{ result }}
                    <br>
                    <div class="btns">
                        <ui-raised-button class="btn" label="查看" secondary @click="view" />
                        <ui-raised-button class="btn" label="复制链接" :data-clipboard-text="result" />
                        <ui-raised-button class="btn" label="生成二维码" @click="qrcode" />
                    </div>
                    <img class="qrcode" :src="qrcodeSrc" v-if="qrcodeSrc">
                </div>
            </form>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import {domain} from '@/config'
    const ClipboardJS = window.ClipboardJS

    export default {
        data () {
            return {
                result: null,
                qrcodeSrc: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/9097fa600b2711e9b93975574c50a41b',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.initClipboard()
        },
        methods: {
            view() {
                window.open(this.result, '_blank')
            },
            initClipboard() {
                this.clipboard = new ClipboardJS('.btn')
                this.clipboard.on('success', e => {
                    this.$message({
                        type: 'success',
                        text: '复制成功'
                    })
                    console.info('Action:', e.action);
                    console.info('Text:', e.text);
                    console.info('Trigger:', e.trigger);
                    e.clearSelection();
                })
                this.clipboard.on('error', e => {
                    console.error('Action:', e.action);
                    console.error('Trigger:', e.trigger);
                })
            },
            upload() {
                let file = document.getElementById('file').files[0];           
                let param = new FormData(); //创建form对象
                param.append('logo',file,file.name);//通过append向form对象添加数据
                param.append('chunk','0');//添加form表单中其他数据
                console.log(param.get('file')); //FormData私有类对象，访问不到，可以通过get判断值是否传进去
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };  //添加请求头
                this.$http.post(domain.imgApi + '/net/files',param,config)
                    .then(response=>{
                        console.log(response.data);
                        let result = domain.imgApi + response.data.data.path.replace('public', '')
                        this.$http.get(domain.api2 + '/preview?url=' + result)
                            .then(response=>{
                                console.log(response.data);
                                let result = response.data
                                if (!result.match(/^http/)) {
                                    result = domain.api2 + result
                                }
                                this.result = result
                            })   
                    })        
            },
            qrcode() {
                this.qrcodeSrc = 'https://nodeapi.yunser.com/qrcode?content=' + encodeURIComponent(this.result)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tip {
        margin-top: 16px;
        color: #999;
    }
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .btns {
        .btn {
            margin-right: 8px;
        }
    }
    .qrcode {
        display: block;
        width: 160px;
        height: 160px;
        margin: 0 auto;
        border: 1px solid rgba(0, 0, 0, .12);
    }
    .container {
        max-width: 800px;
        margin: 0 auto;
    }
</style>
