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
                        name: '基本',
                        apps: [
                            {
                                href: 'https://pdf-viewer.yunser.com/web/viewer.html',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 阅读器',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/image.html',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 转图片',
                                description: ''
                            },
                            {
                                name: 'PDF 加密',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/encrypt'
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/image2pdf/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: '图片转 PDF',
                                description: ''
                            },
                        ]
                    },
                    {
                        name: '编辑',
                        apps: [
                            {
                                href: 'https://demos.yunser.com/pdf/merge/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 合并',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/edit/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 信息修改',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/split/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 分割',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/remove/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 删除',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/rotate/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 旋转',
                                description: ''
                            },
                            {
                                href: 'https://demos.yunser.com/pdf/bookmark/',
                                to: 'xxx',
                                target: '_blank',
                                icon: '/static/img/file.svg',
                                name: 'PDF 书签',
                                description: ''
                            },
                        ]
                    },
                    {
                        name: '其他',
                        apps: [
                            {
                                name: 'PDF 生成',
                                desc: '',
                                icon: '/static/img/file.svg',
                                to: '/make'
                            },
                        ]
                    },
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
