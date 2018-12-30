<template>
    <my-page title="临时网盘" :page="page">
        <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input id="file" type="file" name="logo" class="from-control">
            </div>
          
            <ui-raised-button class="btn" label="上传" primary @click="upload" />

            <div v-if="result">
                {{ result }}
                <br>
                <ui-raised-button class="btn" label="复制链接" :data-clipboard-text="result" />
            </div>
        </form>
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
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/3f29c70009f911e98a041bb7d41b216e',
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
                    this.result = domain.imgApi + response.data.data.path.replace('public', '')
                  })        
            }
        }
    }
</script>

<style scoped>
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>
