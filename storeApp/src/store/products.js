import { getProducts } from "@/api"

const products = {
    state() {
        return {
            productsList: [],
            totalProducts: 0,
            productsLoading: false,
            productsError: null,
        }
    },
    
    mutations: {
        SET_PRODUCTS_LIST(state, newProductsList) {
            state.productsList = newProductsList
        },

        SET_TOTAL_PRODUCTS(state, total) {
            state.totalProducts = total
        },

        SET_PRODUCTS_LOADING(state, loading) {
            state.productsLoading = loading
        },

        SET_PRODUCTS_ERROR(state, error) {
            state.productsError = error
        },
    },

    getters: {
        GET_PRODUCTS_LIST(state) {
            return state.productsList
        },

        GET_TOTAL_PRODUCTS(state) {
            return state.totalProducts
        },

        GET_PRODUCTS_LOADING(state) {
            return state.productsLoading
        },

        GET_PRODUCTS_ERROR(state) {
            return state.productsError 
        },
    },

    actions: {
        // akcja asynchroniczna odpowiedzialna za pobieranie danych
        // options = {} oznacza ze jesli nic nie przekaze to pobiera wszystko a jesli przekaze obiekt z filtrami to pobiera wyniki wyszukiwania
        FETCH_PRODUCTS({ commit }, options = {}) {

            // info dla store że ładowanie się zaczęło
            commit("SET_PRODUCTS_LOADING", true)
            // czysci poprzedni blad przed nowym wyszukiwaniem
            commit("SET_PRODUCTS_ERROR", null)

            return getProducts(options) // wywołanie (teraz zwracanie bo teraz korzysta z nowego api które buduje query params) funkcji z api ktora pobiera dane z serwera
                // jak sie uda to zapisze dane do store
                .then(response => {
                    commit("SET_PRODUCTS_LIST", response.data) // produkty z aktualnej strony
                    commit("SET_TOTAL_PRODUCTS", response.total) // pełna liczba produktów pasujących do filtrów 
                })
                // jak znajdzie blad no to errorek i idzie blad do store
                .catch(error => {
                    commit("SET_PRODUCTS_ERROR", "server error!!!")
                })
                // nie wazne co sie stanie i tak sie skonczy ten loading 
                .finally(() => {
                    commit("SET_PRODUCTS_LOADING", false)
                })

        }
    }
}

export default products