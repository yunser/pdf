<template>
    <my-page title="文件" :page="page">
        <app-list :data="groups" />
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                groups: [
                    {
                        name: '基本',
                        apps: [
                            {
                                name: '临时网盘',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/temp'
                            },
                            {
                                name: '图床',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/image/temp'
                            },
                            {
                                name: '文件查看',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/viewer'
                            },
                        ]
                    },
                    // {
                    //     name: '其他',
                    //     apps: [
                    //         {
                    //             name: 'PDF 压缩',
                    //             desc: '',
                    //             icon: '/static/img/file.svg',
                    //             to: '/pdf/compress'
                    //         },
                    //         {
                    //             name: 'GIF 压缩',
                    //             desc: '',
                    //             icon: '/static/img/file.svg',
                    //             to: '/gif/compress'
                    //         }
                    //     ]
                    // }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'search',
                            href: 'https://search.yunser.com?utm_source=converter',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=converter',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped>
</style>
