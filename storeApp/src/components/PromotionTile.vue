<template>
    <div class="promotionTile" :style="contStyle" @mousemove="mousemovePromotion" @mouseleave="mouseleavePromotion">
        <h1 class="promotionHeader"> {{ this.promotion.header }} </h1>
        <h3 class="promotionDescription"> {{ this.promotion.description }} </h3>
    </div>
</template>

<script>
export default {
    name: "PromotionTile",
    props: { promotion: Object }, // komponent nie pobiera danych sam ze store tylko dostaje jedną promocję z rodzica przez props

    data() {
        return {
            rotateX: 0, // reagowanie ruchu góra-dół
            rotateY: 0, // reagowanie ruchu lewo-prawo
            scaleValue: 1 // lekkie powiększenie podczas hovera
        }
    },

    computed: {
        // to computed buduje styl tła
        contStyle() {
            const { image } = this.promotion // wyciągamy nazwę obrazka z obiektu promotion
            let imageUrl;

            try {
                imageUrl = `/src/assets/${image}` // ścieżka do obrazka w assetsach
                console.log("image", image);
                console.log("imageUrl", imageUrl);
            } catch (e) {
                console.log(e)
            }

            return {
                background: `url(${imageUrl})`, // zwracanko stylu tła
                backgroundSize: "cover", // obrazek wypełnia cały kafelek
                backgroundPosition: "center", // srodek obrazka w tle
                transform: `perspective(800px) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg) scale(${this.scaleValue})`, // obrot i powiekszanie
                transition: "transform 0.12s linear", // plynniejsza animacja piekna
            }
        }
    },

    methods: {
        mousemovePromotion(e) {
            const rect = e.currentTarget.getBoundingClientRect() // pobieranko pozycji i rozmiaru kafelka

            const x = e.clientX - rect.left // pozycja myszki w poziomie wewnatrz kafelka
            const y = e.clientY - rect.top // pozycja myszki w pionie wewnatrz kafelka

            const centerX = rect.width / 2 // srodek kafelka w poziomie
            const centerY = rect.height / 2 // a tu srodek kafelka w pionie

            // im dalej mysz od srodka tym wiekszy obrot kafelka
            this.rotateY = ((x - centerX) / centerX) * 8 
            this.rotateX= ((centerY - y) / centerY) * 8
            this.scaleValue = 1.05 // lekkie powiekszenie jak najade
        },
        // wyzerowanko po wysciu myszki
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