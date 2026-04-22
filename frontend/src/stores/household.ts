import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IHousehold, IUser, IInvitationCode } from '@/types'
import {
  mockHousehold,
  mockMembers,
  mockInvitationCode,
} from '@/mocks/household'

// 8桁英数字のモック招待コードを検証する
const VALID_CODE_REGEX = /^[A-Z0-9]{8}$/

export const useHouseholdStore = defineStore('household', () => {
  // --- State ---
  const household = ref<IHousehold | null>(null)
  const members = ref<IUser[]>([])
  const invitationCode = ref<IInvitationCode | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // --- Actions ---

  /** 家族情報を取得する（API未実装のためモックを使用） */
  async function fetchHousehold(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      // TODO: バックエンド実装後に GET /households に差し替える
      await simulateDelay()
      household.value = mockHousehold
    } finally {
      isLoading.value = false
    }
  }

  /** メンバー一覧を取得する */
  async function fetchMembers(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      // TODO: バックエンド実装後に GET /households/members に差し替える
      await simulateDelay()
      members.value = mockMembers
    } finally {
      isLoading.value = false
    }
  }

  /** 家族名を更新する */
  async function updateHouseholdName(name: string): Promise<void> {
    if (!household.value) return
    isLoading.value = true
    error.value = null
    try {
      // TODO: バックエンド実装後に PATCH /households に差し替える
      await simulateDelay()
      household.value = { ...household.value, name }
    } finally {
      isLoading.value = false
    }
  }

  /** 招待コードを発行する */
  async function generateInviteCode(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      // TODO: バックエンド実装後に POST /households/invite に差し替える
      await simulateDelay()
      invitationCode.value = mockInvitationCode
    } finally {
      isLoading.value = false
    }
  }

  /** 招待コードで家族グループに参加する */
  async function joinHousehold(code: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      // TODO: バックエンド実装後に POST /households/join に差し替える
      await simulateDelay()
      if (!VALID_CODE_REGEX.test(code.toUpperCase())) {
        error.value = '無効な招待コードです。8桁の英数字を入力してください。'
        return
      }
      // 参加成功時に家族情報を再取得
      await fetchHousehold()
      await fetchMembers()
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    household,
    members,
    invitationCode,
    isLoading,
    error,
    // Actions
    fetchHousehold,
    fetchMembers,
    updateHouseholdName,
    generateInviteCode,
    joinHousehold,
  }
})

/** APIレイテンシをシミュレートするユーティリティ（モック専用） */
function simulateDelay(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
