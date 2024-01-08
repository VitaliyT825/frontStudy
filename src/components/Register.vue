<template>
    <form @submit.prevent="handleSubmit">
        <h3>Sign up</h3>

        <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" v-model="name" placeholder="Your name">
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model="email" placeholder="Your mail">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="password" placeholder="Your password">
        </div>

        <button class="btn btn-primary btn-block">Sign up</button>
    </form>
</template>

<script>

    import axios from "axios";
    import {authService} from "@/services/auth.service";

    export default {
        name: 'RegisterItem',
        data() {
            return {
                name: '',
                email: '',
                password: ''
            }
        },
        methods: {
            async handleSubmit() {
                try {
                    const { data } = await axios.post('register', {
                        'name': this.name,
                        'email': this.email,
                        'password': this.password
                    });

                    authService.setAuthToken(data.token);
                    this.$router.push('/');
                } catch (e) {
                    return Promise.reject(e);
                }
            }
        }
    }

</script>