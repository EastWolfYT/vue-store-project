<template>
    <header>
        <nav class="navBar">
            <ul class="ulLeft">
                <li><RouterLink to="/" exact class="navElement">Home</RouterLink></li>
                <li><RouterLink to="/about" class="navElement">About</RouterLink></li>
                <li><RouterLink to="/nnn" class="navElement">Not found</RouterLink></li>
                <li><RouterLink to="/search" class="navElement">Search</RouterLink></li>
            </ul>

            <ul class="ulRight">
                <li>
                    <CartPopup :itemsCount="cartItemsCount" />
                </li>

                <li v-show="!user">
                    <RouterLink to="/login" class="navElement registerElement">Login</RouterLink>
                </li>

                <li v-show="!user">
                    <RouterLink to="/register" class="navElement registerElement">Register</RouterLink>
                </li>

                <li v-show="user" class="userEmail">
                    {{ user ? user.email : "" }}
                </li>

                <li v-show="user">
                    <button class="logoutButton" @click="logout">Logout</button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
import CartPopup from "@/components/CartPopup.vue"

export default {
    name: "Header",
    components: {
        CartPopup,
    },

    created() {
        this.$store.dispatch("FETCH_CART")
    },

    computed: {
        // pobiera aktualnego usera ze store
        user() {
            return this.$store.getters.GET_CURRENT_USER;
        },
        // pobiera ze store wartosc userLoading i udostepnia ja w komponencie
        userLoading() {
            return this.$store.getters.GET_CURRENT_USER_LOADING;
        },

        cartList() {
            return this.$store.getters.GET_CART_LIST;
        },

        cartItemsCount() {
            const uniqueIds = [...new Set(this.cartList.map(product => product.id))];
            return uniqueIds.length;
        }
    },

    methods: {
        // wywoluje akcje ze store czyli czysci usera robi logout na serwerze i przekierowuje na /login
        logout() {
            this.$store.dispatch("LOGOUT_USER")
                .then(() => {
                    this.$router.push("/login");
                });
        }
    }
}
</script>

<style scoped>
header {
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 1000;
}

.navBar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #232526 0%, #2f2f35 100%);
    box-shadow: 0px 3px 12px rgb(0, 0, 0, 0.25);
}

.ulLeft,
.ulRight {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
}

.ulLeft {
    margin-left: 24px;
}

.ulLeft li,
.ulRight li {
    margin: 0;
    padding: 0;
}

.navElement {
    display: block;
    color: #f4f4f4;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    text-align: center;
    padding: 18px 22px;
    text-decoration: none;
    transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.navElement:hover:not(.router-link-exact-active) {
    background-color: #3b4652;
    color: white;
    transform: scale(1.04);
}

.router-link-exact-active {
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
}

.ulRight {
    list-style-type: none;
    margin: 0 48px 0 0;
    padding: 0;
    display: flex;
    align-items: center;
}

.registerElement {
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    border-radius: 15px;
    padding: 10px 18px;
    line-height: 1;
    align-self: center;
    margin-left: 24px;
}

.registerElement:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    color: white;
    transform: scale(1.04);
}

.userEmail {
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    padding: 0 8px;
}

.logoutButton {
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    background: linear-gradient(180deg, #3e7eff 0%, #258feb 100%);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
    margin-left: 24px;
}

.logoutButton:hover {
    background: linear-gradient(180deg, #5b93ff 0%, #36a3ff 100%);
    transform: scale(1.04);
}

@media (max-width: 768px) {
    .navElement {
        font-size: 15px;
        padding: 14px 14px;
    }
    .ulLeft {
        margin-left: 12px;
    }
    .ulRight {
        margin: 0 16px 0 0;
    }
}

@media (max-width: 480px) {
    .navBar {
        flex-wrap: wrap;
    }
    .ulLeft {
        margin-left: 6px;
    }
    .ulRight {
        margin: 0 6px 4px 0;
    }
    .navElement {
        font-size: 13px;
        padding: 10px 8px;
    }
    .registerElement {
        margin-left: 6px;
        padding: 8px 8px;
        font-size: 13px;
    }
    .userEmail {
        font-size: 13px;
        padding: 0 4px;
    }
    .logoutButton {
        margin-left: 6px;
        font-size: 13px;
        padding: 6px 8px;
    }
}
</style>