<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Container from './Container.vue'
import AIcon from '@components/common/AIcon.vue'
import LangSwitch from '@components/common/LangSwitch.vue'
import { useSEO } from '@composables/useSEO'

interface Props {
  showSystem?: boolean
}
withDefaults(defineProps<Props>(), { showSystem: false })

const { t } = useI18n()
const siteConfig = ref<Record<string, string>>({})

onMounted(async () => {
  siteConfig.value = {
    'site.title': 'Aindgc',
    'contact.email': 'hello@aindgc.com',
    'social.github': '',
    'social.twitter': ''
  }
})

useSEO({
  title: 'Aindgc — AI Product Lab'
})
</script>

<template>
  <footer class="app-footer">
    <Container>
      <div class="footer-grid">
        <div class="col-brand">
          <div class="brand">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <rect width="32" height="32" rx="6" fill="var(--bg-elevated)" />
              <path d="M8 22V10l8 12V10" stroke="var(--accent-primary)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              <circle cx="24" cy="10" r="2" fill="var(--accent-secondary)" />
            </svg>
            <span>{{ t('common.appName') }}</span>
          </div>
          <p class="tagline">{{ t('hero.title') }}</p>
          <p class="muted">{{ t('common.appTagline') }} · est. 2026</p>
          <div class="lang-slot">
            <LangSwitch variant="inline" />
          </div>
        </div>

        <div class="col">
          <h4>{{ t('footer.columns.product') }}</h4>
          <ul>
            <li><router-link to="/tools">{{ t('footer.links.tools') }}</router-link></li>
            <li><router-link to="/workflow">{{ t('footer.links.workflow') }}</router-link></li>
            <li><router-link to="/skills">{{ t('footer.links.skills') }}</router-link></li>
            <li><router-link to="/coding">{{ t('footer.links.coding') }}</router-link></li>
          </ul>
        </div>

        <div class="col">
          <h4>{{ t('footer.columns.resources') }}</h4>
          <ul>
            <li><router-link to="/roi">{{ t('footer.links.roi') }}</router-link></li>
            <li><router-link to="/checkup">{{ t('footer.links.checkup') }}</router-link></li>
            <li><router-link to="/cases">{{ t('footer.links.cases') }}</router-link></li>
            <li><router-link to="/insights">{{ t('footer.links.insights') }}</router-link></li>
          </ul>
        </div>

        <div class="col">
          <h4>{{ t('footer.columns.company') }}</h4>
          <ul>
            <li>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <AIcon name="github" :size="14" /> GitHub
              </a>
            </li>
            <li>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                <AIcon name="twitter" :size="14" /> Twitter
              </a>
            </li>
            <li>
              <a href="mailto:hello@aindgc.com">
                <AIcon name="mail" :size="14" /> hello@aindgc.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <p class="copyright">{{ t('footer.copyright', { year: new Date().getFullYear() }) }} · {{ t('footer.builtWith') }}</p>
        <div class="bottom-links">
          <a href="#" rel="nofollow">{{ t('footer.legal.privacy') }}</a>
          <span class="dot">·</span>
          <a href="#" rel="nofollow">{{ t('footer.legal.terms') }}</a>
          <span v-if="showSystem" class="dot">·</span>
          <router-link v-if="showSystem" to="/design-system">Design System</router-link>
        </div>
      </div>
    </Container>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  padding: var(--space-9) 0 var(--space-6);
  background: var(--bg-base);
  border-top: 1px solid var(--border-subtle);
  margin-top: var(--space-9);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--space-7);
  margin-bottom: var(--space-7);
}

.col-brand .brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: var(--fs-body-lg);
  color: var(--text-primary);
  margin-bottom: var(--space-3);
}
.tagline {
  font-size: var(--fs-body);
  color: var(--text-primary);
  margin: 0;
}
.tagline-zh {
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  margin: 4px 0 var(--space-3) 0;
}
.muted {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin: 0;
}

.lang-slot {
  margin-top: var(--space-4);
}

.col h4 {
  font-family: var(--font-mono);
  font-size: var(--fs-caption);
  letter-spacing: var(--letter-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 500;
  margin: 0 0 var(--space-3) 0;
}
.col ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.col a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-body-sm);
  color: var(--text-secondary);
  transition: color var(--duration-fast) var(--ease-standard);
}
.col a:hover { color: var(--accent-primary); }

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-subtle);
  font-size: var(--fs-caption);
  color: var(--text-tertiary);
  flex-wrap: wrap;
  gap: var(--space-3);
}
.copyright { margin: 0; }
.bottom-links {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.bottom-links a {
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-standard);
}
.bottom-links a:hover { color: var(--text-primary); }
.dot { color: var(--text-muted); }

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
  }
  .col-brand {
    grid-column: span 2;
  }
  .bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
