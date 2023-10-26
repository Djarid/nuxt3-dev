<template>
    <div>
        <h1>Login</h1>
        <button @click="doLogin">Sign in with Azure AD</button>
    </div>
</template>


<script>
import { login } from '@/plugins/auth';

export default {
    methods: {
        async doLogin() {
            try {
                const account = await login();
                this.$router.push("/");
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>


<style scoped>

</style>
