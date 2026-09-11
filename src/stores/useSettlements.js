import { ref, computed } from 'vue'

// Module-level state so every component that calls useSettlements()
// shares the same list (acts like a tiny store without pulling in Pinia).
const settlements = ref([])

// Whether the "New Settlement" modal is open. Lives here (rather than in
// a component) so the header button in the parent and the modal inside
// SettlementsTab can both control it.
const isModalOpen = ref(false)

const pendingSettlements = computed(() =>
  settlements.value.filter((settlement) => settlement.status === 'pending')
)

const pendingSettlementTotal = computed(() =>
  pendingSettlements.value.reduce((total, s) => total + s.amount, 0)
)

function addSettlement({ description, person, amount, direction }) {
  const cleanDescription = description.trim()
  const cleanPerson = person.trim()
  const cleanAmount = Number(amount) || 0

  if (!cleanDescription || !cleanPerson || cleanAmount <= 0) {
    return false
  }

  settlements.value.unshift({
    id: Date.now(),
    description: cleanDescription,
    person: cleanPerson,
    amount: cleanAmount,
    direction,
    status: 'pending',
    date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  })

  return true
}

function completeSettlement(id) {
  const settlement = settlements.value.find((item) => item.id === id)
  if (settlement) {
    settlement.status = 'completed'
  }
}

export function useSettlements() {
  return {
    settlements,
    isModalOpen,
    pendingSettlements,
    pendingSettlementTotal,
    addSettlement,
    completeSettlement,
  }
}
