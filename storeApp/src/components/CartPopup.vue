<template>
    <div class="cartPopupWrapper" ref="popupWrapper">
        <button class="cartToggleButton" @click="togglePopup">
            {{ cartItemsCount ? `${cartItemsCount} items` : "Cart" }}
        </button>

        <div v-if="isVisible" class="cartPopup">
            <div v-if="groupedCart.length">
                <div
                    v-for="product in groupedCart"
                    :key="product.id"
                    class="cartPopupRow"
                >
                    <div class="cartPopupLeft">
                        <div class="cartMiniImage" :style="getImageStyle(product.image)"></div>

                        <div class="cartPopupNamePrice">
                            <div class="cartPopupName">{{ product.name }}</div>
                            <div class="cartPopupPrice">{{ product.price }}$</div>
                        </div>
                    </div>

                    <div class="cartPopupMiddle">
                        <button class="quantityButton" @click="decreaseQuantity(product)">-</button>
                        <span class="quantityValue">{{ product.quantity }}</span>
                        <button class="quantityButton" @click="increaseQuantity(product)">+</button>
                    </div>

                    <div class="cartPopupRight">
                        <button class="removeButton" @click="removeProduct(product.id)">Remove</button>
                    </div>
                </div>

                <div class="popupSummary">
                    Total sum: {{ totalPrice }}$
                </div>

                <div class="checkoutCont">
                    <button class="checkoutButton" @click="goToCart">Checkout</button>
                </div>
            </div>

            <div v-else class="emptyCartInfo">
                Cart is empty
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CartPopup",

    data() {
        return {
            isVisible: false // czy popup koszyka jest aktualnie otwarty czy zamkniety
        }
    },

    created() {
        this.$store.dispatch("FETCH_CART") // od razu po stworzeniu komponentu pobieranko aktualnego koszyka ze store/serwera
    },

    // nasłuchuje kliknięcia wszędzie na stronie
    mounted() {
        document.addEventListener("click", this.handleClickOutside)
    },

    // nasłuchuje kliknięcia wszędzie na stronie
    beforeUnmount() {
        document.removeEventListener("click", this.handleClickOutside)
    },

    computed: {
        // pobiera cala liste produktow z koszyka ze store
        cartList() {
            return this.$store.getters.GET_CART_LIST
        },

        // grupowanie tych samych produktow po id zeby zamiast wielu takich samych obiektow byl jeden z quantity
        groupedCart() {
            const grouped = {} // pusty obiekt pomocniczy do grupowania produktow

            this.cartList.forEach(product => {
                // jak danego produktu jeszcze nie ma w grouped to tworzymy nowy wpis
                if (!grouped[product.id]) {
                    grouped[product.id] = {
                        ...product, // kopiuje wszystkie pola produktu
                        quantity: 1 // i ustawia startowa ilosc na 1
                    }
                } 
                // a jak juz jest to zwieksza ilosc
                else {
                    grouped[product.id].quantity++
                }
            })

            return Object.values(grouped) // zamiana obiektu grouped na tablice obiektow
        },

        // liczenie calkowitej sumy wszystkich produktow z uwzglednieniem ich ilosci
        totalPrice() {
            return this.groupedCart
                .reduce((sum, product) => sum + (product.price * product.quantity), 0)
                .toFixed(0)
        },

        // liczy ile jest roznych produktow w koszyku czyli ile itemow ma pokazac na buttonie
        cartItemsCount() {
            return this.groupedCart.length
        }
    },

    methods: {
        // pokazuje albo chowa popup koszyka
        togglePopup() {
            this.isVisible = !this.isVisible
        },

        // buduje styl tla dla miniaturki obrazka produktu
        getImageStyle(image) {
            return {
                backgroundImage: `url(${new URL(`../assets/${image}`, import.meta.url).href})`
            }
        },

        // zwieksza ilosc danego produktu o 1
        increaseQuantity(product) {
            this.$store.dispatch("UPDATE_CART_PRODUCT", {
                productId: product.id,
                quantity: product.quantity + 1
            })
        },

        // zmniejsza ilosc produktu o 1 ale tylko jak jest wiecej niz 1
        decreaseQuantity(product) {
            if (product.quantity > 1) {
                this.$store.dispatch("UPDATE_CART_PRODUCT", {
                    productId: product.id,
                    quantity: product.quantity - 1
                })
            }
        },

        // usuwa calkowicie produkt z koszyka ustawiajac jego ilosc na 0
        removeProduct(productId) {
            this.$store.dispatch("UPDATE_CART_PRODUCT", {
                productId,
                quantity: 0
            })
        },

        // zamyka popup i przekierowuje usera na widok koszyka
        goToCart() {
            this.isVisible = false
            this.$router.push("/cart")
        },

        handleClickOutside(event) {
            const wrapper = this.$refs.popupWrapper

            // !wrapper.contains(event.target) sprawdza czy kliknięcie było wewnątrz popupu i buttona to wtedy nic sie nie zamyka a jak poza popupem to sie zamyka
            if (this.isVisible && wrapper && !wrapper.contains(event.target)) {
                this.isVisible = false
            }
        },
    }
}
</script>

<style scoped>
.cartPopupWrapper {
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
}

.cartToggleButton {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 78px;
    padding: 10px 14px;
    height: 37.5px;
    border: none;
    border-radius: 15px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
    margin-right: 10px;
}

.cartToggleButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.cartPopup {
    position: absolute;
    top: 52px;
    right: 0;
    width: 470px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
    padding: 18px;
    z-index: 3000;
    border: 1px solid #e7ebf0;
}

.cartPopupRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: #f4f7fb;
    border: 1px solid #e4e9f0;
    border-radius: 12px;
    padding: 12px 12px;
    margin-bottom: 12px;
}

.cartPopupLeft {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1.4;
    min-width: 0;
}

.cartMiniImage {
    width: 46px;
    height: 34px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 6px;
    flex-shrink: 0;
    background-color: #eef2f7;
}

.cartPopupNamePrice {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.cartPopupName {
    color: #1f3550;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.1;
}

.cartPopupPrice {
    color: #44576b;
    font-size: 14px;
}

.cartPopupMiddle {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantityButton {
    width: 34px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.quantityButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.quantityValue {
    min-width: 18px;
    text-align: center;
    color: #1f3550;
    font-size: 16px;
    font-weight: bold;
}

.cartPopupRight {
    display: flex;
    justify-content: flex-end;
    min-width: 82px;
}

.removeButton {
    width: 78px;
    height: 34px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 13px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.removeButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.popupSummary {
    border-top: 1px solid #d9e0e8;
    margin-top: 14px;
    padding-top: 16px;
    text-align: center;
    color: #1f3550;
    font-size: 24px;
    font-weight: bold;
}

.checkoutCont {
    display: flex;
    justify-content: center;
    margin-top: 14px;
}

.checkoutButton {
    width: 120px;
    height: 38px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.checkoutButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.emptyCartInfo {
    text-align: center;
    color: #44576b;
    font-size: 17px;
    padding: 18px 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>