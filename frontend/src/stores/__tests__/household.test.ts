import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHouseholdStore } from '../household'
import * as mockData from '@/mocks/household'

// モックAPIを vi.fn() でスタブ化
vi.mock('@/mocks/household', async () => ({
  mockHousehold: {
    id: 'hh-test',
    name: 'テスト家',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  mockMembers: [
    {
      id: 'u-001',
      householdId: 'hh-test',
      name: 'テスト 太郎',
      email: 'test@example.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  mockInvitationCode: {
    id: 'inv-test',
    householdId: 'hh-test',
    code: 'TEST1234',
    expiresAt: '2026-12-31T23:59:59.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
}))

describe('useHouseholdStore', () => {
  beforeEach(() => {
    // テストごとに新しい Pinia インスタンスを生成
    setActivePinia(createPinia())
  })

  describe('fetchHousehold', () => {
    it('家族情報を取得して state に格納する', async () => {
      const store = useHouseholdStore()
      await store.fetchHousehold()

      expect(store.household).not.toBeNull()
      expect(store.household?.name).toBe('テスト家')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('fetchMembers', () => {
    it('メンバー一覧を取得して state に格納する', async () => {
      const store = useHouseholdStore()
      await store.fetchMembers()

      expect(store.members).toHaveLength(1)
      expect(store.members[0].name).toBe('テスト 太郎')
    })
  })

  describe('generateInviteCode', () => {
    it('招待コードを生成して state に格納する', async () => {
      const store = useHouseholdStore()
      await store.generateInviteCode()

      expect(store.invitationCode).not.toBeNull()
      expect(store.invitationCode?.code).toBe('TEST1234')
    })
  })

  describe('updateHouseholdName', () => {
    it('家族名を更新して state に反映する', async () => {
      const store = useHouseholdStore()
      await store.fetchHousehold()
      await store.updateHouseholdName('山田家')

      expect(store.household?.name).toBe('山田家')
    })
  })

  describe('joinHousehold', () => {
    it('有効な招待コードで参加成功し isLoading が false になる', async () => {
      const store = useHouseholdStore()
      await store.joinHousehold('TEST1234')

      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('無効な招待コードでエラーが設定される', async () => {
      const store = useHouseholdStore()
      await store.joinHousehold('INVALID')

      expect(store.error).not.toBeNull()
    })
  })
})
