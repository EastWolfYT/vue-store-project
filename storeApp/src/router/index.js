import { createRouter, createWebHistory } from 'vue-router'

//static load
//@ oznacza katalog /src

import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import PromotionView from '@/views/PromotionView.vue'
import SearchView from '@/views/SearchView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'

//lazy load - renderuje się tylko gdy jest potrzebny a nie z góry

const NotFoundView = () => import("@/views/NotFoundView.vue")


// createRouter robi mi router aplikacji czyli mechanizm który reaguje na zmianę adresu w przeglądarce
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // createWebHistory elegancko ustawia mi tryb adresów np /about itd
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/:pathMatch(.*)*', // takie znaczki to trasa awaryjna jak nie ma adresu w routerze to wejdzie mi o tu
      name: 'NotFoundView',
      component: NotFoundView,
    },
    {
      path: '/promotion/:id',
      name: 'PromotionView',
      component: PromotionView,
    },
    {
      path: '/search',
      name: 'SearchView',
      component: SearchView,
    },
    {
      path: '/register',
      name: 'RegisterView',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView,
    },
    {
      path: '/product/:id',
      name: 'ProductView',
      component: ProductView,
    },
    {
      path: '/cart',
      name: 'CartView',
      component: CartView,
    }
  ]
})

export default router