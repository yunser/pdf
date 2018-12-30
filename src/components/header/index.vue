<template>
    <header class="page-header">
        <ui-appbar :title="title">
            <ui-icon-button icon="menu" slot="left"/>
            <!--<ui-flat-button label="expand_more" slot="right"/>-->
            <!--<ui-icon-button icon="expand_more" slot="right"/>-->
        </ui-appbar>
    </header>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props: {
            title: {
                type: String,
                default: '云设云盘'
            }
        },
        mounted() {
        },
        methods: {
        }
    }
</script>
