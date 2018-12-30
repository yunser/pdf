<template>
    <my-page title="图床" :page="page">
        <div ref="dropArea" class="drop-box"
                @dragenter="handleDragEnter($event)"
                @dragleave="handleDragLeave($event)"
                @drop="handleDrop($event)"
                @dragover='allowDrop($event)'>
            <ui-raised-button class="file-select-btn" label="上传文件" primary>
                <!-- <input type="file" class="ui-file-button" accept="image/*" @change="fileChange($event)"> -->
                <input type="file" class="ui-file-button" @change="fileChange($event)">
            </ui-raised-button>
            <div class="text">把文件拖到这里，快速上传</div>
            <!-- <div class="text2">单张图片最大 5M，一次最多同时上传10张</div> -->
            <div class="text2">单张图片最大 5M，暂不支持批量上传</div>
        </div>
        <div class="ui-loading" v-if="loading">
            <ui-circular-progress :size="24"/>
        </div>
        <!-- {{ result }} -->
        <div class="my-tab" v-if="result">
            <ui-select-field v-model="size" label="大小">
                <ui-menu-item value="large" title="原图"/>
                <ui-menu-item value="square" title="80 x 80"/>
                <ui-menu-item value="thumb150" title="150 x 150"/>
                <ui-menu-item value="small" title="宽 200"/>
                <ui-menu-item value="bmiddle" title="宽 440"/>
                <ui-menu-item value="orj360" title="宽 480"/>
                <ui-menu-item value="orj480" title="宽 640"/>
                <ui-menu-item value="mw690" title="宽 690"/>
                <ui-menu-item value="mw1024" title="宽 1024"/>
                <ui-menu-item value="mw2048" title="宽 2048"/>
            </ui-select-field>
            <ui-tabs class="type-tab" :value="activeTab" @change="handleTabChange">
                <ui-tab value="tab1" title="链接"/>
                <ui-tab value="tab2" title="HTML"/>
                <ui-tab value="tab3" title="论坛 BBCode"/>
                <ui-tab value="tab4" title="Markdown"/>
                <ui-tab value="tab5" title="Markdown 带链接"/>
            </ui-tabs>
            <div class="tab-box">
                <div v-if="activeTab === 'tab1'">
                    <pre><code>{{ result }}</code></pre>
                    <ui-raised-button class="btn" label="复制" :data-clipboard-text="result" />
                </div>
                <div v-if="activeTab === 'tab2'">
                    <pre><code>{{ html }}</code></pre>
                </div>
                <div v-if="activeTab === 'tab3'">
                    <pre><code>{{ bbcode }}</code></pre>
                </div>
                <div v-if="activeTab === 'tab4'">
                    <pre><code>{{ markdown }}</code></pre>
                </div>
                <div v-if="activeTab === 'tab5'">
                    <pre><code>{{ markdownLink }}</code></pre>
                </div>
            </div>
        </div>
        <!-- <form action="http://localhost:1026/net/files" method="post" enctype="multipart/form-data">
            <div class="form-group">
                <input id="file" type="file" name="logo" class="from-control">
            </div>
          
            <ui-raised-button class="btn" label="上传" primary @click="upload" />

            <div v-if="result">{{ result }}</div>
        </form> -->
        
    </my-page>
</template>

<script>
    /* eslint-disable */
    import {domain} from '@/config'
    const ClipboardJS = window.ClipboardJS

    // 根据pid获取链接
    // type: thumbnail- 略缩图    mw690- 中等尺寸   large-原图
    function pid2url(pid, type, https) {
        var url, zone, ext;
        var url_pre = https ? "https://ws" : "http://ww";
        
        if (typeof(type) == 'undefined') type = 'large';
        
        if (pid[9] == 'w') {
            zone = (crc32(pid) & 3) + 1;
            url = url_pre + zone + '.sinaimg.cn/' + type + '/' + pid;
        } else {
            zone = ((pid.substr(-2, 2), 16) & 0xf) + 1;
            url = url_pre + zone + '.sinaimg.cn/' + type + '/' + pid;
        }
        
        if(pid[21] == 'g') {
            return url + '.gif';
        } else {
            return url + '.jpg';
        }
    }

    // PID 解码算法
    function crc32(str) {
        str = String(str);
        var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
        if (typeof(crc) == 'undefined') {
            crc = 0;
        }
        var x = 0,
            y = 0;
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            y = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = '0x' + table.substr(y * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return crc ^ (-1);
    }

    export default {
        data () {
            return {
                loading: false,
                size: 'large',
                activeTab: 'tab1',
                fileName: 'hello.png',
                result: '',
                // result: 'https://ws1.sinaimg.cn/large/0072Lfvtly1ftl4oikxkpj307k02kt8l.jpg',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'help',
                            href: 'https://project.yunser.com/products/1f286520e8f611e8aff245d55fdd8a72',
                            target: '_blank',
                            title: '帮助'
                        }
                    ]
                }
            }
        },
        computed: {
            html() {
                return `<img src="${this.result}" alt="${this.fileName}" title="${this.fileName}" />`
            },
            bbcode() {
                return `[img]${this.result}[/img]`
            },
            markdown() {
                return `![${this.fileName}](${this.result})`
            },
            markdownLink() {
                return `[![${this.fileName}](${this.result})](${this.result})`
            }
        },
        mounted() {
            this.size = this.$storage.get('size', this.size)
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
        destroyed() {
            this.clipboard.destroy()
        },
        methods: {
            resize() {
                let pattern = /\w{25,40}/
                let myPid = this.url.match(pattern)[0]
                if (!myPid) {
                    return
                }
                var picUrl = pid2url(myPid, this.size, true)
                console.log('图片地址啊')
                console.log(picUrl)
                this.result = picUrl
            },
            handleTabChange (val) {
                this.activeTab = val
            },
            handleDragEnter(e) {
                console.log('handleDragEnter')
                e.preventDefault()
            },
            handleDragLeave(e) {
                console.log('handleDragLeave')
                e.preventDefault()
            },
            dealFile(file) {
                if (file.type.indexOf('image') === -1) {
                    this.$message({
                        type: 'danger',
                        text: '上传文件格式不正确'
                    })
                    return
                }
                let reader = new FileReader()
                // let file = document.getElementById('file').files[0];
                let param = new FormData()
                param.append('iufile', file, file.name)
                param.append('ssl', true)
                console.log(param.get('file'))
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                };  //添加请求头
                this.loading = true        
                this.result = null        
                this.$http.post('https://www.17uw.cn/api/upload/weibo', param, config)
                    .then(response => {
                        console.log(response.data);
                        this.fileName = response.data.data.filename
                        this.url = response.data.data.url
                        this.resize()
                        this.loading = false
                    }, response => {
                        this.loading = false
                    })     
            },
            handleDrop(e) {
                console.log('drop')
                console.log(e)
                let file = e.dataTransfer.files[0]
                this.dealFile(file)
                e.preventDefault()
            },
            allowDrop(e) {
                e.preventDefault()
            },
            fileChange(e) {
                let files = e.target.files
                if (!files.length) {
                    return
                }
                this.dealFile(files[0])
            },
            finish() {
                window.intent.postResult(this.data)
                setTimeout(() => {
                    let owner = window.opener || window.parent
                    owner.window.close()
                }, 100)
            },
            upload() {
                let file = document.getElementById('file').files[0];           
                  let param = new FormData()
                  param.append('iufile', file, file.name)
                  param.append('chunk', '0')
                  console.log(param.get('file'))
                  let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                  };  //添加请求头
                  this.$http.post('https://www.17uw.cn/api/upload', param, config)
                    .then(response=>{
                        console.log(response.data);
                        this.fileName = response.data.data.filename
                        this.result = domain.imgApi + response.data.data.path.replace('public', '')
                    })     
            }
        },
        watch: {
            size(value) {
                this.size = value
                this.$storage.set('size', this.size)
                this.resize()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .drop-box{
        max-width: 480px;
        margin: 0 auto 24px auto;
        // margin-bottom: 24px;
        height: 180px;
        padding-top: 56px;
        border: 2px dashed #999;
        text-align: center;
        .text {
            margin-top: 24px;
            // margin-bottom: 16px;
        }
        .text2 {
            color: #999;
            // margin-top: 24px;
        }
    }
    .btn {
        margin-top: 16px;
        margin-bottom: 16px;
    }
    .ui-loading {
        width: 40px;
        margin: 0 auto;
    }
</style>
