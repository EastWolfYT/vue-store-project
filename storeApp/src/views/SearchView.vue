<template>
    <div>
        <Header />

        <form @submit="onSubmit" class="searchForm">
            <input v-model="name" type="text" placeholder="Search by name" />

            <select v-model="category">
                <option value="">All categories</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                </option>
            </select>

            <select v-model="sort">
                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>

            <button type="submit">Search</button>
        </form>

        <AppPagination :currentPage="currentPage" :totalItems="totalItems" :limit="limit" />

        <div v-if="products.length" class="promoProducts">
            <ProductTile
                v-for="product in products"
                :key="product.id"
                :product="product"
                class="products"
            />
        </div>

        <div v-else class="notFoundInfo">
            Product not found
        </div>

        <AppPagination :currentPage="currentPage" :totalItems="totalItems" :limit="limit" />

        <Footer />
    </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import ProductTile from "@/components/ProductTile.vue"
import AppPagination from '@/components/AppPagination.vue'

export default {

    name: "SearchView",

    components: {
        Header,
        Footer,
        ProductTile,
        AppPagination
    },

    // Wywołanie akcji pobrania produktów
    created() {
        this.$store.dispatch("FETCH_CATEGORIES")
    },

    data() {
        return {
            name: "", // szukany fragment nazwy
            category: "", // wybrana kategoria chyba ze pusto to wszystkie
            sort: "name_asc", // sortowanie po name, price
            currentPage: 1,
            limit: 5,
            sortOptions: [
                { label: "Name asc", value: "name_asc" },
                { label: "Name desc", value: "name_desc" },
                { label: "Price asc", value: "price_asc" },
                { label: "Price desc", value: "price_desc" },
            ]
        }
    },

    computed: {
        // Wywołanie gettera z listą produktów
        products() {
            return this.$store.getters.GET_PRODUCTS_LIST;
        },

        // Wywołanie gettera z listą kategorii
        categories() {
            return this.$store.getters.GET_CATEGORIES_LIST
        },

        totalItems() {
            return this.$store.getters.GET_TOTAL_PRODUCTS;
        },
    },

    watch: {
        '$route.query': {
            immediate: true,
            handler() {
                this.syncParamsFromUrl()
                this.fetchProducts()
            }
        }
    },

    methods: {
        onSubmit(e) {
            e.preventDefault()
            this.currentPage = 1
            this.updateUrl()
        },

        updateUrl() {
            const [sortName, sortDir] = this.sort.split("_") // bierze stringa np "name_asc" i rozdziela na tablice ["name", "asc"]

            // obiekt ktory pojdzie do serwera jako query params
            this.$router.push({
                query: {
                    name: this.name,
                    category: this.category,
                    _sort: sortName,
                    _order: sortDir,
                    _page: this.currentPage,
                    _limit: this.limit
                }
            })
        },

        syncParamsFromUrl() {
            this.name = this.$route.query.name || ""
            this.category = this.$route.query.category || ""

            const sortName = this.$route.query._sort || "name"
            const sortDir = this.$route.query._order || "asc"
            this.sort = `${sortName}_${sortDir}`

            this.currentPage = Number(this.$route.query._page) || 1
            this.limit = Number(this.$route.query._limit) || 5
        },

        fetchProducts() {
            const options = {
                name: this.name,
                category: this.category,
                _sort: this.$route.query._sort || "name",
                _order: this.$route.query._order || "asc",
                _page: this.currentPage,
                _limit: this.limit
            }

            this.$store.dispatch("FETCH_PRODUCTS", options)
        }
    },
}
</script>

<style scoped>
.promoProducts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
    padding-bottom: 50px;
}

.products {
    margin: 20px;
}

.searchForm {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 30px 0;
    font-family: Arial, Helvetica, sans-serif;
}

.searchForm input,
.searchForm select,
.searchForm button {
    padding: 8px 10px;
    font-size: 14px;
}

button {
    width: 80px;
    padding: 10px;
    height: 35px;
    border: none;
    border-radius: 4px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

button:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    color: white;
    transform: scale(1.04);
}

button:disabled {
    background: #d9d9d9;
    cursor: default;
    transform: scale(1.00);
}

.notFoundInfo {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 48px;
    margin: 40px 0 140px 0;
    color: #333;
}

@media (max-width: 600px) {
    .searchForm {
        flex-wrap: wrap;
        padding: 0 12px;
        gap: 8px;
    }
    .searchForm input,
    .searchForm select,
    .searchForm button {
        width: 100%;
        box-sizing: border-box;
    }
    .notFoundInfo {
        font-size: 28px;
    }
}
</style>