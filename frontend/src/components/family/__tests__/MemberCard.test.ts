import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MemberCard from '../MemberCard.vue'
import type { IUser } from '@/types'

const mockUser: IUser = {
  id: 'u-001',
  householdId: 'hh-001',
  name: '田中 太郎',
  email: 'taro@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('MemberCard', () => {
  it('メンバー名を表示する', () => {
    const wrapper = mount(MemberCard, { props: { member: mockUser } })
    expect(wrapper.text()).toContain('田中 太郎')
  })

  it('名前の頭文字をアバターとして表示する', () => {
    const wrapper = mount(MemberCard, { props: { member: mockUser } })
    // 「田」が表示されること
    expect(wrapper.find('[data-testid="avatar"]').text()).toBe('田')
  })
})
