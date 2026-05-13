import { getPromotion, getProduct } from '@/api' // imporcik dwoch funkcji z api

const promotion = {
  state() {
    return {
      promotionObject: {}, // tu bedzie przechowywany jeden obiekt promocji
      promotionLoading: false, // info o tym czy sie dalej pobiera ta promocja i produkty
      promotionError: null, // errorek
    }
  },

  mutations: {
    // ustawianie całego gotowego obiektu promocji
    SET_PROMOTION_OBJECT(state, newPromotionObject) {
      state.promotionObject = newPromotionObject
    },
    // ustawianie loading na true albo false
    SET_PROMOTION_LOADING(state, loading) {
      state.promotionLoading = loading
    },
    // ustawianie errorka
    SET_PROMOTION_ERROR(state, error) {
      state.promotionError = error
    },
  },

  getters: {
    // zwraca obiekt promocji
    GET_PROMOTION_OBJECT(state) {
      return state.promotionObject
    },
    // zwraca loading
    GET_PROMOTION_LOADING(state) {
      return state.promotionLoading
    },
    // zwraca errorek
    GET_PROMOTION_ERROR(state) {
      return state.promotionError
    },
  },

  actions: {
    async FETCH_PROMOTION({ state, commit, getters }, promotionId) {
      commit('SET_PROMOTION_LOADING', true) // ustawianie loadingu
      commit('SET_PROMOTION_ERROR', null) // czyszczenie poprzedniego błędu

      try {
        const data = await getPromotion(promotionId) // pobieranie jednej promocji z serwera

        const fullProducts = [] // pusta tablica na pełne obiekty produktów

        // Iteracja - czekamy na każdy produkt po kolei

        for (const productId of data.items) {
          const product = await getProduct(productId)
          fullProducts.push(product) // i pushowanko do tablicy każdego produktu
        }

        // Łączymy dane promocji (header, color itp.) z pełnymi obiektami produktów

        const returnObject = {
          ...data, // rozpakowanie elementów z tablicy
          items: fullProducts, // i podmienianie jej items
        }

        commit('SET_PROMOTION_OBJECT', returnObject) // zapisanie gotowego obiektu do store
      } catch (error) {
        commit('SET_PROMOTION_ERROR', 'Nie udało się pobrać produktów.') // errorek
      } finally {
        commit('SET_PROMOTION_LOADING', false) // na koncu wylaczanie loadingu
      }
    },
  },
}

export default promotion
