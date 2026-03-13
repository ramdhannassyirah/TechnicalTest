import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";
import Login from "@/views/auth/login.vue";
import Products from "@/views/dashboard/products/index.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard", // root redirect
    },
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "dashboard",
          component: Dashboard,
          meta: { requiresAuth: true },
        },
        {
          path: "products",
          name: "products",
          component: Products,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !auth.isAuthenticated
  ) {
    next("/login");
  } else if (to.path === "/login" && auth.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
