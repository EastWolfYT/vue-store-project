import { getSimilarProducts } from "@/api"

const similarProducts = {
    state() {
        return {
            similarProductsList: [], // lista podobnych produktow
            similarProductsLoading: false, // loading
            similarProductsError: null // errorek
        }
    },

    mutations: {
        // settery
        SET_SIMILAR_PRODUCTS_LIST(state, newSimilarProductsList) {
            state.similarProductsList = newSimilarProductsList
        },
        SET_SIMILAR_PRODUCTS_LOADING(state, loading) {
            state.similarProductsLoading = loading
        },
        SET_SIMILAR_PRODUCTS_ERROR(state, error) {
            state.similarProductsError = error
        }
    },

    getters: {
        // gettery
        GET_SIMILAR_PRODUCTS_LIST(state) {
            return state.similarProductsList
        },
        GET_SIMILAR_PRODUCTS_LOADING(state) {
            return state.similarProductsLoading
        },
        GET_SIMILAR_PRODUCTS_ERROR(state) {
            return state.similarProductsError
        }
    },

    actions: {
        // pobiera podobne produkty dopiero wtedy kiedy zna sie kategorię aktualnego produktu
        FETCH_SIMILAR_PRODUCTS({ commit }, {category, id}) {
            commit("SET_SIMILAR_PRODUCTS_LOADING", true)
            commit("SET_SIMILAR_PRODUCTS_ERROR", null)

            return getSimilarProducts(category, id)
                .then((data) => {
                    commit("SET_SIMILAR_PRODUCTS_LIST", data)
                })
                .catch(() => {
                    commit("SET_SIMILAR_PRODUCTS_ERROR", "Nie udało się pobrać podobnych produktów.")
                })
                .finally(() => {
                    commit("SET_SIMILAR_PRODUCTS_LOADING", false)
                })
        }
    }
}

export default similarProducts