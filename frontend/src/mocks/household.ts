// schema.md 準拠のモックデータ（APIが未実装の間、開発用に使用する）
import type { IHousehold, IUser, IInvitationCode } from '@/types'

export const mockHousehold: IHousehold = {
  id: 'hh-0001-uuid',
  name: '田中家',
  createdAt: '2026-04-01T00:00:00.000Z',
}

export const mockMembers: IUser[] = [
  {
    id: 'user-0001-uuid',
    householdId: 'hh-0001-uuid',
    name: '田中 太郎',
    email: 'taro@example.com',
    createdAt: '2026-04-01T00:00:00.000Z',
  },
  {
    id: 'user-0002-uuid',
    householdId: 'hh-0001-uuid',
    name: '田中 花子',
    email: 'hanako@example.com',
    createdAt: '2026-04-02T00:00:00.000Z',
  },
  {
    id: 'user-0003-uuid',
    householdId: 'hh-0001-uuid',
    name: '田中 健太',
    email: 'kenta@example.com',
    createdAt: '2026-04-03T00:00:00.000Z',
  },
]

export const mockInvitationCode: IInvitationCode = {
  id: 'inv-0001-uuid',
  householdId: 'hh-0001-uuid',
  code: 'ABC12345',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
  createdAt: new Date().toISOString(),
}
