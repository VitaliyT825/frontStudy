<template>
    <div>
        <h3 v-if="user">Hi, {{user.name}}</h3>
        <h3 v-if="!user">Hi quest!</h3>
    </div>
</template>

<script>
    export default {
        name: 'HomeItem',
        props: ['user'],
    }
</script>