<script setup>
import { computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAppStore } from '@/stores/app'
import { useExpenseTracking } from '@/stores/useExpenseTracking.js'
import PageHeader from '@/components/PageHeader.vue'
import StatCard from '@/components/StatCard.vue'
import BasePanel from '@/components/BasePanel.vue'
import ProgressTrack from '@/components/ProgressTrack.vue'
import { formatNaira } from '@/stores/currency.js'


const app = useAppStore()

const {
  transactions,
  totalExpenses,
  transactionCount,
  largestCategory,
  categoryPulse,
  recentTransactions,
  openModal
} = useExpenseTracking()
</script>

<template>
  <MainLayout>
    <div class="space-y-5 sm:space-y-6">
      <!-- Header -->
      <PageHeader
        eyebrow="Plan & Track"
        title="Expense Tracking"
        subtitle="Know where every naira went."
      >
        <template #actions>
          <div class="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            <button
              class="border border-bvline bg-white rounded-[11px] px-4 py-2.5 font-bold text-[12.5px] w-full sm:w-auto hover:border-green-600 hover:bg-green-50 transition"
            >
              Filter
            </button>
            <button
              class="border border-bvgreen bg-bvgreen text-white rounded-[11px] px-4 py-2.5 font-bold text-[12.5px] w-full sm:w-auto hover:bg-green-700 transition shadow-sm"
              @click="app.showToast('Expense form opened')"
            >
              ＋ Add expense
            </button>
          </div>
        </template>
      </PageHeader>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        <StatCard
          label="Spent this month"
          :value="formatNaira(totalExpenses)"
          valueClass="text-bvorange"
          meta="This month"
        />

        <StatCard label="Transactions" :value="transactionCount" meta="This month" />

        <StatCard
          label="Largest category"
          :value="largestCategory.name"
          :meta="formatNaira(largestCategory.amount)"
        />
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Recent transactions -->
        <BasePanel title="Recent transactions" meta="48 total">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex justify-between items-center py-3 border-b border-[#eff0ed]"
          >
            <div>
              <div class="text-[12.5px] font-extrabold">
                {{ transaction.description }}
              </div>

              <div class="text-[10.5px] text-bvmuted mt-0.5">
                {{ transaction.category }}
              </div>
            </div>

            <b
              class="text-[13px]"
              :class="transaction.type === 'income' ? 'text-[#188064]' : 'text-[#bd5d18]'"
            >
              {{ transaction.type === 'income' ? '+' : '−' }}
              {{ formatNaira(transaction.amount) }}
            </b>
          </div>
        </BasePanel>

        <!-- Category pulse -->
        <BasePanel title="Category pulse" meta="May">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-[12px] text-bvmuted">Food</span>
                <b class="text-[13px]">₦42,800</b>
              </div>
              <ProgressTrack :percent="72" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-[12px] text-bvmuted">Transport</span>
                <b class="text-[13px]">₦24,300</b>
              </div>
              <ProgressTrack :percent="51" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <span class="text-[12px] text-bvmuted">Shopping</span>
                <b class="text-[13px]">₦18,600</b>
              </div>
              <ProgressTrack :percent="39" />
            </div>
          </div>
        </BasePanel>
      </div>
    </div>
  </MainLayout>
</template>
