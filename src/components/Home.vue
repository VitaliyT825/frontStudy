<template>
    <div>
        <div v-if="user">
            <h3>Hi, {{user.name}}</h3>
            <p>Your mail is: <strong>{{user.email}}</strong></p>
        </div>

        <div v-if="!user">
            <h3>Hi, quest!</h3>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import axios from "axios";

    export default {
        name: 'HomeItem',
        computed: {
            ...mapGetters(['user'])
        },
        async created () {
            try {
                const res = await axios.get('profile');

                this.$store.dispatch('user', res.data);
            } catch (e) {
                this.user = null;
            }
        },
    }
</script>