<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@stores/user'
import Container from '@components/layout/Container.vue'
import Section from '@components/layout/Section.vue'
import Stack from '@components/layout/Stack.vue'
import PageHero from '@components/layout/PageHero.vue'
import ABreadcrumb from '@components/common/ABreadcrumb.vue'
import ACard from '@components/common/ACard.vue'
import AAvatar from '@components/common/AAvatar.vue'
import ATag from '@components/common/ATag.vue'
import AIcon from '@components/common/AIcon.vue'

const userStore = useUserStore()

onMounted(async () => {
  if (!userStore.user) await userStore.fetchMe()
})
</script>

<template>
  <main>
    <Section py="md">
      <Container>
        <ABreadcrumb :items="[
          { label: 'Home', to: '/', iconName: 'home' },
          { label: 'Profile' }
        ]" />
      </Container>
    </Section>

    <Section py="sm">
      <Container>
        <PageHero
          eyebrow="YOUR ACCOUNT"
          :title="userStore.displayName || 'Profile'"
          :subtitle="userStore.user?.email || ''"
        />
      </Container>
    </Section>

    <Section py="md">
      <Container size="md">
        <Stack :gap="5">
          <ACard v-if="userStore.user" variant="default">
            <div class="profile-row">
              <AAvatar :name="userStore.displayName" size="2xl" />
              <div class="profile-meta">
                <h2>{{ userStore.user.nickname || userStore.user.username }}</h2>
                <p class="muted">@{{ userStore.user.username }}</p>
                <div class="tag-row">
                  <ATag :tone="userStore.isAdmin ? 'primary' : 'neutral'" size="sm">
                    <template #icon><AIcon :name="userStore.isAdmin ? 'shield' : 'user'" :size="12" /></template>
                    {{ userStore.user.role }}
                  </ATag>
                </div>
              </div>
            </div>
          </ACard>

          <ACard>
            <header class="card-head">
              <h3>Account details</h3>
            </header>
            <Stack :gap="4">
              <div class="kv">
                <span class="k">Username</span>
                <span class="v mono">{{ userStore.user?.username || '—' }}</span>
              </div>
              <div class="kv">
                <span class="k">Email</span>
                <span class="v mono">{{ userStore.user?.email || '—' }}</span>
              </div>
              <div class="kv">
                <span class="k">Nickname</span>
                <span class="v">{{ userStore.user?.nickname || '—' }}</span>
              </div>
              <div class="kv">
                <span class="k">Role</span>
                <span class="v mono">{{ userStore.user?.role || '—' }}</span>
              </div>
            </Stack>
          </ACard>

          <ACard variant="bordered">
            <Stack :gap="3" align="center">
              <AIcon name="info" :size="20" />
              <p class="muted" style="text-align: center;">
                Profile editing is coming in Phase 15. For now, this is a read-only view of your account.
              </p>
            </Stack>
          </ACard>
        </Stack>
      </Container>
    </Section>
  </main>
</template>

<style scoped>
main { padding-bottom: var(--space-9); }

.profile-row {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}
.profile-meta h2 {
  font-size: var(--fs-h3);
  font-weight: 600;
  letter-spacing: var(--letter-tight);
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
}
.muted {
  color: var(--text-tertiary);
  font-size: var(--fs-body-sm);
  margin: 0;
}
.tag-row {
  display: flex;
  gap: 6px;
  margin-top: var(--space-2);
}

.card-head h3 {
  font-size: var(--fs-body-lg);
  font-weight: 600;
  margin: 0 0 var(--space-4) 0;
}

.kv {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--space-3);
  align-items: center;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
}
.kv:last-child {
  padding-bottom: 0;
  border-bottom: none;
}
.k {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}
.v {
  font-size: var(--fs-body);
  color: var(--text-primary);
}
.mono {
  font-family: var(--font-mono);
}
</style>
