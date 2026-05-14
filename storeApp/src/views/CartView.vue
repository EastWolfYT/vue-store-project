<template>
    <div>
        <Header />

        <div class="cartViewCont">
            <div v-if="!paymentCompleted" class="cartBox">
                <p class="stepInfo">Step: {{ step }} / 3</p>

                <div v-if="step === 1" class="singleStepCont">
                    <h2>Cart</h2>
                    <p class="stepDescription">Confirm your product list</p>

                    <div v-if="groupedCart.length">
                        <div
                            v-for="product in groupedCart"
                            :key="product.id"
                            class="cartProductRow"
                        >
                            <div class="cartProductLeft">
                                <div class="cartProductName">
                                    {{ product.name }} (x{{ product.quantity }})
                                </div>
                            </div>

                            <div class="cartProductCenter">
                                Unit price: {{ product.price }} $
                            </div>

                            <div class="cartProductRight">
                                <span class="cartProductTotal">
                                    Total: {{ (product.price * product.quantity).toFixed(2) }} $
                                </span>
                                <button class="removeButton" @click="removeProduct(product.id)">Remove</button>
                            </div>
                        </div>

                        <div class="cartSummary">
                            Total: {{ totalPrice }} $
                        </div>
                    </div>

                    <div v-else class="emptyCartInfo">
                        Cart is empty
                    </div>
                </div>

                <div v-if="step === 2" class="singleStepCont">
                    <h2>Delivery</h2>
                    <p class="stepDescription">Tell us where to deliver your products</p>

                    <div class="deliveryForm">
                        <input v-model="fullName" type="text" placeholder="Full name" />
                        <input v-model="address" type="text" placeholder="Address" />
                        <input v-model="city" type="text" placeholder="City" />
                        <input v-model="phone" type="number" placeholder="Phone number" />
                    </div>
                </div>

                <div v-if="step === 3" class="singleStepCont">
                    <h2>Payment</h2>
                    <p class="stepDescription">Choose payment methods</p>

                    <button
                        class="paymentButton"
                        :class="{ activePayment: paymentMethod === 'outside' }"
                        @click="paymentMethod = 'outside'"
                    >
                        Outside payment
                    </button>
                </div>

                <div class="buttonsCont">
                    <button @click="previous" :disabled="step === 1">Back</button>
                    <button 
                        @click="next" 
                        :disabled="(step === 1 && !groupedCart.length) || (step === 2 && deliveryDisabled) || (step === 3 && paymentDisabled)"
                    >
                        {{ step === 3 ? "Finish" : "Next" }}
                    </button>
                </div>
            </div>

            <div v-if="paymentCompleted" class="thankYouBox">
                <h2>Thank you</h2>
                <p>Your order has been completed.</p>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
    name: "CartView",

    components: {
        Header,
        Footer
    },

    // przy wejściu do CartView pobiera koszyk ze store/serwera
    created() {
        this.$store.dispatch("FETCH_CART")
    },

    data() {
        return {
            step: 1, // aktualny krok koszyk, 1 = cart, 2 = delivery, 3 = payment
            paymentCompleted: false, // paymentCompleted na false
            fullName: "", // pelne imie
            address: "", // adres
            city: "", // miasto
            phone: "", // numer tel
            paymentMethod: "", // metoda platnosci
        }
    },

    computed: {
        // pobiera liste produktow koszyka
        cartList() {
            return this.$store.getters.GET_CART_LIST
        },

        // liczy sume wszystkich cen
        totalPrice() {
            return this.groupedCart
                .reduce((sum, product) => sum + product.price * product.quantity, 0)
                .toFixed(2)
        },

        groupedCart() {
            // pusty obiekt pomocniczy
            const grouped = {}

            // po kazdym produkcie petelka jeden po drugim
            this.cartList.forEach(product => {
                // czy w obiekcie grouped nie ma jeszcze produktu o tym id
                if (!grouped[product.id]) {
                    // dodaje do grouped nowy wpis pod kluczem id produktu
                    grouped[product.id] = {
                        ...product, // kopiuje wszystkie pola z obiektu product
                        quantity: 1
                    }
                } else {
                    grouped[product.id].quantity++ // jak produkt juz byl do zwieksza sie ilosc
                }
            })

            // zamienia obiekt na tablicę
            return Object.values(grouped)
        },

        deliveryDisabled() {
            return !this.fullName || !this.address || !this.city || !this.phone
        },

        paymentDisabled() {
            return !this.paymentMethod
        }
    },

    methods: {
        next() {

            // jesli jest 1 krok i wylaczone delivery to zwroc
            if (this.step === 1 && !this.groupedCart.length) {
                return
            }

            // jesli jest 2 krok i wylaczone delivery to zwroc
            if (this.step === 2 && this.deliveryDisabled) {
                return
            }

            // jesli jest 3 krok i wylaczone delivery to zwroc
            if (this.step === 3 && this.paymentDisabled) {
                return
            }

            // jesli kolejny krok jest mniejszy od 3 to sie zwieksza
            if (this.step < 3) {
                this.step++
            } 
            // a jak jest rowny 3 to konczy caly proces i usuwa z koszyka
            else {
                this.$store.dispatch("CLEAR_CART")
                    .then(() => {
                        this.paymentCompleted = true
                    })
                }
        },

        previous() {
            // cofa o jeden krok ale nie nizej niz 1
            if (this.step > 1) {
                this.step--
            }
        },

        // usuwanie produktu po id
        removeProduct(productId) {
            const productToRemove = this.groupedCart.find(product => product.id === productId)

            if (productToRemove) {
                this.$store.dispatch("UPDATE_CART_PRODUCT", {
                    productId,
                    quantity: 0
                })
            }
        },
    }
}
</script>

<style scoped>
.cartViewCont {
    width: 82%;
    margin: 40px auto 80px auto;
    font-family: Arial, Helvetica, sans-serif;
}

.cartBox {
    background: transparent;
    padding: 0;
    border-radius: 0;
    box-shadow: none;
}

.stepInfo {
    text-align: center;
    font-size: 20px;
    margin-bottom: 14px;
    color: #1f3550;
}

.singleStepCont {
    width: 92%;
    margin: 0 auto;
    text-align: center;
}

.singleStepCont h2 {
    margin: 0 0 8px 0;
    font-size: 34px;
    color: #1f3550;
    font-weight: bold;
}

.stepDescription {
    margin-bottom: 26px;
    font-size: 18px;
    color: #44576b;
}

.cartProductRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin-bottom: 8px;
    background: #efefef;
    text-align: left;
    min-height: 62px;
}

.cartProductLeft {
    flex: 1.1;
    display: flex;
    align-items: center;
    padding-left: 18px;
}

.cartProductCenter {
    flex: 1;
    text-align: center;
    font-size: 16px;
    color: #1f3550;
    font-weight: bold;
}

.cartProductRight {
    flex: 1;
    text-align: right;
    font-size: 16px;
    color: #1f3550;
    font-weight: bold;
    padding-right: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 14px;
}

.cartProductName {
    font-size: 18px;
    color: #2c6fb2;
    font-weight: bold;
}

.cartProductTotal {
    white-space: nowrap;
}

.cartSummary {
    margin-top: 10px;
    padding: 16px 18px 0 18px;
    border-top: 2px solid #8a96a3;
    text-align: right;
    font-size: 22px;
    font-weight: bold;
    color: #1f3550;
}

.removeButton {
    width: 78px;
    padding: 8px;
    height: 34px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 13px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
    flex-shrink: 0;
}

.removeButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.emptyCartInfo {
    margin-top: 20px;
    color: #555;
    font-size: 20px;
}

.buttonsCont {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-top: 32px;
}

.buttonsCont button {
    width: 100px;
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

.buttonsCont button:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.buttonsCont button:disabled {
    background: #d9d9d9;
    cursor: default;
    transform: scale(1);
}

.thankYouBox {
    text-align: center;
    margin-top: 80px;
}

.thankYouBox h2 {
    margin: 0;
    color: #1f3550;
    font-size: 32px;
}

.deliveryForm {
    width: 420px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.deliveryForm input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1px solid #b9c0c7;
    border-radius: 4px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
}

.paymentButton {
    width: 140px;
    height: 42px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.paymentButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

.activePayment {
    box-shadow: 0 0 0 3px rgba(62, 126, 255, 0.22);
}

.thankYouBox p {
    margin-top: 12px;
    font-size: 20px;
    color: #44576b;
}

@media (max-width: 600px) {
    .cartViewCont {
        width: 96%;
    }
    .deliveryForm {
        width: 100%;
    }
    .cartProductRow {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        padding: 10px 12px;
    }
    .cartProductCenter,
    .cartProductRight {
        text-align: left;
        padding-right: 0;
    }
    .cartProductRight {
        justify-content: flex-start;
    }
}
</style>