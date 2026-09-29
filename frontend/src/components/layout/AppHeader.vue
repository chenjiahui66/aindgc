<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Container from './Container.vue'
import AIcon from '@components/common/AIcon.vue'
import AButton from '@components/common/AButton.vue'
import AAvatar from '@components/common/AAvatar.vue'
import AEmpty from '@components/common/AEmpty.vue'
import LangSwitch from '@components/common/LangSwitch.vue'
import { useUserStore } from '@stores/user'
import { useToast } from '@composables/useToast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const scrolled = ref(false)
const mobileOpen = ref(false)
const openMega = ref<string | null>(null)

interface MegaSection {
  title: string
  description: string
  items: { label: string; description: string; to: string }[]
}
interface NavItem {
  key: string
  label: string
  to?: string
  mega?: MegaSection[]
}

// Nav structure — labels resolved via t() so they react to locale changes
const nav = computed<NavItem[]>(() => [
  {
    key: 'tools',
    label: t('nav.tools'),
    mega: [
      {
        title: 'AI Agents',
        description: t('nav.tools') + ' · Agents',
        items: [
          { label: 'Agent Workflow Generator', description: t('hero.subtitle'), to: '/tools/agent-workflow-generator' },
          { label: 'Agent Skills Generator',    description: 'SKILL.md for Claude Code / Codex', to: '/tools/agent-skills-generator' },
          { label: 'Context Builder',            description: 'Structured context packs',     to: '/tools/context-builder' }
        ]
      },
      {
        title: 'AI Coding',
        description: t('nav.tools') + ' · Coding',
        items: [
          { label: 'Coding Project Starter', description: 'AGENTS.md + project scaffold',  to: '/tools/coding-project-starter' },
          { label: 'Prompt Structure Builder', description: 'Structured prompts', to: '/tools/prompt-structure-builder' },
          { label: 'Output Schema Generator', description: 'JSON Schema / TypeScript types', to: '/tools/output-schema-generator' }
        ]
      }
    ]
  },
  { key: 'workflow', label: t('nav.workflow'), to: '/workflow' },
  {
    key: 'insights',
    label: t('nav.insights'),
    mega: [
      {
        title: t('nav.cases'),
        description: t('home.section.06-cases.subtitle'),
        items: [
          { label: t('footer.links.roi'),       description: t('home.section.04-roi.subtitle'), to: '/roi' },
          { label: t('footer.links.checkup'),  description: t('home.section.05-checkup.subtitle'), to: '/checkup' },
          { label: t('footer.links.cases'),     description: t('home.section.06-cases.subtitle'), to: '/cases' }
        ]
      },
      {
        title: t('nav.skills'),
        description: t('nav.coding'),
        items: [
          { label: t('footer.links.skills'),  description: 'SKILL.md for AI agents',  to: '/skills' },
          { label: t('footer.links.coding'),  description: 'Coding project starters', to: '/coding' },
          { label: t('nav.cases'),             description: t('home.section.06-cases.title'), to: '/cases' }
        ]
      }
    ]
  },
  { key: 'cases', label: t('nav.cases'), to: '/cases' }
])

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function toggleMega(label: string) {
  openMega.value = openMega.value === label ? null : label
}
function closeMega() {
  openMega.value = null
}

async function doLogout() {
  await userStore.logout()
  toast.success(t('common.copied') === 'Copied' ? 'Logged out' : '已退出')
  router.push('/')
}

function goProfile() {
  router.push('/profile')
}

function goAdmin() {
  router.push('/admin')
}
</script>

<template>
  <header class="app-header" :class="{ scrolled }">
    <Container>
      <div class="bar">
        <RouterLink to="/" class="brand" aria-label="Aindgc">
          <span class="logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <rect width="32" height="32" rx="6" fill="var(--bg-elevated)" />
              <path d="M8 22V10l8 12V10" stroke="var(--accent-primary)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <circle cx="24" cy="10" r="2" fill="var(--accent-secondary)" />
            </svg>
          </span>
          <span class="logo-text">Aindgc</span>
        </RouterLink>

        <nav class="nav-desktop" aria-label="Primary">
          <div
            v-for="item in nav"
            :key="item.label"
            class="nav-item"
            @mouseenter="item.mega && toggleMega(item.label)"
            @mouseleave="item.mega && closeMega()"
          >
            <RouterLink
              v-if="item.to && !item.mega"
              :to="item.to"
              class="nav-link"
              :class="{ active: route.path.startsWith(item.to) }"
            >
              {{ item.label }}
            </RouterLink>
            <button
              v-else
              type="button"
              class="nav-link"
              :class="{ active: openMega === item.label }"
              :aria-expanded="openMega === item.label"
            >
              {{ item.label }}
              <AIcon v-if="item.mega" name="chevron-down" :size="14" />
            </button>

            <Transition name="mega">
              <div v-if="item.mega && openMega === item.label" class="mega">
                <div class="mega-grid">
                  <div v-for="(group, gi) in item.mega" :key="gi" class="mega-group">
                    <h4 class="mega-title">{{ group.title }}</h4>
                    <p class="mega-desc">{{ group.description }}</p>
                    <ul class="mega-list">
                      <li v-for="sub in group.items" :key="sub.to">
                        <RouterLink :to="sub.to" class="mega-link" @click="closeMega">
                          <span class="mega-link-label">{{ sub.label }}</span>
                          <span class="mega-link-desc">{{ sub.description }}</span>
                        </RouterLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </nav>

        <div class="actions">
          <template v-if="!userStore.isAuthenticated">
            <RouterLink to="/login" class="login-link">{{ t('nav.login') }}</RouterLink>
            <RouterLink to="/register" class="login-link">{{ t('nav.signup') }}</RouterLink>
          </template>
          <template v-else>
            <APopover placement="bottom-end" trigger="click" :width="220">
              <template #reference>
                <button class="avatar-btn" type="button" :aria-label="t('nav.profile')">
                  <AAvatar :name="userStore.displayName" size="sm" />
                  <span class="avatar-name">{{ userStore.displayName }}</span>
                  <AIcon v-if="userStore.isAdmin" name="shield" :size="12" class="admin-badge" />
                  <AIcon name="chevron-down" :size="12" />
                </button>
              </template>
              <div class="user-menu">
                <button type="button" class="menu-item" @click="goProfile">
                  <AIcon name="user" :size="14" /> {{ t('nav.profile') }}
                </button>
                <button v-if="userStore.isAdmin" type="button" class="menu-item" @click="goAdmin">
                  <AIcon name="shield" :size="14" /> {{ t('nav.admin') }}
                </button>
                <div class="menu-sep" />
                <button type="button" class="menu-item danger" @click="doLogout">
                  <AIcon name="log-out" :size="14" /> {{ t('nav.logout') }}
                </button>
              </div>
            </APopover>
          </template>
          <LangSwitch />
          <button
            class="mobile-toggle"
            type="button"
            :aria-expanded="mobileOpen"
            :aria-label="mobileOpen ? t('header.closeMenu') : t('header.openMenu')"
            @click="mobileOpen = !mobileOpen"
          >
            <AIcon :name="mobileOpen ? 'x' : 'menu'" :size="20" />
          </button>
        </div>
      </div>
    </Container>

    <Transition name="mobile">
      <div v-if="mobileOpen" class="mobile-nav">
        <Container>
          <nav>
            <template v-for="item in nav" :key="item.label">
              <RouterLink
                v-if="item.to && !item.mega"
                :to="item.to"
                class="mobile-link"
                @click="mobileOpen = false"
              >
                {{ item.label }}
                <AIcon name="arrow-right" :size="16" />
              </RouterLink>
              <details v-else class="mobile-group">
                <summary>{{ item.label }} <AIcon name="chevron-down" :size="14" /></summary>
                <ul>
                  <template v-if="item.mega">
                    <li v-for="group in item.mega" :key="group.title">
                      <p class="mobile-group-title">{{ group.title }}</p>
                      <RouterLink
                        v-for="sub in group.items"
                        :key="sub.to"
                        :to="sub.to"
                        class="mobile-sub"
                        @click="mobileOpen = false"
                      >
                        {{ sub.label }}
                      </RouterLink>
                    </li>
                  </template>
                </ul>
              </details>
            </template>
          </nav>
        </Container>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  backdrop-filter: blur(0);
  transition:
    background-color var(--duration-base) var(--ease-standard),
    backdrop-filter var(--duration-base) var(--ease-standard),
    border-color var(--duration-base) var(--ease-standard);
}
.app-header.scrolled {
  background: rgba(11, 14, 19, 0.72);
  backdrop-filter: blur(12px) saturate(140%);
  border-bottom-color: var(--border-subtle);
}

.bar {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  flex-shrink: 0;
}
.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.logo-text {
  font-size: var(--fs-body-lg);
}

.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: var(--space-5);
  flex: 1;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard);
  font-family: inherit;
}
.nav-link:hover {
  color: var(--text-primary);
  background: var(--surface-1);
}
.nav-link.active {
  color: var(--text-primary);
}

/* Mega menu */
.mega {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 540px;
  background: var(--bg-overlay);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-5);
  z-index: 10;
}
.mega-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}
.mega-title {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0 0 4px 0;
  font-weight: 500;
}
.mega-desc {
  font-size: var(--fs-body-sm);
  color: var(--text-tertiary);
  margin: 0 0 var(--space-3) 0;
}
.mega-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mega-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.mega-link:hover {
  background: var(--surface-1);
}
.mega-link-label {
  font-size: var(--fs-body-sm);
  color: var(--text-primary);
  font-weight: 500;
}
.mega-link-desc {
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
}

.mega-enter-active,
.mega-leave-active {
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard);
}
.mega-enter-from,
.mega-leave-to {
  opacity: 0;
  transform: translate(-50%, -4px);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}
.login-link {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast) var(--ease-standard);
}
.login-link:hover { color: var(--text-primary); }
.cta-link {
  color: inherit;
  text-decoration: none;
}

.avatar-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
  font-family: inherit;
  font-size: var(--fs-body-sm);
}
.avatar-btn:hover {
  border-color: var(--border-default);
  color: var(--text-primary);
}
.avatar-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.admin-badge { color: var(--accent-primary); }

.user-menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 180px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: var(--fs-body-sm);
  text-align: left;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-standard);
}
.menu-item:hover {
  background: var(--surface-1);
  color: var(--text-primary);
}
.menu-item.danger { color: var(--color-danger); }
.menu-item.danger:hover { background: rgba(226, 107, 107, 0.10); color: var(--color-danger); }
.menu-sep {
  height: 1px;
  background: var(--border-subtle);
  margin: 4px 0;
}

.mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.mobile-nav {
  background: var(--bg-overlay);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-default);
  padding: var(--space-4) 0;
}
.mobile-nav nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  font-size: var(--fs-body);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
}
.mobile-link:hover { background: var(--surface-1); }
.mobile-group {
  border-bottom: 1px solid var(--border-subtle);
  padding: 8px 0;
}
.mobile-group summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  font-size: var(--fs-body);
  color: var(--text-primary);
}
.mobile-group summary::-webkit-details-marker { display: none; }
.mobile-group ul {
  padding: 0 0 var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.mobile-group-title {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: var(--space-3) 0 4px 0;
}
.mobile-sub {
  display: block;
  padding: 8px 12px;
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
}
.mobile-sub:hover { background: var(--surface-1); color: var(--text-primary); }

.mobile-enter-active,
.mobile-leave-active {
  transition: opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard);
  overflow: hidden;
}
.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 1024px) {
  .nav-desktop { display: none; }
  .login-link { display: none; }
  .mobile-toggle { display: inline-flex; }
}
</style>
