<template>
    <div class="loaderCont">
        <img src="@/assets/loader.gif" alt="loader" class="loader">
    </div>
</template>

<script>
export default {
    name: "AppLoader"
}
</script>

<style scoped>
.loaderCont {
    display: flex;
    justify-content: center;
    align-items: center;
}

.loader {
    width: 150px;
    height: 150px;
    display: block;
}
</style>