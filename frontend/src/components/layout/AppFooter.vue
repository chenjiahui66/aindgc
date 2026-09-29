<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Container from './Container.vue'
import AIcon from '@components/common/AIcon.vue'
import { useSEO } from '@composables/useSEO'

interface Props {
  showSystem?: boolean
}
withDefaults(defineProps<Props>(), { showSystem: false })

const siteConfig = ref<Record<string, string>>({})

onMounted(async () => {
  // Phase 2 暂用本地默认值,Phase 15 接后端 /api/site/config
  siteConfig.value = {
    'site.title': 'Aindgc',
    'site.tagline': 'Turn AI Into Work.',
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
            <span>Aindgc</span>
          </div>
          <p class="tagline">Turn AI Into Work.</p>
          <p class="tagline-zh">让 AI 真正开始工作。</p>
          <p class="muted">AI Product Lab · est. 2026</p>
        </div>

        <div class="col">
          <h4>Product</h4>
          <ul>
            <li><router-link to="/tools">Tools</router-link></li>
            <li><router-link to="/workbench">Workbench</router-link></li>
            <li><router-link to="/workflow">Workflow</router-link></li>
            <li><router-link to="/skills">Agent Skills</router-link></li>
            <li><router-link to="/coding">AI Coding</router-link></li>
          </ul>
        </div>

        <div class="col">
          <h4>For Business</h4>
          <ul>
            <li><router-link to="/roi">ROI Calculator</router-link></li>
            <li><router-link to="/checkup">AI Checkup</router-link></li>
            <li><router-link to="/cases">Cases</router-link></li>
            <li><router-link to="/insights">Insights</router-link></li>
          </ul>
        </div>

        <div class="col">
          <h4>Connect</h4>
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
        <p class="copyright">© {{ new Date().getFullYear() }} Aindgc · Made for builders · Built with intent.</p>
        <div class="bottom-links">
          <router-link to="/about">About</router-link>
          <span class="dot">·</span>
          <a href="#" rel="nofollow">Privacy</a>
          <span class="dot">·</span>
          <a href="#" rel="nofollow">Terms</a>
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
