<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ATag from '@components/common/ATag.vue'

interface Article {
  slug: string
  title: string
  summary: string
  category: string
  readMinutes: number
  publishedAt: string
  cover?: string
  variant?: 'feature' | 'regular'
}

interface Props {
  article: Article
  variant?: 'feature' | 'regular'
}

withDefaults(defineProps<Props>(), { variant: 'regular' })
</script>

<template>
  <RouterLink :to="`/insights/${article.slug}`" class="article-card" :class="`v-${variant}`">
    <div class="cover" :style="{ background: 'linear-gradient(135deg, var(--surface-1), var(--surface-2))' }">
      <span class="cover-letter">{{ article.title.charAt(0) }}</span>
    </div>
    <div class="body">
      <ATag tone="primary" size="sm">{{ article.category }}</ATag>
      <h3 class="title">{{ article.title }}</h3>
      <p v-if="variant === 'feature'" class="summary">{{ article.summary }}</p>
      <p class="meta">{{ article.readMinutes }} min · {{ article.publishedAt }}</p>
    </div>
  </RouterLink>
</template>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--duration-base) var(--ease-standard),
    transform var(--duration-base) var(--ease-standard);
}
.article-card:hover {
  border-color: var(--border-default);
  transform: translateY(-2px);
}

.cover {
  aspect-ratio: 16 / 9;
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-letter {
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 600;
  color: var(--accent-primary);
  opacity: 0.18;
  letter-spacing: -0.05em;
}

.body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.title {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: var(--letter-tight);
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.v-feature .title {
  font-size: var(--fs-h3);
  -webkit-line-clamp: 3;
}

.summary {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  line-height: var(--lh-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  margin: auto 0 0 0;
}
</style>
