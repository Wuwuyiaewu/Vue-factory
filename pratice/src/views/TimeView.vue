<template>
    <h2>this is time value </h2>
    <span>{{Time}}</span>
</template>

<script>
export default {
    computed:{
        Time(){
            return this.$store.state.time_change
        }
    }
}
</script>

<style>

</style>