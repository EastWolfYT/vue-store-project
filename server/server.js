const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path")
const usersFilePath = path.join(__dirname, "data", "users.json")
const fs = require('fs').promises
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.get("/promotions", function (req, res) {
  const promotions = require("./data/data.json");
  res.json(promotions);
});

app.get("/promotion/:id", function (req, res) {
  const promotions = require("./data/data.json")
  const id = req.params.id
  const promotion = promotions.promotions.find(item => item.id === id)
  res.json(promotion)
})

app.get("/product/:id", function (req, res) {
  const products = require("./data/data.json")
  const id = req.params.id
  const product = products.products.find(item => item.id === id)
  res.json(product)
})

app.get("/products", function (req, res) {
  const data = require("./data/data.json")

  let products = [...data.products] // wypakowanie data.products do tablicy products przez spread operator

  const { name, category, _sort, _order, _page, _limit } = req.query // pobieranie parametrow z adresu np. /products?name=con&category=LAPTOP&_sort=price&_order=asc

  // filtrowanie po nazwie
  if (name) {
    products = products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()))
  }

  // filtrowanie po kategorii
  if (category) {
    products = products.filter(product => product.category === category)
  }

  // sortowanie po name
  if (_sort === "name") {
    products.sort((a, b) => {
      if (_order === "desc") {
        // porownanie nazw produktow i -1 oznacza ze A jest przed B, 1 oznacza ze B jest przed A, 0 oznacza ze sa rowne i nie zmienia kolejnosci
        if (a.name < b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
      }
      else {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
    });
  }

  // sortowanie po price
  if (_sort === "price") {
    products.sort((a,b) => {
      if (_order === "desc") {
        return b.price - a.price // sortuj malejaco
      }
      else {
        return a.price - b.price // w innym wypadku rosnaco
      }
    })
  }

  const totalCount = products.length // liczba wszystkich produktów po filtrach ale przed paginacja

  const page = Number(_page) || 1 // numer strony z query jak go nie ma to 1
  const limit = Number(_limit) || products.length // limit produktów na stronę jak go nie ma to pokazuje wszystko
  const startIndex = (page - 1) * limit // od ktorego miejsca w tablicy zaczac

  const paginatedData = products.slice(startIndex, startIndex + limit) // wycinanie tylko fragmentu tablicy dla całej strony

  // obiekt
  res.json({
    data: paginatedData, // z wynikami strony
    total: totalCount // i pełną liczbą wyników
  })
})

app.get("/categories", function (req, res) {
  const data = require("./data/data.json")
  res.json(data.categories)
})

app.post("/createUser", async function (req, res) {
  try {
    const { email, password } = req.body // pobieranko danych z formularza
    const data = await fs.readFile(usersFilePath, "utf8") // odczytanie data z pliku
    const usersData = JSON.parse(data) // zmienianie na tablice obiektow

    const userExists = usersData.find(user => user.email === email); // sprawdzanie czy jest taki email

    if (userExists) {
      return res.json({ status: "exists" }) // jesli istneije to zwraca sie status ze istnieje
    }

    const newUser = {
      email,
      password
    }

    usersData.push(newUser)

    // powyzej nowy obiekt ktory zostal stworzoy i pushniety do tablicy

    await fs.writeFile(usersFilePath, JSON.stringify(usersData, null, 2), "utf8") // czytanie pliku users.json

    res.json({ status: "registered" }) // po zapisie zwracanie statusu registered
  } catch (error) {
    res.json({ status: "error" }) // jak cos zle pojdzie no to errorek 
  }
})

app.post("/loginUser", async function (req, res) {
  try {
    const { email, password } = req.body // pobieranko danych logowania z formularza

    const data = await fs.readFile(usersFilePath, "utf8") // odczytanie data z pliku
    const usersData = JSON.parse(data) // zmienianie na tablice obiektow

    const foundUser = usersData.find(user => user.email === email && user.password === password) // szukanie usera ktory ma jednoczesnie taki sam email i takie samo haslo

    // jesli jest user no to ustawiam cookie
    if (foundUser) {
      res.cookie("email", email, {
        httpOnly: true,
        sameSite: "lax"
      })

      // i odsylam
      return res.json({
        status: "logged",
        email: foundUser.email
      })
    }

    // no a jak nie istnieje to odsyla to
    res.json({ status: "notlogged" })
  } catch (error) {
    console.log(error)
    res.json({ status: "notlogged" })
  }
})

app.post("/logoutUser", function (req, res) {
  res.clearCookie("email") // usuwanie cookie ktore sa ustawiane przy logowaniu
  res.json({ status: "logout" }) // odeslanie info do klienta ze sie wylogowalo
})

app.get("/getCurrentUser", async function (req, res) {
  try {
    const email = req.cookies.email // pobieranko emaila z cookie

    // jak nie ma emaila to user nie jest zalogowany
    if (!email) {
      return res.json({ status: "notauthorized" })
    }

    const data = await fs.readFile(usersFilePath, "utf8") // odczytanie data z pliku (poczekaj az plik sie odczyta i dopiero wtedy zapisz wynik do data)
    const usersData = JSON.parse(data) // zmienianie na tablice obiektow

    const foundUser = usersData.find(user => user.email === email) // szukanie jednego konkretnego usera w tablicy userow

    // jesli jest user no to jest zalogowany
    if (foundUser) {
      return res.json({
        status: "authorized",
        email: foundUser.email
      })
    }

    res.json({ status: "notauthorized" })
  } catch (error) {
    console.log(error)
    res.json({ status: "notauthorized" })
  }
})

app.get("/similar/:category", function (req, res) {
  const data = require("./data/data.json")
  const category = req.params.category // pobranie kategorii z adresu np. /similar/TABLET
  let currentId = req.query.id // id z aktualnego produktu z query

  let similarProducts = data.products.filter(product => {
    return product.category === category && product.id !== currentId
  }) // zostawianie produktow tej samej kategorii ale odrzucam aktualnie oglądany produkt z listy podobnych

  similarProducts.sort((a, b) => b.price - a.price) // sort od najdroższego do najtańszego

  similarProducts = similarProducts.slice(0, 4) // biore tylko pierwsze 3

  res.json(similarProducts)
})

// testowe dane do koszyka zeby zobaczyc je pod /cart pozniej
const dataFile = require("./data/data.json")

const cart = [
  dataFile.products[0],
  dataFile.products[1],
  dataFile.products[2]
]

app.get("/cart", function (req, res) {
  res.json({
    products: cart
  })
})

// dodaje cały obiekt produktu do tablicy cart
app.post("/postCartProduct", function (req, res) {
  const productObject = req.body
  
  cart.push(productObject)

  res.json({
    status: "added",
    products: cart
  })
})

// szuka produktu po danym id i usuwa go z koszyka
app.post("/deleteCartProduct", function (req, res) {
  const productId = req.body

  const index = cart.findIndex(product => product.id === productId)

  if (index !== -1) {
    cart.splice(index, 1)
  }

  res.json({
    status: "deleted",
    products: cart
  })
})

app.post("/updateCartProduct", function (req, res) {
  // productId i quantity przychodza z klienta
  const { productId, quantity } = req.body

  // wystepujace produkty filtrowanko
  const existingProducts = cart.filter(product => product.id === productId)

  // bierze wzorcowy obiekt produktu najpierw z koszyka a jak go juz tam nie ma to z dataFile.products
  const productTemplate = existingProducts[0] || dataFile.products.find(product => product.id === productId)

  // petelka ktora usuwa wszystkie sztuki tego produktu z koszyka
  for (let i = cart.length - 1; i >= 0; i--) {
    if (cart[i].id === productId) {
      cart.splice(i, 1)
    }
  }

  // dodaje tyle sztuk ile wynosi quantity
  if (productTemplate) {
    for (let i = 0; i < quantity; i++) {
      cart.push(productTemplate)      
    }
  }

  res.json({
    status: "updated",
    products: cart
  })
})

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});