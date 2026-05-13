import { getProduct } from "@/api"

const product = {
    state() {
        return {
            productObject: {}, // obiekt na jeden pelny produkt po id
            productLoading: false, // loading
            productError: null // errorek
        }
    },

    mutations: {
        // settery jak zawsze
        SET_PRODUCT_OBJECT(state, newProductObject) {
            state.productObject = newProductObject
        },
        SET_PRODUCT_LOADING(state, loading) {
            state.productLoading = loading
        },
        SET_PRODUCT_ERROR(state, error) {
            state.productError = error
        }
    },

    getters: {
        // gettery jak zawsze
        GET_PRODUCT_OBJECT(state) {
            return state.productObject
        },
        GET_PRODUCT_LOADING(state) {
            return state.productLoading
        },
        GET_PRODUCT_ERROR(state) {
            return state.productError
        }
    },

    actions: {
        // pobiera produkt przez getProduct(productId) i zapisuje go do store
        FETCH_PRODUCT({ commit }, productId) {
            commit("SET_PRODUCT_LOADING", true)
            commit("SET_PRODUCT_ERROR", null)

            return getProduct(productId)
                .then((data) => {
                    commit("SET_PRODUCT_OBJECT", data)
                })
                .catch(() => {
                    commit("SET_PRODUCT_ERROR", "Nie udało się pobrać produktu.")
                })
                .finally(() => {
                    commit("SET_PRODUCT_LOADING", false)
                })
        }
    }
}

export default product