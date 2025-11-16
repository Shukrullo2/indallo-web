<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="nav-title">{{ t('app.title') }}</h1>
        <div class="nav-links">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="nav-link"
            :class="{ active: $route.path === link.path }"
          >
            {{ t(link.label) }}
          </router-link>
        </div>
        <button class="nav-logout" @click="handleLogout">
          {{ t('app.logout') }}
        </button>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useI18n } from '../utils/i18n'

const router = useRouter()
const { logout } = useAuth()
const { t } = useI18n()

const navLinks = computed(() => [
  { path: '/app/profile', label: 'nav.profile' },
  { path: '/app/summaries', label: 'nav.summaries' },
  { path: '/app/breaking-news', label: 'nav.breakingNews' },
])

const handleLogout = () => {
  logout()
  router.push('/login')
}
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
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-title {
  font-size: 20px;
  font-weight: 600;
  color: #0088cc;
}

.nav-links {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-link {
  padding: 8px 16px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.nav-link:hover {
  background: #f5f5f5;
  color: #0088cc;
}

.nav-link.active {
  background: #0088cc;
  color: white;
}

.nav-logout {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.nav-logout:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 0;
  }

  .nav-links {
    order: 3;
    width: 100%;
    margin-top: 12px;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .nav-logout {
    order: 2;
  }
}
</style>

