<template>
    <div class="page page-home">
        <header class="page-header">
            <ui-appbar title="登录">
                <ui-icon-button icon="arrow_back_ios" slot="left" @click="$router.go(-1)" />
            </ui-appbar>
        </header>
        <main class="page-body">
            <div class="login-box">
                <div>
                    <ui-text-field v-model="account" label="邮箱" labelFloat/>
                </div>
                <div>
                    <ui-text-field v-model="password" label="密码" labelFloat/>
                </div>
                <div>
                    <router-link to="/">忘记密码</router-link>
                    <router-link to="/register">立即注册</router-link>
                </div>
                <ui-raised-button class="login-btn" label="登录" primary @click="login"/>
            </div>
        </main>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                account: '1418503647@qq.com',
                password: '1'
            }
        },
        mounted() {
        },
        methods: {
            login() {
                this.$http.post('/login', {
                    account: this.account,
                    password: this.password
                })
                    .then(response => {
                        let data = response.data
                        console.log(data)
                        this.$storage.set('user', data.user)
                        this.$storage.set('accessToken', data.accessToken)
                        this.redirect()
                    },
                    response => {
                        console.log(response)
                    })
            },
            // 跳转
            redirect() {
                let params = this.$qs.parse(location.search.replace('?', ''))
                if (params.redirect) {
                    let redirectUrl = decodeURIComponent(params.redirect)
                    if (redirectUrl.match(/^http/)) {
                        location.href = redirectUrl
                    } else {
                        this.$router.push(redirectUrl)
                    }
                } else {
                    this.$router.push('/')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-box {
        margin: 100px auto;
        width: 320px;
        padding: 16px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
        .login-btn {
            width: 100%;
        }
    }
    @media screen and (max-width: 600px) {
        .login-box {
            box-shadow: none;
        }
    }
</style>
