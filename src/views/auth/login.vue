<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter()
const auth = useAuthStore()
const email = ref("")
const password = ref("")

const submit = async () => {
    await auth.login(email.value, password.value)
    if (auth.isAuthenticated) {
        router.push("/dashboard")
    }
}
</script>

<template>
    <div class="min-h-screen grid md:grid-cols-2 justify-items-center items-center bg-gray-100">
        <div class="hidden md:block">
            <h1 class="text-4xl font-bold text-white">Welcome to Admin Store</h1>
        </div>

        <div class="w-full flex justify-center items-center h-full bg-white shadow-lg rounded-l-xl p-8">
            <div class="w-full max-w-md">
                <h2 class="text-2xl font-bold text-center mb-6">
                    Login
                </h2>

                <form @submit.prevent="submit" class="space-y-4">

                    <div>
                        <label class="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input v-model="email" type="email" placeholder="Masukkan email"
                            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input v-model="password" type="password" placeholder="Masukkan password"
                            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                        Login
                    </button>

                </form>
            </div>
        </div>

    </div>
</template>