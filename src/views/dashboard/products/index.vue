<script setup>
import axios from "axios"
import { ref, computed, watch, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import BasePagination from "@/components/BasePagination.vue"
import { RouterLink } from 'vue-router'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()

const products = ref([])
const totalProductsFiltered = ref(0)
const perPage = 5
const search = ref("")
const category = ref("")
const categoryList = ref([])
const minPrice = ref("")
const maxPrice = ref("")
const loading = ref(false)
const showConfirm = ref(false)
const productToDelete = ref(null)

const currentPage = computed(() => Number(route.query.page) || 1)
const totalPages = computed(() => Math.ceil(totalProductsFiltered.value / perPage))
const offset = computed(() => (currentPage.value - 1) * perPage)

onMounted(async () => {
    try {
        const res = await axios.get("https://api.escuelajs.co/api/v1/categories")
        categoryList.value = res.data
    } catch (e) {
        console.error("Failed to load categoryList", e)
    }
})


const fetchProducts = async () => {
    loading.value = true
    let query = `?offset=${offset.value}&limit=${perPage}`
    if (search.value) query += `&title=${search.value}`
    if (category.value) query += `&categoryId=${category.value}`
    if (minPrice.value) query += `&price_min=${minPrice.value}`
    if (maxPrice.value) query += `&price_max=${maxPrice.value}`

    try {
        const res = await axios.get(`https://api.escuelajs.co/api/v1/products${query}`)
        products.value = res.data
        let totalQuery = `?`
        if (search.value) totalQuery += `title=${search.value}&`
        if (category.value) totalQuery += `categoryId=${category.value}&`
        if (minPrice.value) totalQuery += `price_min=${minPrice.value}&`
        if (maxPrice.value) totalQuery += `price_max=${maxPrice.value}&`
        const totalRes = await axios.get(`https://api.escuelajs.co/api/v1/products${totalQuery}`)
        totalProductsFiltered.value = totalRes.data.length

    } catch (err) {
        console.error(err)
        products.value = []
        totalProductsFiltered.value = 0
    }
    loading.value = false
}

watch([search, category, minPrice, maxPrice], () => {
    router.push({ query: { page: 1 } })
    fetchProducts()
})

watch(() => route.query.page, () => {
    fetchProducts()
})

const changePage = (page) => {
    router.push({ query: { page } })
}

const resetFilter = () => {
    search.value = ""
    category.value = ""
    minPrice.value = ""
    maxPrice.value = ""
    fetchProducts()
}

const confirmDelete = async () => {
    if (productToDelete.value) {
        try {
            await axios.delete(`https://api.escuelajs.co/api/v1/products/${productToDelete.value}`)
            showConfirm.value = false
            productToDelete.value = null
            fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }
}

onMounted(() => {
    fetchProducts()
})
</script>

<template>
    <div>
        <div
            class="bg-white p-4  rounded-lg shadow mb-6 flex w-full gap-3 items-center justify-between flex-col md:flex-row ">
            <div class="flex flex-wrap gap-3 w-full  ">
                <button @click="resetFilter"
                    class="bg-red-500 text-white hover:bg-red-600 w-10 h-10 flex justify-center items-center cursor-pointer rounded-full transition self-start sm:self-auto shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50"
                        fill="currentColor">
                        <path
                            d="M 25 2 C 12.321124 2 2 12.321124 2 25 C 2 37.678876 12.321124 48 25 48 C 37.678876 48 48 37.678876 48 25 A 2.0002 2.0002 0 1 0 44 25 C 44 35.517124 35.517124 44 25 44 C 14.482876 44 6 35.517124 6 25 C 6 14.482876 14.482876 6 25 6 C 30.475799 6 35.391893 8.3080175 38.855469 12 L 35 12 A 2.0002 2.0002 0 1 0 35 16 L 46 16 L 46 5 A 2.0002 2.0002 0 0 0 43.970703 2.9726562 A 2.0002 2.0002 0 0 0 42 5 L 42 9.5253906 C 37.79052 4.9067015 31.727675 2 25 2 z" />
                    </svg>
                </button>

                <input v-model="search" type="text" placeholder="Search products..."
                    class=" w-full md:w-sm border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition" />

                <select v-model="category"
                    class="md:w-xs w-full border rounded-lg px-3 py-2 text-sm border-gray-300 cursor-pointer text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none">
                    <option value="">Select a category</option>
                    <option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </option>
                </select>

                <div class="flex gap-2">
                    <input v-model="minPrice" type="number" placeholder="Min Price"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition" />
                    <input v-model="maxPrice" type="number" placeholder="Max Price"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition" />
                </div>
            </div>

            <RouterLink to='/products/create'
                class="bg-black text-white shrink-0 hover:bg-black/70 px-4 py-2 rounded-lg transition self-start sm:self-auto">
                Add Product
            </RouterLink>
        </div>

        <div class="bg-white rounded-lg shadow w-full overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead class="bg-red-500">
                        <tr class="text-gray-100 uppercase text-sm leading-normal">
                            <th class="py-3 px-4 border-b text-center w-16">No</th>
                            <th class="py-3 px-4 border-b text-center w-28 hidden sm:table-cell">Image</th>
                            <th class="py-3 px-4 border-b text-left">Title</th>
                            <th class="py-3 px-4 border-b text-center w-32">Price</th>
                            <th class="py-3 px-4 border-b text-center w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm">
                        <tr v-if="products.length === 0">
                            <td colspan="5" class="py-8 text-center text-gray-400">No products found.</td>
                        </tr>
                        <tr v-for="(product, index) in products" :key="product.id"
                            class="hover:bg-gray-50 border-b border-gray-100">
                            <td class="py-3 px-4 text-center text-gray-500">{{ offset + index + 1 }}</td>
                            <td class="py-3 px-4 text-center hidden sm:table-cell">
                                <img :src="product.images[0]" class="w-14 h-14 object-cover rounded mx-auto" />
                            </td>
                            <td class="py-3 px-4">
                                <div class="flex items-center gap-3 sm:block">
                                    <img :src="product.images[0]"
                                        class="w-8 h-8 object-cover rounded sm:hidden shrink-0" />
                                    <span class="font-medium text-sm  text-gray-700">{{ product.title }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4 font-bold text-center whitespace-nowrap">${{ product.price }}</td>
                            <td class="py-3 px-4 text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button @click="router.push(`/products/${product.id}/edit`)"
                                        class="text-blue-600 cursor-pointer hover:text-blue-800 p-1 rounded hover:bg-red-50 transition"
                                        title="Edit">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            fill="currentColor" viewBox="0 0 30 30">
                                            <path
                                                d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 20 5 L 25 10 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 18 7 L 6 19 L 7.5 19.5 L 8 22 L 10.5 22.5 L 11 24 L 23 12 L 18 7 z M 4.1523438 23.152344 L 3.0371094 26.308594 A 0.5 0.5 0 0 0 3 26.5 A 0.5 0.5 0 0 0 3.5 27 A 0.5 0.5 0 0 0 3.6816406 26.966797 L 6.8476562 25.847656 L 4.1523438 23.152344 z" />
                                        </svg>
                                    </button>
                                    <button
                                        class="text-red-600 cursor-pointer hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                                        title="Delete" @click="productToDelete = product.id; showConfirm = true">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            fill="currentColor" viewBox="0 0 30 30">
                                            <path
                                                d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z" />
                                        </svg>
                                    </button>
                                    <ConfirmDialog v-if="showConfirm" :show="showConfirm" title="Delete Product"
                                        message="Are you sure you want to delete this product? This action cannot be undone."
                                        confirmLabel="Yes, Delete" cancelLabel="Cancel" danger
                                        @confirm="confirmDelete()"
                                        @cancel="showConfirm = false; productToDelete = null" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>



        <div v-if="totalPages > 0" class="mt-4 flex justify-end">
            <BasePagination :currentPage="currentPage" :totalPages="totalPages" @changePage="changePage" />
        </div>
    </div>
</template>