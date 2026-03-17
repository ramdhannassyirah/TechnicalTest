import NProgress from "nprogress";
import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";
import Login from "@/views/auth/login.vue";
import Products from "@/views/dashboard/products/index.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/stores/auth";

NProgress.configure({
  showSpinner: true,
  template: `
    <div class="bar" role="bar"></div>
    <div class="spinner" role="spinner">
      <div class="custom-spinner"></div>
    </div>
  `,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: Dashboard,
          meta: { requiresAuth: true },
        },
        {
          path: "/products",
          name: "Product Listing Page",
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: "/products/create",
          name: "Create Product",
          component: () => import("@/components/ProductForm.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/products/:id/edit",
          name: "Edit Product",
          component: () => import("@/components/ProductForm.vue"),
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
  NProgress.start();
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

router.afterEach(() => {
  NProgress.done();
});

export default router;
