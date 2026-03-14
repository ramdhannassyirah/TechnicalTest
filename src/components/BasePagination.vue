<script setup>
import { computed } from "vue"

const props = defineProps({
    currentPage: Number,
    totalPages: Number
})

const emit = defineEmits(["changePage"])

const pages = computed(() => {
    const pages = []
    const total = props.totalPages
    const current = props.currentPage

    if (total <= 6) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        pages.push(1)

        if (current > 3) {
            pages.push("...")
        }

        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (current < total - 1) {
            pages.push("...")
        }

        pages.push(total)
    }

    return pages
})

const changePage = (page) => {
    if (page !== "...") {
        emit("changePage", page)
    }
}
</script>
<template>
    <div class="flex flex-wrap justify-center items-center gap-2 mt-6">

        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="px-4 py-2 cursor-pointer rounded-lg border transition-colors duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed
             bg-red-500 text-white hover:bg-red-600">
            Prev
        </button>

        <button v-for="(page, index) in pages" :key="index" @click="changePage(page)" class="px-4 py-2 cursor-pointer text-sm border rounded-lg transition-colors duration-200
             hover:bg-gray-100" :class="page === currentPage
                ? 'bg-red-600 text-white font-semibold border-red-600'
                : 'bg-white text-gray-700'" :disabled="page === '...'">
            {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="px-4 py-2 cursor-pointer rounded-lg border transition-colors duration-200
             disabled:opacity-50 disabled:cursor-not-allowed
             bg-red-500 text-white hover:bg-red-600">
            Next
        </button>

    </div>
</template>