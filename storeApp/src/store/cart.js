import { getCart, postCartProduct, deleteCartProduct, updateCartProduct } from "@/api"

const cart = {
    state() {
        return {
            cartList: [],
            cartLoading: false,
            cartError: null
        }
    },

    mutations: {
        SET_CART_LIST(state, newCartList) {
            state.cartList = Array.isArray(newCartList) ? newCartList : []
        },

        SET_CART_LOADING(state, loading) {
            state.cartLoading = loading
        },

        SET_CART_ERROR(state, error) {
            state.cartError = error
        }
    },

    getters: {
        GET_CART_LIST(state) {
            return Array.isArray(state.cartList) ? state.cartList : []
        },

        GET_CART_LOADING(state) {
            return state.cartLoading
        },

        GET_CART_ERROR(state) {
            return state.cartError
        }
    },

    actions: {
        FETCH_CART({ commit }) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return getCart()
                .then((data) => {
                    commit("SET_CART_LIST", data.products || [])
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się pobrać koszyka.")
                    commit("SET_CART_LIST", [])
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        ADD_CART_PRODUCT({ commit }, productObject) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return postCartProduct(productObject)
                .then((data) => {
                    commit("SET_CART_LIST", data.products || [])
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się dodać produktu do koszyka.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        DELETE_CART_PRODUCT({ commit }, productId) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return deleteCartProduct(productId)
                .then((data) => {
                    commit("SET_CART_LIST", data.products || [])
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się usunąć produktu z koszyka.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        UPDATE_CART_PRODUCT({ commit }, { productId, quantity }) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            return updateCartProduct(productId, quantity)
                .then((data) => {
                    commit("SET_CART_LIST", data.products || [])
                })
                .catch(() => {
                    commit("SET_CART_ERROR", "Nie udało się zaktualizować produktu w koszyku.")
                })
                .finally(() => {
                    commit("SET_CART_LOADING", false)
                })
        },

        CLEAR_CART({ commit }) {
            commit("SET_CART_LOADING", true)
            commit("SET_CART_ERROR", null)

            localStorage.removeItem("vue-store-cart")
            commit("SET_CART_LIST", [])

            commit("SET_CART_LOADING", false)

            return Promise.resolve()
        }
    }
}

export default cart