<script setup lang="ts">
import AIcon from './AIcon.vue'

interface Crumb {
  label: string
  to?: string
  iconName?: string
}

interface Props {
  items: Crumb[]
  separator?: string
}

withDefaults(defineProps<Props>(), {
  separator: '/'
})
</script>

<template>
  <nav class="a-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li v-for="(item, idx) in items" :key="idx" class="crumb">
        <router-link v-if="item.to" :to="item.to" class="link">
          <AIcon v-if="item.iconName" :name="item.iconName" :size="14" />
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else class="current">
          <AIcon v-if="item.iconName" :name="item.iconName" :size="14" />
          <span>{{ item.label }}</span>
        </span>
        <span v-if="idx < items.length - 1" class="sep" aria-hidden="true">{{ separator }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.a-breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-body-sm);
}

.crumb {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-tertiary);
}

.link, .current {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color var(--duration-fast) var(--ease-standard);
}

.link:hover {
  color: var(--accent-primary);
}

.current {
  color: var(--text-primary);
  font-weight: 500;
}

.sep {
  color: var(--text-muted);
}
</style>
