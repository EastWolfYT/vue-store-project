<template>
    <div>
        <Header />
        <div>
          <!-- :to jest po to żeby każda promocja dostała swój własny link  -->
          <!-- v-bind:promotion="promotion" przekazuje do komponentu cały obiekt promocji -->
          <div class="promotionCont">
            <RouterLink v-for="promotion in promotionsList" :to="`/promotion/${promotion.id}`" :key="promotion.id" class="promotionLink">
              <PromotionTile v-bind:promotion="promotion"/>
            </RouterLink>
          </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import PromotionTile from "@/components/PromotionTile.vue"

export default {
  name: "HomeView",
  components: {
    Header,
    Footer,
    PromotionTile
  },

  // uruchamianie akcji ze store po załadowaniu widoku
  mounted() {
    this.$store.dispatch("FETCH_PROMOTIONS")
  },

  // pobieranie listy promocji ze store do komponentu
  computed: {
    promotionsList() {
      return this.$store.getters.GET_PROMOTIONS_LIST
    }
  }
}
</script>

<style>
.promotionLink {
  text-decoration: none;
}
.promotionCont {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin: 80px 0;
}
</style>