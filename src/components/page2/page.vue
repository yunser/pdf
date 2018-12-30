<template>
    <div class="page page-home">
        <div class="page-content">
            <slot></slot>
        </div>
        <ui-drawer :open="true" :docked="true">
            <ui-list>
                <ui-list-item title="全部文件" to="/files2"/>
                <ui-list-item title="图片" inset/>
                <ui-list-item title="文档" inset/>
                <ui-list-item title="种子" inset/>
                <ui-list-item title="视频" inset/>
                <ui-list-item title="音乐" inset/>
                <ui-list-item title="与我共享"/>
                <ui-list-item title="加星文件"/>
                <ui-list-item title="回收站" to="/trash"/>
                <ui-list-item title="已使用 0 个字节，共 15 GB"/>
            </ui-list>
        </ui-drawer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
