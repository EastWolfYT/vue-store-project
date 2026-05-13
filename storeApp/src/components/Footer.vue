<template>
    <div class="footerDiv">
        <footer>
            <p class="footerText">Michał Pokrywka © 2026</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style>
.footerText {
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    margin-right: 20px;
}
.footerDiv {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: linear-gradient(90deg, #232526 0%, #2f2f35 100%);
    text-align: right;
}
</style>