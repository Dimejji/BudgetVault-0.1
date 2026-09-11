<script setup>
import { ref, computed } from 'vue'
import MainLayout from '../MainLayout.vue'
import SettlementsTab from '@/components/SettlementsTab.vue'
import ExpenseClaimsTab from '@/components/ExpenseClaimsTab.vue'
import CategoriesTab from '@/components/CategoriesTab.vue'
import { useSettlements } from '@/stores/useSettlements.js'
import { useClaims } from '@/stores/useClaims.js'
import { formatNaira } from '@/stores/currency.js'

// ---------- Tabs ----------
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'settlements', label: 'Settlements' },
  { id: 'claims', label: 'Expense Claims' },
  { id: 'categories', label: 'Categories' },
]

const activeTab = ref('overview')

// Only the summary data the Overview tab needs is pulled in here — the
// rest of each tab's state/logic now lives inside its own component.
const {
  isModalOpen: isSettlementModalOpen,
  pendingSettlements,
  pendingSettlementTotal,
} = useSettlements()

const { isModalOpen: isClaimModalOpen, pendingClaims, pendingClaimsTotal } = useClaims()

function openSettlementForm() {
  activeTab.value = 'settlements'
  isSettlementModalOpen.value = true
}

function openClaimForm() {
  activeTab.value = 'claims'
  isClaimModalOpen.value = true
}

// ---------- Overview Spending ----------
const augustSpending = ref([
  { name: 'Payroll', amount: 0 },
  { name: 'Operations', amount: 0 },
  { name: 'Marketing', amount: 0 },
  { name: 'Utilities', amount: 0},
  { name: 'Transportation', amount: 0},
  { name: 'Other', amount: 0 },
])

const julyTotal = 0

const augustTotal = computed(() =>
  augustSpending.value.reduce((total, item) => total + item.amount, 0)
)

const spendingChange = computed(() => {
  if (julyTotal === 0) return 0
  return ((augustTotal.value - julyTotal) / julyTotal) * 100
})

const reportNet = 0
</script>

<template>
  <MainLayout>
    <body class=" text-slate-800 antialiased">
      <div id="app" v-cloak class="min-h-screen">
        <!-- Top Nav -->
        <header class=" border-b  sticky top-0 z-30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <p class="text-2xl font-bold text-slate-500 -mt-0.5">Spending & Settlement</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="openSettlementForm"
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg- bg-gold rounded-lg"
              >
                + Settlement
              </button>
              <button
                @click="openClaimForm"
                class="inline-flex items-center gap-2 px-4 py-2 bg-gold  hover:bg-brand-700 text-white text-sm font-medium rounded-lg shadow-sm"
              >
                + Expense Claim
              </button>
            </div>
          </div>
        </header>

        <!-- Tabs -->
        <div class="bg-white border-b border-slate-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex gap-1 overflow-x-auto py-2 text-sm font-medium">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-4 py-2 rounded-lg whitespace-nowrap transition',
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <!-- ==================== OVERVIEW ==================== -->
          <template v-if="activeTab === 'overview'">
            <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <p class="text-sm font-medium text-slate-500">Pending Settlements</p>
                <p class="mt-1 text-3xl font-bold text-slate-900">{{ pendingSettlements.length }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ formatNaira(pendingSettlementTotal) }} owed</p>
              </div>
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <p class="text-sm font-medium text-slate-500">Pending Claims</p>
                <p class="mt-1 text-3xl font-bold text-slate-900">{{ pendingClaims.length }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ formatNaira(pendingClaimsTotal) }} awaiting</p>
              </div>
              <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <p class="text-sm font-medium text-slate-500">Aug Spending</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{{ formatNaira(augustTotal) }}</p>
                <p class="text-xs mt-1" :class="spendingChange >= 0 ? 'text-red-600' : 'text-emerald-600'">
                  {{ spendingChange >= 0 ? '↑' : '↓' }} {{ Math.abs(spendingChange).toFixed(1) }}% vs July
                </p>
              </div>
              <div class="bg-white rounded-xl border border-brand-200 bg-brand-50 p-5 shadow-sm">
                <p class="text-sm font-medium text-brand-700">Net Cash Flow (Aug)</p>
                <p class="mt-1 text-2xl font-bold text-brand-800">{{ formatNaira(reportNet) }}</p>
                <p class="text-xs text-brand-600 mt-1">Revenue − Expenses</p>
              </div>
            </section>

            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 class="font-semibold text-slate-900 mb-2">Why spending changed</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Spending increased primarily because <strong>payroll increased ₦400k</strong> and
                <strong>marketing spending increased ₦350k</strong>. Operations and utilities stayed relatively flat.
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100">
                  <h3 class="font-semibold text-slate-900">August Spending</h3>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li v-for="cat in augustSpending" :key="cat.name" class="px-5 py-3 flex justify-between text-sm">
                    <span class="text-slate-600">{{ cat.name }}</span>
                    <span class="font-medium tabular-nums">{{ formatNaira(cat.amount) }}</span>
                  </li>
                  <li class="px-5 py-3 flex justify-between text-sm font-semibold bg-slate-50">
                    <span>Total</span>
                    <span class="text-brand-700">{{ formatNaira(augustTotal) }}</span>
                  </li>
                </ul>
              </div>

              <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 class="font-semibold text-slate-900">Pending Settlements</h3>
                  <button @click="activeTab = 'settlements'" class="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</button>
                </div>
                <ul class="divide-y divide-slate-100">
                  <li v-for="s in pendingSettlements.slice(0, 4)" :key="s.id" class="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                    <div class="min-w-0">
                      <p class="font-medium text-slate-900 truncate">{{ s.description }}</p>
                      <p class="text-xs text-slate-500">{{ s.person }} · {{ s.direction === 'business_owes' ? 'Business owes' : 'Owes business' }}</p>
                    </div>
                    <span class="font-semibold tabular-nums shrink-0">{{ formatNaira(s.amount) }}</span>
                  </li>
                  <li v-if="pendingSettlements.length === 0" class="px-5 py-8 text-center text-slate-500 text-sm">No pending settlements</li>
                </ul>
              </div>
            </div>
          </template>

          <!-- ==================== SETTLEMENTS ==================== -->
          <SettlementsTab v-if="activeTab === 'settlements'" />

          <!-- ==================== EXPENSE CLAIMS ==================== -->
          <ExpenseClaimsTab v-if="activeTab === 'claims'" />

          <!-- ==================== CATEGORIES ==================== -->
          <CategoriesTab v-if="activeTab === 'categories'" />
        </main>
      </div>
    </body>
  </MainLayout>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
