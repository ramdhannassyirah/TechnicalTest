<script setup>
import axios from "axios"
import { ref, reactive, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import ConfirmDialog from '@/components/ConfirmDialog.vue'


const router = useRouter()
const route = useRoute()

const productId = route.params.id

const form = reactive({
    title: "",
    price: "",
    description: "",
    categoryId: "",
})

const errors = reactive({
    title: "",
    price: "",
    description: "",
    categoryId: "",
    image: "",
})

const imagePreview = ref("")
const imageUrl = ref("")
const isUploading = ref(false)
const isSubmitting = ref(false)
const isLoading = ref(true)
const categories = ref([])

const showSaveConfirm = ref(false)
const showCancelConfirm = ref(false)

onMounted(async () => {
    try {
        const [productRes, categoryRes] = await Promise.all([
            axios.get(`https://api.escuelajs.co/api/v1/products/${productId}`),
            axios.get("https://api.escuelajs.co/api/v1/categories"),
        ])

        const product = productRes.data
        form.title = product.title
        form.price = product.price
        form.description = product.description
        form.categoryId = product.category?.id ?? ""
        imageUrl.value = product.images?.[0] ?? ""
        imagePreview.value = product.images?.[0] ?? ""

        categories.value = categoryRes.data
    } catch (e) {
        console.error("Failed to load data", e)
        alert("Failed to load product data.")
        router.push("/products")
    } finally {
        isLoading.value = false
    }
})

const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    imagePreview.value = URL.createObjectURL(file)
    imageUrl.value = ""
    errors.image = ""
    isUploading.value = true

    try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await axios.post("https://api.escuelajs.co/api/v1/files/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        imageUrl.value = res.data.location
    } catch (e) {
        errors.image = "Failed to upload image. Please try again."
        imagePreview.value = ""
    } finally {
        isUploading.value = false
    }
}

const validate = () => {
    let valid = true
    errors.title = ""
    errors.price = ""
    errors.description = ""
    errors.categoryId = ""
    errors.image = ""

    if (!form.title.trim()) {
        errors.title = "Title is required"
        valid = false
    }
    if (!form.price) {
        errors.price = "Price is required"
        valid = false
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
        errors.price = "Price must be a positive number"
        valid = false
    }
    if (!form.description.trim()) {
        errors.description = "Description is required"
        valid = false
    }
    if (!form.categoryId) {
        errors.categoryId = "Category is required"
        valid = false
    }
    if (!imageUrl.value) {
        errors.image = isUploading.value
            ? "Please wait, image is still uploading"
            : "Product image is required"
        valid = false
    }
    return valid
}

const onSaveClick = () => {
    if (!validate()) return
    showSaveConfirm.value = true
}

const confirmSave = async () => {
    showSaveConfirm.value = false
    isSubmitting.value = true
    try {
        await axios.put(`https://api.escuelajs.co/api/v1/products/${Number(productId)}`, {
            title: form.title,
            price: Number(form.price),
            description: form.description,
            categoryId: Number(form.categoryId),
            images: [imageUrl.value],
        })
        router.push("/products")
    } catch (e) {
        console.error(e)
        alert("Failed to update product. Please try again.")
    } finally {
        isSubmitting.value = false
    }
}

const onCancelClick = () => {
    showCancelConfirm.value = true
}

const confirmCancel = () => {
    showCancelConfirm.value = false
    router.push("/products")
}
</script>

<template>
    <div class="">
        <div class="bg-white rounded-xl shadow p-6 md:p-8">
            <form @submit.prevent="onSaveClick" novalidate class="space-y-5">

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Title <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.title" type="text" placeholder="Product title"
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        :class="errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'" />
                    <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Price <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input v-model="form.price" type="number" min="0" placeholder="0"
                            class="w-full border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                            :class="errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'" />
                    </div>
                    <p v-if="errors.price" class="text-red-500 text-xs mt-1">{{ errors.price }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Description <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="form.description" rows="4" placeholder="Describe your product..."
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition resize-none"
                        :class="errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'"></textarea>
                    <p v-if="errors.description" class="text-red-500 text-xs mt-1">{{ errors.description }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Category <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.categoryId"
                        class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition appearance-none"
                        :class="errors.categoryId ? 'border-red-500 bg-red-50' : 'border-gray-300'">
                        <option value="">Select a category</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                    <p v-if="errors.categoryId" class="text-red-500 text-xs mt-1">{{ errors.categoryId }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Product Image <span class="text-red-500">*</span>
                    </label>

                    <label
                        class="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition p-4"
                        :class="errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'">
                        <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />

                        <div v-if="imagePreview" class="relative">
                            <img :src="imagePreview" class="w-40 h-40 object-cover rounded-lg" />
                            <div v-if="isUploading"
                                class="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                                <svg class="animate-spin w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                            <div v-if="imageUrl && !isUploading"
                                class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                ✓
                            </div>
                        </div>

                        <div v-else class="flex flex-col items-center text-gray-400 py-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mb-2" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm">Click to upload image</span>
                            <span class="text-xs mt-1">PNG, JPG, WEBP supported</span>
                        </div>

                        <p v-if="imagePreview && !isUploading" class="text-xs text-gray-400 mt-2">
                            Click to change image
                        </p>
                    </label>

                    <p v-if="errors.image" class="text-red-500 text-xs mt-1">{{ errors.image }}</p>
                    <p v-if="isUploading" class="text-red-500 text-xs mt-1">Uploading image...</p>
                    <p v-if="imageUrl && !isUploading" class="text-green-600 text-xs mt-1">Image ready</p>
                </div>

                <div class="flex gap-3 pt-2">
                    <button type="submit" :disabled="isSubmitting || isUploading"
                        class="flex-1 bg-red-600 text-white hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg transition font-medium text-sm">
                        {{ isSubmitting ? "Saving..." : "Save Product" }}
                    </button>
                    <button type="button" @click="onCancelClick"
                        class="flex-1 border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 px-6 py-2.5 rounded-lg transition font-medium text-sm">
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    </div>

    <ConfirmDialog v-model:show="showSaveConfirm" title="Save Product?"
        message="Are you sure you want to update this product?" confirmLabel="Yes, Save" cancelLabel="Back to Form"
        @confirm="confirmSave" @cancel="showSaveConfirm = false" :danger="false" />

    <ConfirmDialog v-model:show="showCancelConfirm" title="Discard Changes?"
        message="You will lose all unsaved data. Are you sure you want to cancel?" confirmLabel="Yes, Discard"
        cancelLabel="Keep Editing" @confirm="confirmCancel" @cancel="showCancelConfirm = false" :danger="true" />
</template>