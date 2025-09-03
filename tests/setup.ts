// Global test setup for vitest
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Configure Vue Test Utils
config.global.components = {
  ccmBaseSection: {
    name: 'ccmBaseSection',
    template: '<section class="base-section"><slot /></section>'
  },
  ccmMasterGrid: {
    name: 'ccmMasterGrid', 
    template: '<div class="master-grid"><slot /></div>'
  },
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}

// Mock Nuxt global components
vi.mock('#components', () => ({
  ccmBaseSection: {
    name: 'ccmBaseSection',
    template: '<section class="base-section"><slot /></section>'
  },
  ccmMasterGrid: {
    name: 'ccmMasterGrid', 
    template: '<div class="master-grid"><slot /></div>'
  }
}))

// Mock NuxtLink
vi.mock('#app', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}