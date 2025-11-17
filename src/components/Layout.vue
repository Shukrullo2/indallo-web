<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/app/summaries" class="nav-logo">
          <img src="/indallo_logo.png" alt="Indallo" class="logo-image" />
        </router-link>
        <div class="nav-links">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ active: $route.path === link.path }"
            :title="t(link.label)"
          >
            <svg
              v-if="link.icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                v-for="(path, index) in link.icon"
                :key="index"
                :d="path.d"
                :stroke="path.stroke || 'currentColor'"
                :fill="(path as any).fill || 'none'"
                :stroke-width="path.strokeWidth || '2'"
                :stroke-linecap="(path.strokeLinecap || 'round') as 'round' | 'butt' | 'square'"
                :stroke-linejoin="(path.strokeLinejoin || 'round') as 'round' | 'miter' | 'bevel'"
              />
            </svg>
          </router-link>
        </div>
        <router-link
          to="/app/profile"
          class="nav-profile-icon"
          :class="{ active: $route.path === '/app/profile' }"
          :title="t('nav.profile')"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../utils/i18n'

const { t } = useI18n()

const navLinks = computed(() => [
  {
    path: '/app/summaries',
    label: 'nav.summaries',
    icon: [
      {
        d: 'M4 6H20M4 12H20M4 18H20',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }
    ]
  },
  {
    path: '/app/breaking-news',
    label: 'nav.breakingNews',
    icon: [
      {
        d: 'M13 2L3 14H12L11 22L21 10H12L13 2Z',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: 'none'
      }
    ]
  },
])
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 0 0 16px 16px;
  margin: 0 12px;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 16px;
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-image {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
  padding: 0;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #0088cc;
}

.nav-link.active {
  background: #0088cc;
  color: white;
}

.nav-link svg {
  width: 20px;
  height: 20px;
}

.nav-profile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  background: transparent;
  flex-shrink: 0;
}

.nav-profile-icon:hover {
  background: #f5f5f5;
  color: #0088cc;
}

.nav-profile-icon.active {
  background: #0088cc;
  color: white;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
}

@media (max-width: 768px) {
  .navbar {
    margin: 0 8px;
    border-radius: 0 0 12px 12px;
  }

  .nav-content {
    height: 56px;
    padding: 0 12px;
  }

  .nav-logo {
    flex-shrink: 0;
  }

  .logo-image {
    height: 32px;
  }

  .nav-links {
    flex: 1;
    justify-content: center;
    gap: 4px;
  }

  .nav-link {
    width: 36px;
    height: 36px;
  }

  .nav-link svg {
    width: 18px;
    height: 18px;
  }

  .nav-profile-icon {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }

  .nav-profile-icon svg {
    width: 20px;
    height: 20px;
  }
}
</style>

