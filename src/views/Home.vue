<template>
    <my-page title="PDF" :page="page">
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
                        // name: '基本',
                        apps: [
                            {
                                name: 'PDF 加密',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/encrypt'
                            }
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
                            href: 'https://search.yunser.com?utm_source=pdf',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=pdf',
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
