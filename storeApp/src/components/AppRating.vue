<template>
    <div class="rating">
        <span v-for="item in 5" :key="item">
            {{ item <= fullRate ? "★" : "☆" }}
        </span>
        <span class="ratesNumber">({{ ratesNumber }})</span>
    </div>
</template>

<script>
export default {
    name: "AppRating",

    props: {
        rate: Number,
        ratesNumber: Number,
    },

    computed: {
        fullRate() {
            return Math.round(this.rate)
        }
    }
}
</script>

<style scoped>
.rating {
  font-size: 20px;
  color: gold;
  margin-top: 6px;
}
.ratesNumber {
  margin-left: 6px;
  color: #333;
  font-size: 14px;
}
</style>