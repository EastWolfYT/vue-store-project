<template>
    <div class="productBig">
        <div class="productBigImageCont">
            <div class="productBigImage" :style="imageStyle"></div>
        </div>

        <div class="productBigInfo">
            <h1 class="productBigName">{{ product.name }}</h1>

            <AppRating :rate="product.rate" :ratesNumber="product.ratesNumber" />

            <p class="productBigDescription">{{ product.description }}</p>

            <h2 class="sectionTitle">Specification:</h2>
            <div class="specificationCont">
                <div><strong>size:</strong> {{ product.specification?.size }}</div>
                <div><strong>weight:</strong> {{ product.specification?.weight }}</div>
                <div><strong>battery:</strong> {{ product.specification?.battery }}</div>
                <div>
                    <strong>colors:</strong>
                    {{ product.specification?.colors?.join(", ") }}
                </div>
            </div>

            <h2 class="sectionTitle">Category:</h2>
            <div class="categoryText">{{ product.category }}</div>

            <h2 class="sectionTitle">Price:</h2>
            <div class="priceText">{{ product.price }}$</div>
            <button class="buyButton" @click="buyProduct">Buy</button>
        </div>
    </div>
</template>

<script>
import AppRating from "@/components/AppRating.vue"

export default {
    name: "ProductBig",

    components: {
        AppRating
    },

    props: {
        product: Object // komponent dostaje jeden produkt z ProductView
    },

    computed: {
        // buduje obraz tła z assets
        imageStyle() {
            return {
                backgroundImage: `url(${new URL(`../assets/${this.product.image}`, import.meta.url).href})`,
            }
        }
    },

    methods: {
        // po kliknieciu uruchamia sie metoda
        buyProduct() {
            this.$store.dispatch("ADD_CART_PRODUCT", this.product) // wysyła cały aktualny produkt do store cart a store dalej do serwera
        }
    }
}
</script>

<style scoped>
.productBig {
    display: flex;
    gap: 40px;
    padding: 28px 34px;
    font-family: Arial, Helvetica, sans-serif;
    background: white;
    border-radius: 12px;
    box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.18);
    align-items: flex-start;
}

.productBigImageCont {
    margin-top: 130px;
    width: 560px;
    min-width: 560px;
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: #f3f3f3;
    border-radius: 8px;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
}

.productBigImage {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
}

.productBigInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 6px;
}

.productBigName {
    margin: 0 0 14px 0;
    font-size: 36px;
    color: #1f3550;
    font-weight: bold;
    line-height: 1.1;
}

.productBigDescription {
    margin-top: 18px;
    margin-bottom: 18px;
    font-size: 17px;
    line-height: 32px;
    color: #444444;
    max-width: 560px;
}

.sectionTitle {
    margin: 14px 0 6px 0;
    font-size: 22px;
    color: #1f3550;
    font-weight: bold;
}

.specificationCont {
    font-size: 17px;
    line-height: 32px;
    color: #333333;
}

.categoryText,
.priceText {
    font-size: 17px;
    line-height: 30px;
    color: #333333;
}

.buyButton {
    margin-top: 16px;
    width: 110px;
    padding: 10px;
    height: 38px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.buyButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

@media (max-width: 900px) {
    .productBig {
        flex-direction: column;
    }
    .productBigImageCont {
        width: 100%;
        min-width: unset;
        margin-top: 0;
        height: 280px;
    }
    .productBigDescription {
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .productBigName {
        font-size: 26px;
    }
    .productBigImageCont {
        height: 220px;
    }
}
</style>