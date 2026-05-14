<template>
  <div>
    <Header />

    <div class="productViewCont">
      <AppLoader v-show="productLoading" />

      <div v-if="!productLoading && product.id">
        <ProductBig :product="product" />

        <div class="similarSection">
          <h2>Similar products:</h2>

          <div class="similarProducts">
            <ProductTile v-for="item in similarProducts" :key="item.id" :product="item" />
          </div>
        </div>
      </div>

      <div v-if="!productLoading && productError">
        {{ productError }}
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import AppLoader from "@/components/AppLoader.vue"
import ProductTile from "@/components/ProductTile.vue"
import ProductBig from "@/components/ProductBig.vue"

export default {
  name: "ProductView",

  components: {
    Header,
    Footer,
    AppLoader,
    ProductTile,
    ProductBig,
  },

  created() {
    this.$store.dispatch("FETCH_PRODUCT", this.$route.params.id) // najpierw pobieranie produktu po id z URL
      .then(() => { // potem
        // kiedy produkt jest juz w store znamy jego kategorie
        if (this.product.category) {
            // i wtedy pobieram kategorie. najpierw produkt potem podobne
            this.$store.dispatch("FETCH_SIMILAR_PRODUCTS", {
              category: this.product.category, // serwer ma wiedziec z jakiej kategorii ma szukac podobnych
              id: this.product.id // serwer ma wykluczyc aktualnie otwarty produkt
            })
        }
      })
  },

  computed: {
    // pobiera jeden produkt ze store
    product() {
      return this.$store.getters.GET_PRODUCT_OBJECT
    },
    // steruje loaderem
    productLoading() {
      return this.$store.getters.GET_PRODUCT_LOADING
    },
    // errorek
    productError() {
      return this.$store.getters.GET_PRODUCT_ERROR
    },
    // pobiera liste podobnych produktow ze store
    similarProducts() {
      return this.$store.getters.GET_SIMILAR_PRODUCTS_LIST
    }
  }
}
</script>

<style scoped>
.productViewCont {
  width: 80%;
  margin: 30px auto 80px auto;
}

.similarSection {
  margin-top: 40px;
}

.similarSection h2 {
  font-family: Arial, Helvetica, sans-serif;
}

.similarProducts {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

@media (max-width: 768px) {
    .productViewCont {
        width: 92%;
    }
    .similarProducts {
        flex-wrap: wrap;
        justify-content: center;
    }
}
</style>