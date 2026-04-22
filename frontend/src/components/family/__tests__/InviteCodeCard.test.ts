import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InviteCodeCard from '../InviteCodeCard.vue'
import type { IInvitationCode } from '@/types'

const futureCode: IInvitationCode = {
  id: 'inv-001',
  householdId: 'hh-001',
  code: 'ABC12345',
  expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24時間後（有効）
  createdAt: '2026-01-01T00:00:00.000Z',
}

const expiredCode: IInvitationCode = {
  ...futureCode,
  code: 'EXPIRED1',
  expiresAt: new Date(Date.now() - 1000).toISOString(), // 過去（期限切れ）
}

describe('InviteCodeCard', () => {
  it('招待コードを表示する', () => {
    const wrapper = mount(InviteCodeCard, {
      props: { invitationCode: futureCode, isExpired: false },
    })
    expect(wrapper.find('[data-testid="code-display"]').text()).toBe('ABC12345')
  })

  it('有効期限が切れている場合に期限切れ表示をする', () => {
    const wrapper = mount(InviteCodeCard, {
      props: { invitationCode: expiredCode, isExpired: true },
    })
    expect(wrapper.find('[data-testid="code-expired"]').exists()).toBe(true)
  })

  it('コピーボタンが存在する', () => {
    const wrapper = mount(InviteCodeCard, {
      props: { invitationCode: futureCode, isExpired: false },
    })
    expect(wrapper.find('[data-testid="copy-btn"]').exists()).toBe(true)
  })

  it('再発行ボタンクリックで regenerate イベントを emit する', async () => {
    const wrapper = mount(InviteCodeCard, {
      props: { invitationCode: futureCode, isExpired: false },
    })
    await wrapper.find('[data-testid="regenerate-btn"]').trigger('click')
    expect(wrapper.emitted('regenerate')).toBeTruthy()
  })
})
