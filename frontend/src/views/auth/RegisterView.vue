<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@stores/user'
import { useToast } from '@/composables/useToast'
import AInput from '@components/common/AInput.vue'
import AButton from '@components/common/AButton.vue'
import AIcon from '@components/common/AIcon.vue'
import ACard from '@components/common/ACard.vue'
import Container from '@components/layout/Container.vue'
import Stack from '@components/layout/Stack.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const { t, locale } = useI18n()

// Validation messages — bilingual pairs (kept inline since they're validation, not chrome)
const msg = (en: string, zh: string) => locale.value === 'zh' ? zh : en

const username = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const nickname = ref('')
const error = ref<string | null>(null)

async function submit() {
  error.value = null
  if (username.value.length < 3) { error.value = msg('Username must be at least 3 characters', '用户名至少 3 个字符'); return }
  if (!/^[a-zA-Z0-9_-]+$/.test(username.value)) { error.value = msg('Letters, numbers, _ and - only', '只允许字母、数字、_ 和 -'); return }
  if (!/.+@.+\..+/.test(email.value)) { error.value = msg('Please enter a valid email', '请输入有效的邮箱地址'); return }
  if (password.value.length < 6) { error.value = msg('Password must be at least 6 characters', '密码至少 6 个字符'); return }
  if (password.value !== confirm.value) { error.value = msg('Passwords do not match', '两次密码输入不一致'); return }
  try {
    const u = await userStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
      nickname: nickname.value || undefined
    })
    toast.success(locale.value === 'zh' ? `欢迎,${u.nickname || u.username}!` : `Welcome, ${u.nickname || u.username}!`)
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : msg('Registration failed', '注册失败')
  }
}
</script>

<template>
  <main class="auth-page">
    <Container size="sm">
      <ACard variant="glow">
        <Stack :gap="5" align="center">
          <header class="head">
            <AIcon name="user-plus" :size="28" />
            <h1>{{ t('auth.registerTitle') }}</h1>
            <p class="muted">{{ t('auth.registerSubtitle') }}</p>
          </header>

          <form class="form" @submit.prevent="submit">
            <Stack :gap="4">
              <Stack :gap="2">
                <label class="lbl">{{ t('auth.username') }}</label>
                <AInput v-model="username" placeholder="your_username" prefix-icon="user" autofocus block />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">{{ t('auth.email') }}</label>
                <AInput v-model="email" type="email" placeholder="you@example.com" prefix-icon="mail" block />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">{{ t('auth.nickname') }} <span class="hint">{{ t('common.optional') }}</span></label>
                <AInput v-model="nickname" :placeholder="t('auth.nickname')" block />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">{{ t('auth.password') }} <span class="hint">≥ 6</span></label>
                <AInput v-model="password" type="password" placeholder="••••••" prefix-icon="lock" block />
              </Stack>
              <Stack :gap="2">
                <label class="lbl">{{ t('auth.confirmPassword') }}</label>
                <AInput v-model="confirm" type="password" placeholder="••••••" prefix-icon="lock" block />
              </Stack>
              <p v-if="error" class="error">{{ error }}</p>
              <AButton type="submit" variant="primary" size="lg" :loading="userStore.loading" block>
                {{ t('nav.signup') }}
              </AButton>
            </Stack>
          </form>

          <p class="muted small">
            {{ t('auth.haveAccount') }}
            <RouterLink to="/login" class="link">{{ t('auth.signInHere') }}</RouterLink>
          </p>
          <p class="muted small">
            <RouterLink to="/" class="link">← {{ t('notFound.backHome') }}</RouterLink>
          </p>
        </Stack>
      </ACard>
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
.head {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.head h1 {
  font-size: var(--fs-h2);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0;
}
.muted { color: var(--text-tertiary); margin: 0; font-size: var(--fs-body-sm); }
.muted.small { font-size: var(--fs-caption); }

.lbl {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  line-height: 1.4;
}
.hint {
  text-transform: none;
  letter-spacing: 0;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 400;
}

.form :deep(.stack) {
  width: 100%;
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

.link {
  color: var(--accent-primary);
  text-decoration: none;
}
.link:hover { color: var(--accent-secondary); }
</style>
