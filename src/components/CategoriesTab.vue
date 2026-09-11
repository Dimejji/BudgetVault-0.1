<script setup>
import { ref } from 'vue'
import { useCategories } from '@/stores/useCategories.js'

const {
  categories,
  defaultCategories,
  isModalOpen,
  addCategory,
  removeCategory,
} = useCategories()

const newCategory = ref('')

function openModal() {
  newCategory.value = ''
  isModalOpen.value = true
}

function closeModal() {
  newCategory.value = ''
  isModalOpen.value = false
}

function handleSubmit() {
  const created = addCategory(newCategory.value)

  if (!created) return

  closeModal()
}
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">
          Spending Categories
        </h2>

        <p class="mt-0.5 text-sm text-slate-500">
          Create and manage categories for business spending.
        </p>
      </div>

      <button
        type="button"
        @click="openModal"
        class="inline-flex items-center justify-center gap-2
               px-4 py-2 bg-brand-600 hover:bg-brand-700
               text-white text-sm font-medium rounded-lg transition"
      >
        + Custom Category
      </button>
    </div>

    <!-- Categories -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      <!-- Empty state -->
      <div
        v-if="categories.length === 0"
        class="px-6 py-16 text-center"
      >
        <div
          class="mx-auto mb-4 flex h-12 w-12 items-center justify-center
                 rounded-full bg-slate-100 text-slate-400"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>

        <h3 class="text-sm font-semibold text-slate-800">
          No categories yet
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          Add a spending category to organize your business expenses.
        </p>
      </div>

      <!-- Category list -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-5"
      >
        <div
          v-for="category in categories"
          :key="category"
          class="border border-slate-200 rounded-xl
                 px-4 py-3 flex items-center justify-between
                 gap-3 hover:border-slate-300 transition"
        >
          <span class="text-sm font-medium text-slate-800 truncate">
            {{ category }}
          </span>

          <span
            v-if="defaultCategories.includes(category)"
            class="shrink-0 text-[10px] uppercase tracking-wide
                   text-slate-400"
          >
            Default
          </span>

          <button
            v-else
            type="button"
            @click="removeCategory(category)"
            class="shrink-0 text-xs text-slate-400
                   hover:text-red-500 transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center
               p-4 bg-slate-950/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="w-full max-w-sm overflow-hidden
                 rounded-2xl bg-white shadow-2xl"
        >

          <!-- Header -->
          <div
            class="px-6 py-5 border-b border-slate-100
                   flex items-center justify-between"
          >
            <h3 class="text-lg font-semibold text-slate-900">
              Add Custom Category
            </h3>

            <button
              type="button"
              @click="closeModal"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form
            @submit.prevent="handleSubmit"
            class="p-6 space-y-4"
          >
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Category name
              </label>

              <input
                v-model.trim="newCategory"
                required
                placeholder="e.g. Software"
                class="w-full px-3 py-2 border border-slate-300
                       rounded-lg outline-none
                       focus:ring-2 focus:ring-brand-500
                       focus:border-brand-500"
              />
            </div>

            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2.5
                       border border-slate-300 rounded-lg
                       text-slate-700 hover:bg-slate-50
                       font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="flex-1 px-4 py-2.5
                       bg-brand-600 hover:bg-brand-700
                       text-white rounded-lg font-medium"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>