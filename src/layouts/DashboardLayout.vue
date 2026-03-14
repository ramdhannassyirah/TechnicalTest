<script setup>
import { ref } from "vue"
import { RouterLink, RouterView, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const auth = useAuthStore()

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

const logout = () => {
    auth.logout()
    router.push("/login")
}
</script>

<template>
    <div class="min-h-screen flex bg-gray-100">

        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/40 z-40 md:hidden" @click="sidebarOpen = false"></div>

        <aside :class="[
            'fixed md:static z-50 w-64 bg-red-500 shadow-lg min-h-screen transition-transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]">
            <div class="p-5 border-b text-white border-white">
                <h1 class="text-xl text-center font-bold">Admin Store</h1>
            </div>

            <nav class="p-4 space-y-2 text-white font-semibold">
                <RouterLink to="/dashboard" class="block px-4 py-2 rounded-lg hover:bg-white     hover:text-blue-500"
                    exact-active-class="bg-white text-blue-500">
                    Dashboard
                </RouterLink>

                <RouterLink to="/products" class="block px-4 py-2 rounded-lg hover:bg-white  hover:text-blue-500"
                    exact-active-class="bg-white text-blue-500">
                    Product Listing Page
                </RouterLink>
            </nav>
        </aside>

        <div class="flex-1 flex flex-col">

            <header class="bg-white shadow px-6 py-4 flex justify-between items-center">

                <div class="flex items-center gap-4">
                    <button class="md:hidden" @click="sidebarOpen = !sidebarOpen">
                        ☰
                    </button>

                    <h2 class="text-lg font-semibold capitalize">
                        {{ router.currentRoute.value.name }}
                    </h2>
                </div>

                <div class="relative">

                    <button @click="dropdownOpen = !dropdownOpen" class="flex cursor-pointer items-center gap-2">
                        <img :src="auth.user?.avatar" class="w-9 h-9 rounded-full" />
                        <span class="font-medium">
                            {{ auth.user?.name || "User" }}
                        </span>
                    </button>

                    <Transition enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 scale-95 translate-y-2"
                        enter-to-class="opacity-100 scale-100 translate-y-0"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="opacity-100 scale-100 translate-y-0"
                        leave-to-class="opacity-0 scale-95 translate-y-2">
                        <div v-if="dropdownOpen"
                            class="absolute right-0 mt-3  bg-white  rounded-lg shadow-lg overflow-hidden">
                            <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                                Logout
                            </button>
                        </div>
                    </Transition>

                </div>

            </header>

            <main class="p-6 flex-1">
                <RouterView />
            </main>

        </div>

    </div>
</template>