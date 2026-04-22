import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import FamilySettingsView from '../FamilySettingsView.vue'

// ストアのモックは自動解決されることを期待
vi.mock('@/mocks/household', () => ({
  mockHousehold: { id: 'hh-t', name: 'テスト家', createdAt: '2026-01-01T00:00:00.000Z' },
  mockMembers: [
    { id: 'u-1', householdId: 'hh-t', name: 'テスト太郎', email: 'test@example.com', createdAt: '2026-01-01T00:00:00.000Z' },
  ],
  mockInvitationCode: {
    id: 'inv-t',
    householdId: 'hh-t',
    code: 'TEST1234',
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: '2026-01-01T00:00:00.000Z',
  },
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: FamilySettingsView }],
})

describe('FamilySettingsView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('ページが正常にマウントされる', async () => {
    const wrapper = mount(FamilySettingsView, {
      global: { plugins: [createPinia(), router] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('「家族設定」の見出しが表示される', async () => {
    const wrapper = mount(FamilySettingsView, {
      global: { plugins: [createPinia(), router] },
    })
    expect(wrapper.find('h1').text()).toContain('家族設定')
  })
})
