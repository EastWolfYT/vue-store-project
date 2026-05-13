<template>
    <RouterLink :to="`/product/${product.id}`" class="productTile" @mousemove="mousemoveProduct" @mouseleave="mouseleaveProduct" :style="{ transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleValue})` }">
            <div class="imageWrapper" :style="getImageStyle">
                <div v-if="loading" class="loaderWrapper">
                    <AppLoader class="productLoader" />
                </div>
            </div>
            <div :style="{ visibility: loading ? 'hidden' : 'visible' }" class="productName">{{ product.name }}</div>
            <div :style="{ visibility: loading ? 'hidden' : 'visible' }" class="productPrice">{{ product.price }}$</div>
            <AppRating :style="{ visibility: loading ? 'hidden' : 'visible' }" :rate="product.rate" :ratesNumber="product.ratesNumber"/>
    </RouterLink>
</template>

<script>
import AppRating from '@/components/AppRating.vue'
import AppLoader from '@/components/AppLoader.vue'

export default {
    name: "ProductTile",
    
    components: {
        AppRating,
        AppLoader,
    },

    props: {
        product: Object,
    },

    data() {
        return {
            rotateX: 0,
            rotateY: 0,
            scaleValue: 1,
            loading: true,
            imageLoaded: false
        }
    },

    computed: {
        getImageStyle() {
            return {
                backgroundImage: this.imageLoaded ? `url(${this.getImageUrl(this.product.image)})` : 'none'
            }
        }
    },

    mounted() {
        const img = new Image()

        img.onload = () => {
            setTimeout(() => {
                this.loading = false
                this.imageLoaded = true
            }, 500 + Math.random() * 1000);
        }

        img.src = this.getImageUrl(this.product.image)

    },

    methods: {
        getImageUrl(image) {
            return new URL(`../assets/${image}`, import.meta.url).href
        },

        mousemoveProduct(e) {
            const rect = e.currentTarget.getBoundingClientRect() // pobieranko pozycji i rozmiaru kafelka

            const x = e.clientX - rect.left // pozycja myszki w poziomie wewnatrz kafelka
            const y = e.clientY - rect.top // pozycja myszki w pionie wewnatrz kafelka

            const centerX = rect.width / 2 // srodek kafelka w poziomie
            const centerY = rect.height / 2 // a tu srodek kafelka w pionie

            // im dalej mysz od srodka tym wiekszy obrot kafelka
            this.rotateY = ((x - centerX) / centerX) * 8
            this.rotateX = ((centerY - y) / centerY) * 8
            this.scaleValue = 1.05 // lekkie powiekszenie jak najade
        },
        // wyzerowanko po wysciu myszki
        mouseleaveProduct() {
            this.rotateX = 0
            this.rotateY = 0
            this.scaleValue = 1
        }
    },
}
</script>

<style scoped>
.productTile {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    border-radius: 10px;
    padding: 12px 24px;
    box-shadow: 0px 0px 14px rgb(0, 0, 0, 0.5);
    will-change: transform;
    transition: transform 0.1s ease;
    position: relative;
}

.imageWrapper {
    width: 150px;
    height: 150px;
    position: relative;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: 0;
    padding: 0;
    user-select: none;
}

.loaderWrapper {
    position: absolute;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}

.productName {
    font-size: 30px;
    color: #333333;
    margin-left: 3px;
    font-weight: bold;
}

.productPrice {
    margin-top: 5px;
    font-size: 20px;
    color: #333333;
}

.productLoader {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 100px;
    height: 100px;
}
</style>