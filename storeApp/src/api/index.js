const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 200 + Math.random() * 100)
  })

const DATA_URL = `${import.meta.env.BASE_URL}data/data.json`

const DEMO_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
  login: 'demo',
}

const getData = async () => {
  await wait()

  const response = await fetch(DATA_URL)

  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych demo')
  }

  return response.json()
}

const getArray = (data, key) => {
  if (Array.isArray(data[key])) {
    return data[key]
  }

  return []
}

const makeListResponse = (array) => {
  const list = Array.isArray(array) ? array : []

  list.products = list
  list.promotions = list
  list.categories = list
  list.items = list
  list.data = list
  list.list = list
  list.results = list
  list.total = list.length
  list.count = list.length
  list.totalCount = list.length

  return list
}

const makeCartResponse = (cart) => {
  const list = Array.isArray(cart) ? cart : []

  list.cart = list
  list.cartList = list
  list.products = list
  list.items = list
  list.data = list
  list.list = list
  list.results = list
  list.total = list.length
  list.count = list.length
  list.totalCount = list.length

  return list
}

const getCartFromStorage = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')

    if (Array.isArray(cart)) {
      return cart
    }

    return []
  } catch {
    return []
  }
}

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(Array.isArray(cart) ? cart : []))
}

const getCurrentUserFromStorage = () => {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null')

    if (user && typeof user === 'object') {
      return {
        ...DEMO_USER,
        ...user,
      }
    }

    return DEMO_USER
  } catch {
    return DEMO_USER
  }
}

const saveCurrentUser = (user) => {
  localStorage.setItem(
    'currentUser',
    JSON.stringify({
      ...DEMO_USER,
      ...user,
    }),
  )
}

const getPromotions = async () => {
  const data = await getData()
  return makeListResponse(getArray(data, 'promotions'))
}

const getPromotion = async (id) => {
  const data = await getData()
  const promotions = getArray(data, 'promotions')

  return promotions.find((promotion) => String(promotion.id) === String(id)) || null
}

const getProduct = async (id) => {
  const data = await getData()
  const products = getArray(data, 'products')

  return products.find((product) => String(product.id) === String(id)) || null
}

const getProducts = async (options = {}) => {
  const data = await getData()
  let products = [...getArray(data, 'products')]

  if (options.name) {
    products = products.filter((product) =>
      String(product.name || '')
        .toLowerCase()
        .includes(String(options.name).toLowerCase()),
    )
  }

  if (options.category) {
    products = products.filter(
      (product) =>
        String(product.category || '').toLowerCase() === String(options.category).toLowerCase(),
    )
  }

  if (options._sort) {
    const sortKey = options._sort
    const order = options._order === 'desc' ? -1 : 1

    products.sort((a, b) => {
      if (a[sortKey] > b[sortKey]) return order
      if (a[sortKey] < b[sortKey]) return -order
      return 0
    })
  }

  return makeListResponse(products)
}

const registerUser = async (userObject = {}) => {
  await wait()

  const user = {
    ...DEMO_USER,
    id: Date.now(),
    name: userObject.name || userObject.login || userObject.email || 'Demo User',
    login: userObject.login || userObject.email || 'demo',
    email: userObject.email || 'demo@example.com',
    ...userObject,
  }

  localStorage.setItem('demoUser', JSON.stringify(user))
  saveCurrentUser(user)

  return {
    success: true,
    user,
    currentUser: user,
    email: user.email,
    login: user.login,
    name: user.name,
  }
}

const loginUser = async (userObject = {}) => {
  await wait()

  let savedUser = null

  try {
    savedUser = JSON.parse(localStorage.getItem('demoUser') || 'null')
  } catch {
    savedUser = null
  }

  const user = {
    ...DEMO_USER,
    ...(savedUser || {}),
    email: userObject.email || savedUser?.email || DEMO_USER.email,
    login: userObject.login || userObject.email || savedUser?.login || DEMO_USER.login,
  }

  saveCurrentUser(user)

  return {
    success: true,
    user,
    currentUser: user,
    email: user.email,
    login: user.login,
    name: user.name,
  }
}

const logoutUser = async () => {
  await wait()

  localStorage.removeItem('currentUser')

  return {
    success: true,
    user: null,
    currentUser: null,
  }
}

const getCurrentUser = async () => {
  await wait()

  const user = getCurrentUserFromStorage()

  return {
    ...user,
    user,
    currentUser: user,
  }
}

const getCategories = async () => {
  const data = await getData()

  if (Array.isArray(data.categories)) {
    return makeListResponse(data.categories)
  }

  const products = getArray(data, 'products')
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]

  return makeListResponse(categories)
}

const getSimilarProducts = async (category, id) => {
  const data = await getData()
  const products = getArray(data, 'products')

  const similarProducts = products.filter((product) => {
    return String(product.category) === String(category) && String(product.id) !== String(id)
  })

  return makeListResponse(similarProducts)
}

const getCart = async () => {
  await wait()

  return makeCartResponse(getCartFromStorage())
}

const postCartProduct = async (productObject = {}) => {
  await wait()

  const cart = getCartFromStorage()

  const existingProduct = cart.find((item) => String(item.id) === String(productObject.id))

  if (existingProduct) {
    existingProduct.quantity = Number(existingProduct.quantity || 1) + 1
  } else {
    cart.push({
      ...productObject,
      quantity: Number(productObject.quantity || 1),
    })
  }

  saveCartToStorage(cart)

  return makeCartResponse(cart)
}

const deleteCartProduct = async (productId) => {
  await wait()

  const cart = getCartFromStorage().filter((item) => String(item.id) !== String(productId))

  saveCartToStorage(cart)

  return makeCartResponse(cart)
}

const updateCartProduct = async (productId, quantity) => {
  await wait()

  const cart = getCartFromStorage().map((item) => {
    if (String(item.id) === String(productId)) {
      return {
        ...item,
        quantity: Number(quantity),
      }
    }

    return item
  })

  saveCartToStorage(cart)

  return makeCartResponse(cart)
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