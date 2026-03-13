<template>
    <div>
        test

        <button @click.prevent="logout">Logout</button>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore()
const router = useRouter()
const logout = async () => {
    await auth.logout()

    if (!auth.isAuthenticated) {
        router.push("/login")
    } else {
        alert("Logout failed")
    }
}
</script>

<style></style>