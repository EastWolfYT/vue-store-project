import { createStore } from 'vuex' // magazyn danych dla apki

import promotions from './promotions'
import promotion from './promotion'
import products from './products'
import user from './user'
import categories from './categories'
import similarProducts from './similarProducts'
import product from './product'
import cart from './cart'

const modules = {
    promotions,
    promotion,
    products,
    user,
    categories,
    similarProducts,
    product,
    cart
    // kolejne moduły
}

export default createStore({
    modules
})