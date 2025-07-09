import {createRouter, createWebHistory} from 'vue-router'
import Home from "@/components/Home.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import Prices from "@/components/Prices.vue";
import {authService} from "@/services/auth.service";

const routes = [
    {path: '/', component: Home},
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register},
    {
        path: '/prices',
        name: 'prices',
        component: Prices,
        beforeEnter: (to, from, next) => {
            const token = authService.getAuthToken();
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router