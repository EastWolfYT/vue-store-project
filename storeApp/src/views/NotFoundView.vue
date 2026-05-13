<template>
    <div class="notFound">
        <Header />
        <h1 class="notFoundText">Page not found</h1>
        <p class="notFoundText">Check out our current <RouterLink to="/">promotions</RouterLink></p>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
    name: "NotFoundView",
    components: {
        Header,
        Footer
    }
}
</script>

<style>
.notFoundText {
    color: #333333;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
}
</style>