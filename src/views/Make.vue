<template>
    <my-page title="PDF 生成" :page="page">
        <div class="form">
            <textarea v-model="form.text"></textarea>
            <div id="article" v-html="form.text">this 这是什么123</div>
            <ui-raised-button class="btn" primary label="生成 PDF" @click="make" />
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
                form: {
                    text: '测试文本',
                },
                result: null,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/3d09c4009f7d11eaa3824f27432dbf16',
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
            make() {
                // var doc = new jsPDF()

                // doc.text('这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!这是一段长长的文本!', 10, 10)
                // doc.save('a4.pdf')
                var element = document.getElementById('article');
                // html2pdf(element).save();
                let ret = html2pdf().set({
                    margin: 10
                }).from(element).save();
                console.log('ret', ret)
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
                    this.result = domain.imgApi + response.data.data.path.replace('public', '')
                  })        
            }
        }
    }
</script>

<style lang="scss" scoped>
.form {
    padding: 16px;
}
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
</style>
