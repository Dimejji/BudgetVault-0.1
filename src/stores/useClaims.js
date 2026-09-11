import { ref, computed } from 'vue'

const claims = ref([])

const isModalOpen = ref(false)

const pendingClaims = computed(() =>
  claims.value.filter((claim) => claim.status === 'pending')
)

const pendingClaimsTotal = computed(() =>
  pendingClaims.value.reduce((total, claim) => total + claim.amount, 0)
)

function addClaim({ employee, amount, category, description }) {
  const cleanEmployee = employee.trim()
  const cleanDescription = description.trim()
  const cleanAmount = Number(amount) || 0

  if (!cleanEmployee || !cleanDescription || cleanAmount <= 0) {
    return false
  }

  claims.value.unshift({
    id: Date.now(),
    employee: cleanEmployee,
    amount: cleanAmount,
    category,
    description: cleanDescription,
    receipt: false,
    status: 'pending',
    date: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  })

  return true
}

function updateClaim(id, status) {
  const claim = claims.value.find((item) => item.id === id)
  if (claim) {
    claim.status = status
  }
}

export function useClaims() {
  return {
    claims,
    isModalOpen,
    pendingClaims,
    pendingClaimsTotal,
    addClaim,
    updateClaim,
  }
}
