<template>
    <div>
        <Header />
        <div>
            <div class="loaderWrapper">
                <AppLoader v-show="promotionLoading" />
            </div>

            <div v-if="!promotionLoading && promotionObject.header">
                <div class="promoTop" :style="topStyle">
                    <h1>{{ promotionObject.header }}</h1>
                    <h3>{{ promotionObject.description }}</h3>
                </div>

                <div class="promoLongDescription">
                    <p>{{ promotionObject.longDescription }}</p>
                </div>

                <div class="promoFinish">
                    <span>Promotion ends: {{ promotionFinishText }} </span>
                </div>

                <div class="promoProducts">
                    <ProductTile v-if="!promotionLoading" v-for="product in promotionObject.items" :key="product.id"
                        :product="product" />
                </div>
            </div>


            <div v-if="!promotionLoading && promotionError">
                {{ promotionError }}
            </div>


        </div>
        <Footer />
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AppLoader from '@/components/AppLoader.vue'
import ProductTile from '@/components/ProductTile.vue'

export default {
    name: "PromotionView",
    components: {
        Header,
        Footer,
        AppLoader,
        ProductTile,
    },

    // uruchamia sie przy tworzeniu widoku
    created() {
        this.$store.dispatch("FETCH_PROMOTION", this.$route.params.id) // pobieranie danych wybranej promocji, a this.$route.params.id bierze id z adresu
    },

    computed: {
        // pobiera gotowy obiekt promocji ze store
        promotionObject() {
            return this.$store.getters.GET_PROMOTION_OBJECT
        },
        // pobiera stan ładowania
        promotionLoading() {
            return this.$store.getters.GET_PROMOTION_LOADING
        },
        // pobiera error
        promotionError() {
            return this.$store.getters.GET_PROMOTION_ERROR
        },

        topStyle() {
            return {
                backgroundImage: `url(${new URL(`../assets/${this.promotionObject.image}`, import.meta.url).href})`,
            }
        },

        promotionFinishText() {
            if (this.promotionObject.finishCondition) {
                return this.promotionObject.finishCondition
            }

            if (this.promotionObject.finishDate) {
                return new Date(this.promotionObject.finishDate).toLocaleDateString("en-GB")
            }

            return ""
        }

    }
}
</script>

<style scoped>
body {
    font-family: Arial, Helvetica, sans-serif;
}

.promoTop {
    width: 100%;
    height: 250px;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}

.promoTop h1 {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    text-shadow: 2px 2px 10px rgba(0, 0, 0);
    text-decoration: underline;
}

.promoTop h3 {
    font-family: Arial, Helvetica, sans-serif;
    text-shadow: 2px 2px 10px rgba(0, 0, 0);
}

.promoLongDescription {
    width: 70%;
    margin: 25px auto;
    font-size: 14px;
    line-height: 22px;
    font-family: Arial, Helvetica, sans-serif;
    color: #333;
}

.promoFinish {
    width: 70%;
    margin: 0 auto 30px auto;
    background: #e8e8e8;
    padding: 10px 14px;
    text-align: right;
    font-size: 13px;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    color: #444;
}

.promoProducts {
    width: 70%;
    margin: 0 auto 40px auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-family: Arial, Helvetica, sans-serif;
}

.loaderWrapper {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}

@media (max-width: 900px) {
    .promoLongDescription,
    .promoFinish,
    .promoProducts {
        width: 90%;
    }
    .promoProducts {
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }
}

@media (max-width: 480px) {
    .promoLongDescription,
    .promoFinish,
    .promoProducts {
        width: 96%;
    }
    .promoTop h1 {
        font-size: 22px;
    }
    .promoTop h3 {
        font-size: 15px;
    }
}
</style>