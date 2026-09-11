
import { computed, ref } from 'vue'

/*
|--------------------------------------------------------------------------
| Expense Tracking Store
|--------------------------------------------------------------------------
| Handles business expense and income transactions.
|
| This store is intentionally independent from:
| - Settlements
| - Expense Claims
| - Categories
| - Payroll
|
| Those modules can connect to this store later when needed.
|--------------------------------------------------------------------------
*/

const transactions = ref([])

const isModalOpen = ref(false)

const filters = ref({
  type: 'all',
  category: 'all',
  month: 'current',
})

const expenseForm = ref({
  description: '',
  amount: 0,
  category: '',
  type: 'expense',
  date: '',
  notes: '',
})

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

const categories = computed(() => {
  const uniqueCategories = transactions.value
    .filter((transaction) => transaction.type === 'expense')
    .map((transaction) => transaction.category)
    .filter(Boolean)

  return [...new Set(uniqueCategories)]
})

/*
|--------------------------------------------------------------------------
| Totals
|--------------------------------------------------------------------------
*/

const expenses = computed(() =>
  transactions.value.filter(
    (transaction) => transaction.type === 'expense'
  )
)

const income = computed(() =>
  transactions.value.filter(
    (transaction) => transaction.type === 'income'
  )
)

const totalExpenses = computed(() =>
  expenses.value.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  )
)

const totalIncome = computed(() =>
  income.value.reduce(
    (total, transaction) => total + Number(transaction.amount || 0),
    0
  )
)

const netCashFlow = computed(
  () => totalIncome.value - totalExpenses.value
)

const transactionCount = computed(
  () => transactions.value.length
)

/*
|--------------------------------------------------------------------------
| Largest Spending Category
|--------------------------------------------------------------------------
*/

const categoryTotals = computed(() => {
  const totals = {}

  expenses.value.forEach((transaction) => {
    const category = transaction.category || 'Other'

    if (!totals[category]) {
      totals[category] = 0
    }

    totals[category] += Number(transaction.amount || 0)
  })

  return totals
})

const largestCategory = computed(() => {
  const entries = Object.entries(categoryTotals.value)

  if (!entries.length) {
    return {
      name: '—',
      amount: 0,
    }
  }

  const [name, amount] = entries.reduce(
    (largest, current) =>
      current[1] > largest[1] ? current : largest
  )

  return {
    name,
    amount,
  }
})

/*
|--------------------------------------------------------------------------
| Category Pulse
|--------------------------------------------------------------------------
*/

const categoryPulse = computed(() => {
  const entries = Object.entries(categoryTotals.value)

  if (!entries.length) {
    return []
  }

  const maximum = Math.max(...entries.map(([, amount]) => amount))

  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      percent:
        maximum > 0
          ? Math.round((amount / maximum) * 100)
          : 0,
    }))
})

/*
|--------------------------------------------------------------------------
| Recent Transactions
|--------------------------------------------------------------------------
*/

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
    .slice(0, 10)
})

/*
|--------------------------------------------------------------------------
| Filtered Transactions
|--------------------------------------------------------------------------
*/

const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const typeMatches =
      filters.value.type === 'all' ||
      transaction.type === filters.value.type

    const categoryMatches =
      filters.value.category === 'all' ||
      transaction.category === filters.value.category

    return typeMatches && categoryMatches
  })
})

/*
|--------------------------------------------------------------------------
| Add Transaction
|--------------------------------------------------------------------------
*/

function addTransaction(transactionData) {
  if (!transactionData) return false

  const description = String(
    transactionData.description || ''
  ).trim()

  const amount = Number(transactionData.amount)

  if (!description || !amount || amount <= 0) {
    return false
  }

  const transaction = {
    id: crypto.randomUUID(),

    description,

    amount,

    category:
      String(transactionData.category || '').trim() ||
      'Other',

    type:
      transactionData.type === 'income'
        ? 'income'
        : 'expense',

    date:
      transactionData.date ||
      new Date().toISOString(),

    notes:
      String(transactionData.notes || '').trim(),

    createdAt: new Date().toISOString(),
  }

  transactions.value.unshift(transaction)

  return transaction
}

/*
|--------------------------------------------------------------------------
| Add Expense
|--------------------------------------------------------------------------
*/

function addExpense(expenseData) {
  return addTransaction({
    ...expenseData,
    type: 'expense',
  })
}

/*
|--------------------------------------------------------------------------
| Add Income
|--------------------------------------------------------------------------
*/

function addIncome(incomeData) {
  return addTransaction({
    ...incomeData,
    type: 'income',
  })
}

/*
|--------------------------------------------------------------------------
| Delete Transaction
|--------------------------------------------------------------------------
*/

function deleteTransaction(id) {
  const index = transactions.value.findIndex(
    (transaction) => transaction.id === id
  )

  if (index === -1) {
    return false
  }

  transactions.value.splice(index, 1)

  return true
}

/*
|--------------------------------------------------------------------------
| Update Transaction
|--------------------------------------------------------------------------
*/

function updateTransaction(id, updates) {
  const transaction = transactions.value.find(
    (item) => item.id === id
  )

  if (!transaction) {
    return false
  }

  Object.assign(transaction, {
    ...updates,
    amount:
      updates.amount !== undefined
        ? Number(updates.amount)
        : transaction.amount,
  })

  return transaction
}

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
*/

function setTypeFilter(type) {
  filters.value.type = type
}

function setCategoryFilter(category) {
  filters.value.category = category
}

function resetFilters() {
  filters.value = {
    type: 'all',
    category: 'all',
    month: 'current',
  }
}

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function openModal() {
  expenseForm.value = {
    description: '',
    amount: 0,
    category: '',
    type: 'expense',
    date: '',
    notes: '',
  }

  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

/*
|--------------------------------------------------------------------------
| Store
|--------------------------------------------------------------------------
*/

export function useExpenseTracking() {
  return {
    // State
    transactions,
    expenses,
    income,
    isModalOpen,
    expenseForm,
    filters,

    // Computed
    categories,
    totalExpenses,
    totalIncome,
    netCashFlow,
    transactionCount,
    largestCategory,
    categoryTotals,
    categoryPulse,
    recentTransactions,
    filteredTransactions,

    // Transactions
    addTransaction,
    addExpense,
    addIncome,
    updateTransaction,
    deleteTransaction,

    // Filters
    setTypeFilter,
    setCategoryFilter,
    resetFilters,

    // Modal
    openModal,
    closeModal,
  }
}
