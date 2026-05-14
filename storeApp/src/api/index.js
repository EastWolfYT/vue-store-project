const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 200 + Math.random() * 100)
  })

const DATA_URL = `${import.meta.env.BASE_URL}data/data.json`
const USERS_KEY = 'vue-store-users'
const CURRENT_USER_KEY = 'vue-store-current-user'
const CART_KEY = 'vue-store-cart'

const getData = async () => {
  await wait()

  const response = await fetch(DATA_URL)

  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych demo')
  }

  return response.json()
}

const getUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(Array.isArray(users) ? users : []))
}

const getCurrentUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null')
    return user && typeof user === 'object' ? user : null
  } catch {
    return null
  }
}

const saveCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

const getCartFromStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(cart) ? cart : []
  } catch {
    return []
  }
}

const saveCartToStorage = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(Array.isArray(cart) ? cart : []))
}

const getPromotions = async () => {
  const data = await getData()

  return {
    promotions: Array.isArray(data.promotions) ? data.promotions : [],
  }
}

const getPromotion = async (id) => {
  const data = await getData()
  const promotions = Array.isArray(data.promotions) ? data.promotions : []

  return promotions.find((promotion) => String(promotion.id) === String(id)) || {}
}

const getProduct = async (id) => {
  const data = await getData()
  const products = Array.isArray(data.products) ? data.products : []

  return products.find((product) => String(product.id) === String(id)) || {}
}

const getProducts = async (options = {}) => {
  const data = await getData()
  let products = Array.isArray(data.products) ? [...data.products] : []

  const name = options.name || ''
  const category = options.category || ''
  const sort = options._sort || ''
  const order = options._order || 'asc'
  const page = Number(options._page) || 1
  const limit = Number(options._limit) || products.length || 1

  if (name) {
    products = products.filter((product) =>
      String(product.name || '')
        .toLowerCase()
        .includes(String(name).toLowerCase()),
    )
  }

  if (category) {
    products = products.filter((product) => String(product.category) === String(category))
  }

  if (sort === 'name') {
    products.sort((a, b) => {
      if (order === 'desc') {
        return String(b.name).localeCompare(String(a.name))
      }

      return String(a.name).localeCompare(String(b.name))
    })
  }

  if (sort === 'price') {
    products.sort((a, b) => {
      if (order === 'desc') {
        return Number(b.price) - Number(a.price)
      }

      return Number(a.price) - Number(b.price)
    })
  }

  const total = products.length
  const startIndex = (page - 1) * limit
  const paginatedProducts = products.slice(startIndex, startIndex + limit)

  return {
    data: paginatedProducts,
    total,
  }
}

const registerUser = async (userObject = {}) => {
  await wait()

  const users = getUsers()
  const email = userObject.email
  const password = userObject.password

  const userExists = users.find((user) => user.email === email)

  if (userExists) {
    return {
      status: 'exists',
    }
  }

  const newUser = {
    email,
    password,
  }

  users.push(newUser)
  saveUsers(users)

  return {
    status: 'registered',
  }
}

const loginUser = async (userObject = {}) => {
  await wait()

  const users = getUsers()
  const email = userObject.email
  const password = userObject.password

  const foundUser = users.find((user) => user.email === email && user.password === password)

  if (!foundUser) {
    return {
      status: 'notlogged',
    }
  }

  const currentUser = {
    status: 'logged',
    email: foundUser.email,
  }

  saveCurrentUser(currentUser)

  return currentUser
}

const logoutUser = async () => {
  await wait()

  localStorage.removeItem(CURRENT_USER_KEY)

  return {
    status: 'logout',
  }
}

const getCurrentUser = async () => {
  await wait()

  const currentUser = getCurrentUserFromStorage()

  if (!currentUser || !currentUser.email) {
    return {
      status: 'notauthorized',
    }
  }

  return {
    status: 'authorized',
    email: currentUser.email,
  }
}

const getCategories = async () => {
  const data = await getData()

  if (Array.isArray(data.categories)) {
    return data.categories
  }

  const products = Array.isArray(data.products) ? data.products : []

  return [...new Set(products.map((product) => product.category).filter(Boolean))]
}

const getSimilarProducts = async (category, id) => {
  const data = await getData()
  const products = Array.isArray(data.products) ? data.products : []

  return products
    .filter((product) => String(product.category) === String(category) && String(product.id) !== String(id))
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 3)
}

const getCart = async () => {
  await wait()

  return {
    products: getCartFromStorage(),
  }
}

const postCartProduct = async (productObject) => {
  await wait()

  const cart = getCartFromStorage()

  cart.push(productObject)
  saveCartToStorage(cart)

  return {
    status: 'added',
    products: cart,
  }
}

const deleteCartProduct = async (productId) => {
  await wait()

  const cart = getCartFromStorage()
  const index = cart.findIndex((product) => String(product.id) === String(productId))

  if (index !== -1) {
    cart.splice(index, 1)
  }

  saveCartToStorage(cart)

  return {
    status: 'deleted',
    products: cart,
  }
}

const updateCartProduct = async (productId, quantity) => {
  await wait()

  const data = await getData()
  const allProducts = Array.isArray(data.products) ? data.products : []

  let cart = getCartFromStorage()

  const existingProducts = cart.filter((product) => String(product.id) === String(productId))
  const productTemplate =
    existingProducts[0] || allProducts.find((product) => String(product.id) === String(productId))

  cart = cart.filter((product) => String(product.id) !== String(productId))

  const safeQuantity = Math.max(0, Number(quantity) || 0)

  if (productTemplate) {
    for (let i = 0; i < safeQuantity; i++) {
      cart.push(productTemplate)
    }
  }

  saveCartToStorage(cart)

  return {
    status: 'updated',
    products: cart,
  }
}

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
  updateCartProduct,
}