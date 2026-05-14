<template>
    <div class="promotionTile" :style="contStyle" @mousemove="mousemovePromotion" @mouseleave="mouseleavePromotion">
        <h1 class="promotionHeader"> {{ promotion.header }} </h1>
        <h3 class="promotionDescription"> {{ promotion.description }} </h3>
    </div>
</template>

<script>
export default {
    name: "PromotionTile",
    props: { promotion: Object },

    data() {
        return {
            rotateX: 0,
            rotateY: 0,
            scaleValue: 1
        }
    },

    computed: {
        contStyle() {
            const imageUrl = this.getImageUrl(this.promotion.image)

            return {
                background: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `perspective(800px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) scale(${this.scaleValue})`,
                transition: "transform 0.12s linear",
            }
        }
    },

    methods: {
        getImageUrl(image) {
            return new URL(`../assets/${image}`, import.meta.url).href
        },

        mousemovePromotion(e) {
            const rect = e.currentTarget.getBoundingClientRect()

            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const centerX = rect.width / 2
            const centerY = rect.height / 2

            this.rotateY = ((x - centerX) / centerX) * 8 
            this.rotateX = ((centerY - y) / centerY) * 8
            this.scaleValue = 1.05
        },

        mouseleavePromotion() {
            this.rotateX = 0 
            this.rotateY = 0
            this.scaleValue = 1
        }
    },
}
</script>

<style>
.promotionTile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: Arial, Helvetica, sans-serif;
    width: 1300px;
    height: 250px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
    will-change: transform;
}

.promotionHeader {
    color: white;
    font-size: 38px;
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.31);
}

.promotionDescription {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin: 0;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.51);
}
</style>