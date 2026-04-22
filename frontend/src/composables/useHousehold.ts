// ストアを薄くラップし、コンポーネントから利用しやすいAPIを提供する
import { computed } from 'vue'
import { useHouseholdStore } from '@/stores/household'

export function useHousehold() {
  const store = useHouseholdStore()

  /** 家族名（編集可能） */
  const householdName = computed(() => store.household?.name ?? '')

  /** 家族に所属しているかどうか */
  const hasMembership = computed(() => store.household !== null)

  /** 招待コードの有効期限が切れているかどうか */
  const isCodeExpired = computed(() => {
    if (!store.invitationCode) return true
    return new Date(store.invitationCode.expiresAt) < new Date()
  })

  return {
    // ストアのステートをそのまま利用
    household: computed(() => store.household),
    members: computed(() => store.members),
    invitationCode: computed(() => store.invitationCode),
    isLoading: computed(() => store.isLoading),
    error: computed(() => store.error),
    // 派生状態
    householdName,
    hasMembership,
    isCodeExpired,
    // アクション（ストアへの委譲）
    fetchHousehold: store.fetchHousehold,
    fetchMembers: store.fetchMembers,
    updateHouseholdName: store.updateHouseholdName,
    generateInviteCode: store.generateInviteCode,
    joinHousehold: store.joinHousehold,
  }
}
