<!-- components/ConfirmDialog.vue -->
<script setup>
defineProps({
    show: Boolean,
    title: { type: String, default: 'Are you sure?' },
    message: { type: String, default: 'This action cannot be undone.' },
    confirmLabel: { type: String, default: 'Yes, Continue' },
    cancelLabel: { type: String, default: 'Cancel' },
    danger: { type: Boolean, default: false }
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
                @click.self="$emit('cancel')">
                <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
                    <p class="text-sm text-gray-500 mb-6">{{ message }}</p>
                    <div class="flex gap-3">
                        <button @click="$emit('confirm')"
                            :class="danger ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'"
                            class="flex-1 text-white px-4 py-2 cursor-pointer rounded-lg transition text-sm font-medium">
                            {{ confirmLabel }}
                        </button>
                        <button @click="$emit('cancel')"
                            class="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 cursor-pointer rounded-lg transition text-sm font-medium">
                            {{ cancelLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>