import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

import PublicHome from '@/pages/PublicHome.vue'
import LoginPage from '@/pages/LoginPage.vue'
import GamePage from '@/pages/GameInDetails.vue'
import Cart from '@/pages/Cart.vue'
import GamesAdmin from '@/pages/Admin/GamesAdmin.vue'
import GameForm from '@/pages/Admin/GameForm.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import Library from '@/pages/Library.vue'
import NotFound from '@/pages/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicHome
    },

    {
      path: '/login',
      name: 'loginPage',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'registerPage',
      component: RegisterPage
    },

    {
      path: '/admin',
      name: 'adminGamesPage',
      component: GamesAdmin,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/games/create',
      name: 'createGamePage',
      component: GameForm,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/games/edit/:id',
      name: 'editGamePage',
      component: GameForm,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/games/:id',
      name: 'gamePage',
      component: GamePage,
    },

    {
      path: '/cart',
      name: 'cartPage',
      component: Cart,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profilePage',
      component: ProfilePage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/library',
      name: 'libraryPage',
      component: Library, 
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound
    }
  ]
})

export default router

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  if(to.meta.requiresAuth && !userStore.isAuthenticated) {
    return '/login'
  }
})