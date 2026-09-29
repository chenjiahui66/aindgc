<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="not-found">
    <div class="container">
      <p class="code">404</p>
      <h1>Page not found</h1>
      <p class="muted">这条路径不存在 — 可能还在路上,也可能走丢了。</p>
      <button class="btn" @click="router.push('/')">Back to home</button>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  text-align: center;
}
.container {
  max-width: 640px;
  margin-inline: auto;
  padding-inline: clamp(16px, 4vw, 48px);
  width: 100%;
}
.code {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  color: var(--text-tertiary);
  margin: 0 0 var(--space-4) 0;
}
h1 {
  font-size: var(--fs-h1);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  margin: 0 0 var(--space-3) 0;
}
.muted {
  color: var(--text-secondary);
  font-size: var(--fs-body-lg);
  margin-bottom: var(--space-6);
}
.btn {
  font-family: inherit;
  font-size: var(--fs-body);
  color: var(--text-primary);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
  cursor: pointer;
  transition: border-color var(--duration-base) var(--ease-standard);
}
.btn:hover {
  border-color: var(--accent-primary);
}
</style>
