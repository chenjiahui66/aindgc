<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@stores/user'
import { useToast } from '@composables/useToast'
import AInput from '@components/common/AInput.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ACard from '@components/common/ACard.vue'
import Container from '@components/layout/Container.vue'
import Stack from '@components/layout/Stack.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  if (!username.value.trim() || !password.value) {
    error.value = 'Please enter username and password'
    return
  }
  try {
    const u = await userStore.login(username.value, password)
    toast.success(`Welcome back, ${u.nickname || u.username}`)
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed'
  }
}
</script>

<template>
  <main class="auth-page">
    <Container size="sm">
      <div class="auth-card-wrap">
        <ACard variant="glow">
          <Stack :gap="5" align="center">
            <header class="head">
              <AIcon name="log-in" :size="28" />
              <h1>Welcome back</h1>
              <p class="muted">Sign in to save workflows, sync tools, and more.</p>
            </header>

            <form class="form" @submit.prevent="submit">
              <Stack :gap="4">
                <Stack :gap="2">
                  <label class="lbl">Username</label>
                  <AInput v-model="username" placeholder="your username" prefix-icon="user" autofocus block />
                </Stack>
                <Stack :gap="2">
                  <label class="lbl">Password</label>
                  <AInput v-model="password" type="password" placeholder="••••••" prefix-icon="lock" block />
                </Stack>
                <p v-if="error" class="error">{{ error }}</p>
                <AButton type="submit" variant="primary" size="lg" :loading="userStore.loading" block>
                  <template #icon><AIcon name="arrow-right" /></template>
                  Sign in
                </AButton>
              </Stack>
            </form>

            <div class="divider"><span>or</span></div>

            <p class="muted small">
              No account yet?
              <RouterLink to="/register" class="link">Create one</RouterLink>
            </p>
            <p class="muted small">
              <RouterLink to="/" class="link">← Back to home</RouterLink>
            </p>
          </Stack>
        </ACard>
      </div>
    </Container>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-block: var(--space-9);
}

.auth-card-wrap {
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
}

.head {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.head h1 {
  font-size: var(--fs-h2);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}
.muted {
  color: var(--text-tertiary);
  margin: 0;
  font-size: var(--fs-body-sm);
}
.muted.small { font-size: var(--fs-caption); }

.lbl {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.form { width: 100%; }

.error {
  font-size: var(--fs-body-sm);
  color: var(--color-danger);
  background: rgba(226, 107, 107, 0.08);
  border: 1px solid rgba(226, 107, 107, 0.24);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  margin: 0;
}

.divider {
  width: 100%;
  text-align: center;
  position: relative;
  margin: var(--space-3) 0;
}
.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0; right: 0;
  height: 1px;
  background: var(--border-subtle);
}
.divider span {
  position: relative;
  background: var(--bg-overlay);
  padding: 0 var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.link {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-standard);
}
.link:hover { color: var(--accent-secondary); }
</style>
