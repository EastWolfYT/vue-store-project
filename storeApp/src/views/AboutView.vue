<template>
  <div class="about">
    <Header />
    <h1 class="aboutText">This is an about page</h1>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
  name: "AboutView",
  components: {
    Header,
    Footer
  }
}
</script>

<style>
.aboutText {
  color: #333333;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}
</style>
