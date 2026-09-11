<template>
  <header class="w-full bg-[#f7f5f0] border-b border-gray-100 px-6 py-4 flex items-center">
    <img src="@/assets/budgetlogo.png" alt="BudgetVault Logo" class="h-20 w-auto object-contain" />
    <div class="flex flex-col -ml-1">
      <div class="flex items-center gap-2.5">
        <div class="flex items-baseline font-extrabold leading-none tracking-[-1.8px]">
          <span class="text-[30px] text-[#074033]"> Budget </span>

          <span class="text-[29px] text-[#D4A72C]"> Vault </span>
        </div>

        <span
          class="border-l-2 border-[#D4A72C] pl-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#074033]"
        >
          Business
        </span>
      </div>

      <span class="mt-1 h-[3px] w-[38px] rounded-full bg-[#D4A72C]"></span>
    </div>
    <!-- LEFT SPACER -->

    <div class="flex-1"></div>

    <!-- RIGHT SECTION -->

    <div class="flex justify-end items-center flex-1 gap-3">
      <!-- MOBILE SUPPORT

      <div class="sm:hidden">
        <button
          ref="supportBtnRef"
          class="w-9 h-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center shadow-sm"
          :class="{
            'rotate-45': supportOpen
          }"
          style="transition: transform 0.2s ease"
          @click.stop="toggleSupport"
          aria-label="Contact support"
        >
          <v-icon size="16">
            {{ supportOpen ? 'mdi-close' : 'mdi-chat-processing' }}
          </v-icon>
        </button>
      </div> -->

      <!-- contact support -->

      <!-- notifications -->
      <button
        type="button"
        class="mr-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#FFF3C4] text-[#D4A72C] shadow-sm transition-all duration-200 hover:bg-[#D4A72C] hover:text-white"
        @click="$router.push('/notifications')"
        aria-label="Notifications"
      >
        <i class="mdi mdi-bell-alert-outline text-[20px]"></i>
      </button>

      <!-- USER -->

      <router-link to="/userprofile" class="flex">
        <div class="flex items-center gap-3 cursor-pointer">
          <!-- USER AVATAR -->

          <div
            class="w-9 h-9 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs shadow-sm"
          >
            {{ initials }}
          </div>
        </div>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Contact from '@/layouts/sidebar/contacts.vue'

const router = useRouter()

const props = defineProps({
  drawer: Boolean
})

const emit = defineEmits(['update:drawer'])

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer)
}

const initials = ref('O.E')
</script>

<style scoped>
/* =====================================================
   SUPPORT DROPDOWN
===================================================== */

.support-menu-dropdown {
  position: fixed;

  display: flex;

  flex-direction: column;

  gap: 8px;

  z-index: 100000;
}

/* =====================================================
   SUPPORT OPTION
===================================================== */

.support-option {
  display: flex;

  align-items: center;

  gap: 8px;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 999px;

  padding: 8px 14px 8px 8px;

  font-size: 13px;

  font-weight: 600;

  color: #374151;

  cursor: pointer;

  white-space: nowrap;

  text-decoration: none;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.support-option:hover {
  transform: translateX(-2px);

  border-color: #bbf7d0;

  color: #16a34a;

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.1);
}

/* =====================================================
   SUPPORT ICON
===================================================== */

.option-icon {
  width: 28px;

  height: 28px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  color: white;

  flex-shrink: 0;
}

.option-wa {
  background: #16a34a;
}

.option-mail {
  background: #15803d;
}

/* =====================================================
   BACKDROP
===================================================== */

.support-nav-backdrop {
  position: fixed;

  inset: 0;

  z-index: 99999;
}

/* =====================================================
   ANIMATION
===================================================== */

.fab-menu-enter-active,
.fab-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fab-menu-enter-from,
.fab-menu-leave-to {
  opacity: 0;

  transform: translateY(-6px);
}
</style>
