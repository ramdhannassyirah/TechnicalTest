<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter()
const auth = useAuthStore()
const email = ref("")
const password = ref("")
const error = ref("")
const isLoading = ref(false)

const submit = async () => {
    isLoading.value = true
    error.value = ""

    if (!email.value || !password.value) {
        error.value = "Email dan password harus diisi"
        isLoading.value = false
        return
    }

    await auth.login(email.value, password.value)

    if (auth.isAuthenticated) {
        router.push("/dashboard")
        isLoading.value = false
    } else {
        error.value = "Email atau password salah"
        isLoading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen grid md:grid-cols-2">

        <div
            class="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-red-500 to-red-600 text-white p-10">
            <h1 class="text-5xl font-extrabold mb-6">Welcome Back!</h1>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="login illustration"
                class="mt-10 w-64 h-64" />
        </div>

        <div class="flex justify-center items-center bg-white  p-8">
            <div class="w-full max-w-md   p-8 space-y-6">

                <h2 class="text-3xl font-bold text-gray-800">Sign In</h2>

                <form @submit.prevent="submit" class="space-y-4">

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input v-model="email" type="email" placeholder="you@example.com"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input v-model="password" type="password" placeholder="********"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition" />
                    </div>

                    <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

                    <button :disabled="isLoading" type="submit" class="w-full bg-gradient-to-r cursor-pointer from-red-500 to-yellow-400 text-white py-3 rounded-xl shadow-lg 
           hover:from-red-600 hover:to-yellow-500 transition font-semibold
           disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ isLoading ? "Loading..." : "Masuk" }}
                    </button>

                </form>
            </div>
        </div>

    </div>
</template>