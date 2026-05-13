import axios from 'axios'

// funkcja pomocnicza do pobierania danych z dowolnego adresu
const get = (url, config = {}) =>
  // new Promise żeby ręcznie opakować pobieranie danych i pozniej dodac opoznienie setTimeoutem
  // update: bez configu nie przekaze parametrow do axiosa
  new Promise((resolve, reject) => {
    // sztuczne opóźnienie, przez co potem można pokazać loader
    setTimeout(() => {
        axios.get(url, {
          ...config,
          withCredentials: true
        })
          .then((response) => {
            console.log('data', response.data)
            resolve(response.data) // pobieranie sie udało zwracamy dane
          })
          .catch((error) => {
            reject(error)
          })
      },
      200 + Math.random() * 100,
    )
  })

const post = (url, userObject) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      axios
        .post(url, userObject, { withCredentials: true }) // nagłówek obsługiwany na serwerze, withCridentials jest dokładnie powiązane z corsOptions na serwerze
        .then((response) => {
          console.log('data', response.data)
          resolve(response.data) // zwracanie odpowiedzi z serwera do widoku
        })
        .catch((error) => {
          reject(error)
        })
    }, 1000) 
  })

const getPromotions = () => get('http://localhost:3000/promotions') // pobieranko promocji z serwera express

const getPromotion = (id) => get(`http://localhost:3000/promotion/${id}`) // pobieranko jednej promocji z serwera

const getProduct = (id) => get(`http://localhost:3000/product/${id}`) // pobieranko jednego produktu z serwera

const getProducts = (options = {}) => get(`http://localhost:3000/products`, { params: options }) // pobieranko produktów z serwera (update: teraz klient ma móc wysłać np. taki obiekt: { name: "con", category: "LAPTOP", _sort: "price", _order: "asc" }, a axios moze zmienic to na adres typu: /products?name=con&category=LAPTOP&_sort=price&_order=asc)

const registerUser = (userObject) => post(`http://localhost:3000/createUser`, userObject); // kwysyla dane z formularza rejestracji do serwera

const loginUser = (userObject) => post(`http://localhost:3000/loginUser`, userObject); // wysyla dane z formularza logowania do serwera

const logoutUser = () => post(`http://localhost:3000/logoutUser`); // wywoła wylogowanie na serwerze i usunięcie cookie

const getCurrentUser = () => get(`http://localhost:3000/getCurrentUser`); // pobiera aktualnie zalogowanego usera z serwera na podstawie cookie

const getCategories = () => get(`http://localhost:3000/categories`); // pobieranko kategorii z serwera

const getSimilarProducts = (category, id) => get(`http://localhost:3000/similar/${category}`, {
  params: { id }
}); // pobieranko similar productow z serwera i id

const getCart = () => get(`http://localhost:3000/cart`) // pobiera aktualny stan z koszyka do serwera

const postCartProduct = (productObject) => post(`http://localhost:3000/postCartProduct`, productObject) // dodaje produkt do koszyka

const deleteCartProduct = (productId) => post(`http://localhost:3000/deleteCartProduct`, productId) // usuwa produkt z koszyka

const updateCartProduct = (productId, quantity) => post(`http://localhost:3000/updateCartProduct`, { productId, quantity }) // zmienia ilosc produktow w koszyku

export {
  getPromotions,
  getPromotion,
  getProduct,
  getProducts,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getCategories,
  getSimilarProducts,
  getCart,
  postCartProduct,
  deleteCartProduct,
  updateCartProduct
  // tu będą pozostałe metody
}
