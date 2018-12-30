<template>
    <my-page title="图床">
        <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input id="file" type="file" name="logo" class="from-control">
            </div>
          
            <ui-raised-button class="btn" label="上传" primary @click="upload" />

            <div v-if="result">{{ result }}</div>
        </form>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import {domain} from '@/config'

    export default {
        data () {
            return {
                result: null
            }
        },
        methods: {
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
