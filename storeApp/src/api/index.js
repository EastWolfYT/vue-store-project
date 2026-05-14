const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 200 + Math.random() * 100)
  })

const DATA_URL = `${import.meta.env.BASE_URL}data/data.json`

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

const getPromotions = async () => {
  const data = await getData()
  return getArray(data, 'promotions')
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

  return products
}

const registerUser = async (userObject) => {
  await wait()

  const user = {
    id: Date.now(),
    name: userObject.name || userObject.email || 'Demo User',
    email: userObject.email || 'demo@example.com',
    login: userObject.login || userObject.email || 'demo',
    ...userObject,
  }

  localStorage.setItem('demoUser', JSON.stringify(user))
  localStorage.setItem('currentUser', JSON.stringify(user))

  return {
    success: true,
    user,
  }
}

const loginUser = async (userObject) => {
  await wait()

  const savedUser = JSON.parse(localStorage.getItem('demoUser') || 'null')

  const user =
    savedUser || {
      id: 1,
      name: 'Demo User',
      email: userObject?.email || 'demo@example.com',
      login: userObject?.login || userObject?.email || 'demo',
    }

  localStorage.setItem('currentUser', JSON.stringify(user))

  return {
    success: true,
    user,
  }
}

const logoutUser = async () => {
  await wait()

  localStorage.removeItem('currentUser')

  return {
    success: true,
  }
}

const getCurrentUser = async () => {
  await wait()

  const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  if (savedUser) {
    return savedUser
  }

  return {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    login: 'demo',
  }
}

const getCategories = async () => {
  const data = await getData()

  if (Array.isArray(data.categories)) {
    return data.categories
  }

  const products = getArray(data, 'products')
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]

  return categories
}

const getSimilarProducts = async (category, id) => {
  const data = await getData()
  const products = getArray(data, 'products')

  return products.filter((product) => {
    return String(product.category) === String(category) && String(product.id) !== String(id)
  })
}

const getCartFromStorage = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')

  if (Array.isArray(cart)) {
    return cart
  }

  return []
}

const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(Array.isArray(cart) ? cart : []))
}

const getCart = async () => {
  await wait()

  const cart = getCartFromStorage()

  if (Array.isArray(cart)) {
    return cart
  }

  return []
}

const postCartProduct = async (productObject) => {
  await wait()

  const cart = getCartFromStorage()

  const existingProduct = cart.find((item) => String(item.id) === String(productObject.id))

  if (existingProduct) {
    existingProduct.quantity = Number(existingProduct.quantity || 1) + 1
  } else {
    cart.push({
      ...productObject,
      quantity: productObject.quantity || 1,
    })
  }

  saveCartToStorage(cart)

  return cart
}

const deleteCartProduct = async (productId) => {
  await wait()

  const cart = getCartFromStorage().filter((item) => String(item.id) !== String(productId))

  saveCartToStorage(cart)

  return cart
}

const updateCartProduct = async (productId, quantity) => {
  await wait()

  const cart = getCartFromStorage().map((item) => {
    if (String(item.id) === String(productId)) {
      return {
        ...item,
        quantity,
      }
    }

    return item
  })

  saveCartToStorage(cart)

  return cart
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