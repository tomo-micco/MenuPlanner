import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import JoinFamilyView from '../JoinFamilyView.vue'

vi.mock('@/mocks/household', () => ({
  mockHousehold: { id: 'hh-t', name: 'テスト家', createdAt: '2026-01-01T00:00:00.000Z' },
  mockMembers: [],
  mockInvitationCode: null,
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: JoinFamilyView },
    { path: '/family', component: { template: '<div/>' } },
  ],
})

describe('JoinFamilyView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('ページが正常にマウントされる', () => {
    const wrapper = mount(JoinFamilyView, {
      global: { plugins: [createPinia(), router] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('招待コード入力フォームが存在する', () => {
    const wrapper = mount(JoinFamilyView, {
      global: { plugins: [createPinia(), router] },
    })
    expect(wrapper.find('[data-testid="invite-code-input"]').exists()).toBe(true)
  })

  it('空のまま送信するとエラーが表示される', async () => {
    const wrapper = mount(JoinFamilyView, {
      global: { plugins: [createPinia(), router] },
    })
    await wrapper.find('[data-testid="join-submit"]').trigger('click')
    expect(wrapper.find('[data-testid="join-error"]').exists()).toBe(true)
  })
})
