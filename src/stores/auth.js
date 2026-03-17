import { ref, computed } from "vue";
import { defineStore } from "pinia";
import api from "@/utils/axios";
import NProgress from "nprogress";
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);
  const isAuthenticated = computed(() => !!token.value);
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  const login = async (email, password) => {
    NProgress.start();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      token.value = res.data.access_token;
      localStorage.setItem("token", token.value);

      await getProfile();
    } catch (error) {
      console.error("Login gagal", error);
    } finally {
      NProgress.done();
    }
  };

  const getProfile = async () => {
    try {
      const res = await api.get("/auth/profile");

      user.value = {
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        avatar: res.data.avatar,
      };

      localStorage.setItem("user", JSON.stringify(user.value));
    } catch (error) {
      console.error("Get profile error", error);
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    getProfile,
  };
});
