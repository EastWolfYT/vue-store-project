import { getCart, postCartProduct, deleteCartProduct, updateCartProduct } from "@/api"

const cart = {
    state() {
        return {
            cartList: [], // lista produktów ktore aktualnie sa w koszyku
            cartLoading: false, // stan ladowania koszyka
            cartError: null // errorek
        }
    },

    mutations: {
        // ustawia nowa liste koszyka
        SET_CART_LIST(state, newCartList) {
            state.cartList = newCartList
        },
        // ustawia ladowanko
        SET_CART_LOADING(state, loading) {
            state.cartLoading = loading
        },
        // ustawia errorek
        SET_CART_ERROR(state, error) {
            state.cartError = error
        }
    },

    getters: {
        // zwraca liste koszyka
        GET_CART_LIST(state) {
            return state.cartList
        },
        // zwraca stan loadingu
        GET_CART_LOADING(state) {
            return state.cartLoading
        },
        // zwraca errorek
        GET_CART_ERROR(state) {
            return state.cartError
        }
    },

    actions: {
        // pobiera caly koszyk z serwera
        FETCH_CART({ commit }) {
            commit("SET_CART_LOADING", true) // ustawia loading na true
            commit("SET_CART_ERROR", null) // czysci blad

            return getCart()
                .then((data) => {
                    commit("SET_CART_LIST", data.products) // jak sie uda to wpisuje produkty do carList
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się pobrać koszyka.") // jak sie nie uda to errorek
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false) // loading na false
                })
        },

        // dodaje produkt do koszyka, productObject to caly produkt ktory chce dodac
        ADD_CART_PRODUCT({ commit }, productObject) {
            commit("SET_CART_LOADING", true) // wlaczanie loadingu
            commit("SET_CART_ERROR", null) // czyszczenie errorka

            // wysyla produkt do serwera
            return postCartProduct(productObject)
                .then((data) => {
                    commit("SET_CART_LIST", data.products) // serwer odsyla nowy stan koszyka a store wpisuje go do carList
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się dodać produktu do koszyka.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        // usuwa produkt z koszyka po productId ktory chce usunac
        DELETE_CART_PRODUCT({ commit }, productId) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return deleteCartProduct(productId)
                .then((data) => {
                    commit("SET_CART_LIST", data.products)
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się usunąć produktu z koszyka.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        // zmienia ilosc produktu w koszyku, productId to produkt ktory sie zmienia a quantity to ile sztuk
        UPDATE_CART_PRODUCT({ commit }, { productId, quantity }) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return updateCartProduct(productId, quantity)
                .then((data) => {
                    commit("SET_CART_LIST", data.products)
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się zaktualizować produktu w koszyku.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        // clearuje mi koszyk
        CLEAR_CART({ state, dispatch }) {
            // bierze mi id z koszyka ...new Set usuwa duplikaty
            // uniqueIds ma unikalne duplikaty
            const uniqueIds = [...new Set(state.cartList.map(product => product.id))]

            const promises = uniqueIds.map(productId => {
                // każdy produkt ustawia na 0 sztuk czyli usuwa z koszyka
                return dispatch("UPDATE_CART_PRODUCT", {
                    productId,
                    quantity: 0
                })
            })

            return Promise.all(promises)
        }
    }
}

export default cart