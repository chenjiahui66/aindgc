<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  pad?: boolean
  as?: keyof HTMLElementTagNameMap
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  pad: true,
  as: 'div'
})

const sizeMap = {
  sm: '640px',
  md: '960px',
  lg: '1280px',
  xl: '1440px'
}
</script>

<template>
  <component :is="props.as" class="container" :class="[`size-${props.size}`, { padded: props.pad }]">
    <slot />
  </component>
</template>

<style scoped>
.container {
  width: 100%;
  margin-inline: auto;
}
.size-sm { max-width: 640px; }
.size-md { max-width: 960px; }
.size-lg { max-width: 1280px; }
.size-xl { max-width: 1440px; }
.padded {
  padding-inline: var(--container-pad);
}
</style>
