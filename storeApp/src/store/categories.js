import { getCategories } from "@/api"

const categories = {
    state() {
        return {
            categoriesList: [], // tablica kategorii z serwera
            categoriesLoading: false, // czy trwa pobieranie kategorii
            categoriesError: null // errorek
        }
    },

    mutations: {
        SET_CATEGORIES_LIST(state, newCategoriesList) {
            state.categoriesList = newCategoriesList
        },
        SET_CATEGORIES_LOADING(state, loading) {
            state.categoriesLoading = loading
        },
        SET_CATEGORIES_ERROR(state, error) {
            state.categoriesError = error
        }
    },

    getters: {
        GET_CATEGORIES_LIST(state) {
            return state.categoriesList
        },
        GET_CATEGORIES_LOADING(state) {
            return state.categoriesLoading
        },
        GET_CATEGORIES_ERROR(state) {
            return state.categoriesError
        }
    },

    actions: {
        // pobiera dane z getCategories i zapisuje je do store
        FETCH_CATEGORIES({ commit }) {
            commit("SET_CATEGORIES_LOADING", true)
            commit("SET_CATEGORIES_ERROR", null)

            return getCategories()
                .then((data) => {
                    commit("SET_CATEGORIES_LIST", data)
                })
                .catch(() => {
                    commit("SET_CATEGORIES_ERROR", "Nie udało się pobrać kategorii.")
                })
                .finally(() => {
                    commit("SET_CATEGORIES_LOADING", false)
                })
        }
    }
}

export default categories