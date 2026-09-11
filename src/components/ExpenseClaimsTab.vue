<script setup>
import { computed, ref } from 'vue'
import { useClaims } from '@/stores/useClaims.js'
import { useCategories } from '@/stores/useCategories.js'
import { formatNaira } from '@/stores/currency.js'

const {
  claims,
  isModalOpen,
  updateClaim,
  addClaim,
} = useClaims()

const { categories } = useCategories()

const claimFilter = ref('all')

const emptyClaimForm = () => ({
  employee: '',
  amount: 0,
  category: '',
  description: '',
})

const claimForm = ref(emptyClaimForm())

const filters = ['all', 'pending', 'approved', 'rejected']

const filteredClaims = computed(() => {
  if (claimFilter.value === 'all') {
    return claims.value
  }

  return claims.value.filter(
    (claim) => claim.status === claimFilter.value
  )
})

function openModal() {
  claimForm.value = emptyClaimForm()
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  claimForm.value = emptyClaimForm()
}

function handleSubmit() {
  const created = addClaim({
    ...claimForm.value,
    amount: Number(claimForm.value.amount),
  })

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
          Expense Claims
        </h2>

        <p class="mt-0.5 text-sm text-slate-500">
          Employees submit expenses for manager approval.
        </p>
      </div>

      <button
        type="button"
        @click="openModal"
        class="inline-flex items-center justify-center gap-2 px-4 py-2
               bg-brand-600 hover:bg-brand-700
               text-white text-sm font-medium rounded-lg
               transition"
      >
        + Submit Claim
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        @click="claimFilter = filter"
        :class="[
          'px-3 py-1.5 text-sm rounded-lg capitalize transition',
          claimFilter === filter
            ? 'bg-brand-100 text-brand-700 font-medium'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        ]"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Claims -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

      <!-- Empty -->
      <div
        v-if="filteredClaims.length === 0"
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
              d="M9 14l2 2 4-4m5-3V7a2 2 0 00-2-2h-3.5L13 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-5"
            />
          </svg>
        </div>

        <h3 class="text-sm font-semibold text-slate-800">
          No expense claims
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          Expense claims submitted by employees will appear here.
        </p>
      </div>

      <!-- Claim list -->
      <ul
        v-else
        class="divide-y divide-slate-100"
      >
        <li
          v-for="claim in filteredClaims"
          :key="claim.id"
          class="px-5 py-4 flex flex-col sm:flex-row
                 sm:items-start gap-4 hover:bg-slate-50/60 transition"
        >
          <div class="flex-1 min-w-0">

            <div class="flex items-center gap-2 flex-wrap">
              <p class="font-medium text-slate-900">
                {{ claim.description }}
              </p>

              <span
                v-if="claim.category"
                class="text-xs px-2 py-0.5 rounded-full
                       bg-slate-100 text-slate-600"
              >
                {{ claim.category }}
              </span>

              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                  claim.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : claim.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                ]"
              >
                {{ claim.status }}
              </span>
            </div>

            <p class="mt-1 text-sm text-slate-500">
              {{ claim.employee }}
              <span v-if="claim.date"> · {{ claim.date }}</span>
            </p>

            <p
              v-if="claim.receipt"
              class="mt-1 text-xs text-brand-600"
            >
              📎 Receipt attached
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <span class="text-lg font-semibold tabular-nums text-slate-900">
              {{ formatNaira(claim.amount) }}
            </span>

            <template v-if="claim.status === 'pending'">
              <button
                type="button"
                @click="updateClaim(claim.id, 'approved')"
                class="px-3 py-1.5 text-sm font-medium
                       bg-emerald-600 hover:bg-emerald-700
                       text-white rounded-lg transition"
              >
                Approve
              </button>

              <button
                type="button"
                @click="updateClaim(claim.id, 'rejected')"
                class="px-3 py-1.5 text-sm font-medium
                       bg-white border border-slate-300
                       hover:bg-slate-50 text-slate-700
                       rounded-lg transition"
              >
                Reject
              </button>
            </template>
          </div>
        </li>
      </ul>
    </div>

    <!-- Submit Claim Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center
               p-4 bg-slate-950/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="w-full max-w-md overflow-hidden
                 rounded-2xl bg-white shadow-2xl"
        >

          <!-- Modal Header -->
          <div
            class="px-6 py-5 border-b border-slate-100
                   flex items-center justify-between"
          >
            <div>
              <h3 class="text-lg font-semibold text-slate-900">
                Submit Expense Claim
              </h3>

              <p class="mt-0.5 text-xs text-slate-500">
                Add an employee expense for approval.
              </p>
            </div>

            <button
              type="button"
              @click="closeModal"
              class="text-slate-400 hover:text-slate-600 transition"
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

            <!-- Employee -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Employee
              </label>

              <input
                v-model.trim="claimForm.employee"
                required
                placeholder="e.g. Sarah"
                class="w-full px-3 py-2 border border-slate-300
                       rounded-lg outline-none
                       focus:ring-2 focus:ring-brand-500
                       focus:border-brand-500"
              />
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Amount (₦)
              </label>

              <input
                v-model.number="claimForm.amount"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-slate-300
                       rounded-lg outline-none
                       focus:ring-2 focus:ring-brand-500
                       focus:border-brand-500"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>

              <select
                v-model="claimForm.category"
                class="w-full px-3 py-2 border border-slate-300
                       rounded-lg outline-none
                       focus:ring-2 focus:ring-brand-500
                       focus:border-brand-500"
              >
                <option value="">
                  Select category
                </option>

                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>

              <input
                v-model.trim="claimForm.description"
                required
                placeholder="e.g. Client meeting transport"
                class="w-full px-3 py-2 border border-slate-300
                       rounded-lg outline-none
                       focus:ring-2 focus:ring-brand-500
                       focus:border-brand-500"
              />
            </div>

            <!-- Receipt -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Receipt
              </label>

              <div
                class="border border-dashed border-slate-300
                       rounded-lg px-4 py-6 text-center"
              >
                <p class="text-sm text-slate-500">
                  📎 Upload receipt
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  Receipt upload can be connected later.
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2.5
                       border border-slate-300 rounded-lg
                       text-slate-700 hover:bg-slate-50
                       font-medium transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="flex-1 px-4 py-2.5
                       bg-brand-600 hover:bg-brand-700
                       text-white rounded-lg
                       font-medium transition"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>