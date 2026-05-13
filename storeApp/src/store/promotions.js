import { getPromotions } from "@/api"

const promotions = {

    //state - trzymanie danych
    state() {
        return {
            promotionsList: [], // lista promocji ktore pobierane sa z serwera
            promotionsLoading: false, // mowi czy dane sie ładują
            promotionsError: null // ewentualny błąd
        }
    },
    
    //mutations czyli setters - miejsce zmieniające dane w store
    mutations: {
        // ustawia pobraną listę promocji
        SET_PROMOTIONS_LIST(state, newPromotions) {
            state.promotionsList = newPromotions
        },

        // zmienia stan ładowania z true na false
        SET_PROMOTIONS_LOADING(state, loading) {
            state.promotionsLoading = loading
        },

        // ustawia informację o błędzie
        SET_PROMOTIONS_ERROR(state, error) {
            state.promotionsError = error
        },
    },
    
    //getters - pobiera dane ze store do komponentów
    getters: {
        // zwraca listę promocji
        GET_PROMOTIONS_LIST(state) {
            return state.promotionsList
        },

        // zwraca informację czy ładowanie trwa
        GET_PROMOTIONS_LOADING(state) {
            return state.promotionsLoading
        },
        
        // zwraca ewentualny błąd
        GET_PROMOTIONS_ERROR(state) {
            return state.promotionsError
        },
    },
    
    // tu zapytania do serwera z pomocą naszego api
    actions: {

        // akcja asynchroniczna odpowiedzialna za pobieranie danych
        FETCH_PROMOTIONS({ state, commit }) {

            // info dla store że ładowanie się zaczęło
            commit("SET_PROMOTIONS_LOADING", true)

            getPromotions() // wywołanie funkcji z api ktora pobiera dane z serwera
                // jak sie uda to zapiszze dane do store
                .then(data => {
                    commit("SET_PROMOTIONS_LIST", data.promotions)
                })
                // jak znajdzie blad no to errorek i idzie blad do store
                .catch(error => {
                    commit("SET_PROMOTIONS_ERROR", "server error!!!")
                })
                // nie wazne co sie stanie i tak sie skonczy ten loading 
                .finally(() => {
                    commit("SET_PROMOTIONS_LOADING", false)
                })

        }
    }

}

export default promotions