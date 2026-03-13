import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("token") || null);
  const isAuthenticated = computed(() => !!token.value);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          email,
          password,
        },
      );

      token.value = res.data.access_token;

      localStorage.setItem("token", token.value);

      await getProfile();
    } catch (error) {
      console.error("Login gagal", error);
    }
  };

  const getProfile = async () => {
    try {
      const res = await axios.get(
        "https://api.escuelajs.co/api/v1/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        },
      );

      user.value = res.data;
    } catch (error) {
      console.error("Get profile error", error);
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
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
