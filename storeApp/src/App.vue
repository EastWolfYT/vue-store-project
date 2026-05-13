<template>
    <div>
        <RouterView :key="$route.path" />
    </div>
</template>

<script>
export default {
    // uruchamia się bardzo wcześnie jeszcze przed normalnym tworzeniem widoku.
    beforeCreate() {
        this.$store.dispatch("FETCH_CURRENT_USER") // apKA od razu przy starcie sprawdza czy user już jest w store a jeśli nie to czy serwer ma cookie i może zwrócić zalogowanego usera dzięki temu po odswiezeniu strony user może nadal być zalogowany
    },
}
</script>

<style>

</style>