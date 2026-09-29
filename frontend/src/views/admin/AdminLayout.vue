<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute, RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'
import AIcon from '@components/common/AIcon.vue'
import AAvatar from '@components/common/AAvatar.vue'
import AButton from '@components/common/AButton.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const toast = useToast()

const navItems = [
  { name: 'admin-dashboard', label: 'Dashboard',     icon: 'grid' },
  { name: 'admin-articles',  label: 'Articles',      icon: 'file-text' },
  { name: 'admin-cases',     label: 'Cases',         icon: 'briefcase' },
  { name: 'admin-tools',     label: 'Tools',         icon: 'wrench' },
  { name: 'admin-users',     label: 'Users',         icon: 'users' },
  { name: 'admin-settings',  label: 'Settings',      icon: 'settings' }
]

const currentTitle = computed(() => {
  const item = navItems.find((i) => i.name === route.name)
  return item?.label ?? 'Admin'
})

const userInitial = computed(() => {
  const u = userStore.user
  if (!u) return 'A'
  return (u.nickname || u.username || 'A').slice(0, 1).toUpperCase()
})

function handleLogout() {
  userStore.logout()
  toast.success('Signed out')
  router.push('/')
}
</script>

<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="brand">
        <RouterLink to="/admin" class="brand-link">
          <span class="brand-mark">A</span>
          <span class="brand-text">Aindgc Admin</span>
        </RouterLink>
      </div>

      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-item"
          active-class="is-active"
        >
          <AIcon :name="item.icon" :size="16" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-foot">
        <RouterLink to="/" class="back-link">
          <AIcon name="arrow-left" :size="14" />
          <span>Back to site</span>
        </RouterLink>
      </div>
    </aside>

    <!-- Main column -->
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <h1 class="topbar-title">{{ currentTitle }}</h1>
          <span class="topbar-sub">admin.aindgc.com</span>
        </div>
        <div class="topbar-right">
          <AAvatar :initial="userInitial" :size="32" />
          <div class="topbar-user">
            <span class="topbar-name">{{ userStore.displayName }}</span>
            <span class="topbar-role">ADMIN</span>
          </div>
          <AButton variant="ghost" size="sm" @click="handleLogout">
            <AIcon name="log-out" :size="14" /> Sign out
          </AButton>
        </div>
      </header>

      <main class="admin-content">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: var(--bg-base, #07090d);
  color: var(--fg-base, #e8eaf0);
}

/* ── Sidebar ── */
.admin-sidebar {
  background: var(--bg-surface, #0b0e13);
  border-right: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  padding: 0 8px 24px;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  margin-bottom: 16px;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--fg-base, #e8eaf0);
}
.brand-mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4a9eff 0%, #38d5c4 100%);
  color: #07090d;
  font-weight: 700;
  font-size: 14px;
  display: grid;
  place-items: center;
}
.brand-text {
  font-weight: 600;
  letter-spacing: 0.02em;
  font-size: 14px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--fg-muted, #8a93a6);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.15s ease;
}
.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--fg-base, #e8eaf0);
}
.nav-item.is-active {
  background: rgba(74, 158, 255, 0.08);
  color: #4a9eff;
  border-left: 2px solid #4a9eff;
  padding-left: 10px;
}

.sidebar-foot {
  padding-top: 16px;
  border-top: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
}
.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--fg-faint, #5b6478);
  text-decoration: none;
  font-size: 12.5px;
  transition: all 0.15s ease;
}
.back-link:hover {
  color: var(--fg-base, #e8eaf0);
  background: rgba(255, 255, 255, 0.03);
}

/* ── Main column ── */
.admin-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
  background: rgba(11, 14, 19, 0.6);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.topbar-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.01em;
}
.topbar-sub {
  font-size: 12px;
  color: var(--fg-faint, #5b6478);
  font-family: var(--font-mono, monospace);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-user {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.topbar-name {
  font-size: 13px;
  font-weight: 500;
}
.topbar-role {
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: #4a9eff;
  font-weight: 600;
}

.admin-content {
  padding: 32px;
  max-width: 1400px;
  width: 100%;
}

/* ── Route transition ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ── */
@media (max-width: 880px) {
  .admin-shell {
    grid-template-columns: 1fr;
  }
  .admin-sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    padding: 12px 16px;
    align-items: center;
  }
  .brand {
    border: 0;
    padding: 0;
    margin: 0;
  }
  .nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 4px;
    flex: 1;
    margin: 0 12px;
  }
  .nav-item {
    white-space: nowrap;
    padding: 6px 10px;
  }
  .nav-item.is-active {
    border-left: 0;
    padding-left: 10px;
  }
  .sidebar-foot {
    display: none;
  }
  .admin-topbar {
    padding: 12px 16px;
  }
  .admin-content {
    padding: 20px 16px;
  }
}
</style>