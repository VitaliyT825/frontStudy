<template>
    <form @submit.prevent="handleSubmit">
        <h3>Login</h3>

        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model="email" placeholder="Email"/>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="password" placeholder="Password"/>
        </div>

        <button class="btn btn-primary btn-block">Login</button>
    </form>
</template>

<script>
    import axios from "axios";
    import {authService} from "@/services/auth.service";

    export default {
        name: 'LoginItem',
        data() {
            return {
                email: '',
                password: '',
            }
        },
        methods: {
            async handleSubmit() {
                try {
                    const { data } = await axios.post('login', {
                        'email': this.email,
                        'password': this.password,
                    })

                    // await this.$store.dispatch('user', data);
                    authService.setAuthToken(data.token);
                    this.$router.push('/');
                } catch (e) {
                    await Promise.reject(e);
                }
            }
        }
    }
</script>