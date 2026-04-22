<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useHousehold } from '@/composables/useHousehold'
import MemberCard from '@/components/family/MemberCard.vue'
import InviteCodeCard from '@/components/family/InviteCodeCard.vue'
import CreateHouseholdForm from '@/components/family/CreateHouseholdForm.vue'

const {
  household,
  members,
  invitationCode,
  isLoading,
  hasMembership,
  isCodeExpired,
  fetchHousehold,
  fetchMembers,
  updateHouseholdName,
  generateInviteCode,
} = useHousehold()

const isEditingName = ref(false)
const editedName = ref('')

/** 編集モードを開始する */
function startEditName(): void {
  editedName.value = household.value?.name ?? ''
  isEditingName.value = true
}

/** 家族名を保存する */
async function saveHouseholdName(): Promise<void> {
  const trimmed = editedName.value.trim()
  if (!trimmed) return
  await updateHouseholdName(trimmed)
  isEditingName.value = false
}

/** 家族グループを新規作成する */
async function handleCreateHousehold(name: string): Promise<void> {
  // TODO: POST /households に差し替える
  await updateHouseholdName(name)
  await fetchHousehold()
  await fetchMembers()
}

onMounted(async () => {
  await fetchHousehold()
  await fetchMembers()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
    <!-- ヘッダー -->
    <header class="border-b border-white/10 px-6 py-4">
      <div class="mx-auto max-w-2xl flex items-center justify-between">
        <span class="text-sm font-medium text-white/50">🍽 MenuPlanner</span>
      </div>
    </header>

    <main class="mx-auto max-w-2xl px-4 py-8 space-y-8">
      <!-- ページタイトル -->
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-white">家族設定</h1>
        <p class="text-sm text-white/50">
          家族グループを管理し、献立・買い物リストを共有しましょう。
        </p>
      </div>

      <!-- ローディング -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>

      <template v-else>
        <!-- 未所属：グループ作成フォーム -->
        <div v-if="!hasMembership" class="space-y-4">
          <CreateHouseholdForm @submit="handleCreateHousehold" />
          <div class="text-center">
            <router-link
              to="/family/join"
              class="text-sm text-violet-400 underline-offset-2 hover:underline"
            >
              招待コードで参加する →
            </router-link>
          </div>
        </div>

        <!-- 所属済み -->
        <template v-else>
          <!-- 家族名セクション -->
          <section class="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <h2 class="text-sm font-semibold text-white/70">家族名</h2>

            <!-- 表示モード -->
            <div
              v-if="!isEditingName"
              class="flex items-center justify-between"
            >
              <span class="text-xl font-bold text-white">{{ household?.name }}</span>
              <button
                class="rounded-lg px-3 py-1 text-xs font-medium text-violet-400 transition hover:bg-violet-500/20"
                @click="startEditName"
              >
                編集
              </button>
            </div>

            <!-- 編集モード -->
            <div v-else class="flex items-center gap-2">
              <input
                v-model="editedName"
                type="text"
                maxlength="50"
                class="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-violet-500/50"
                @keyup.enter="saveHouseholdName"
                @keyup.esc="isEditingName = false"
              />
              <button
                class="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
                @click="saveHouseholdName"
              >
                保存
              </button>
              <button
                class="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/20"
                @click="isEditingName = false"
              >
                キャンセル
              </button>
            </div>
          </section>

          <!-- 招待コードセクション -->
          <section class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-semibold text-white/70">家族を招待</h2>
            </div>

            <div v-if="!invitationCode" class="text-center py-4">
              <button
                class="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                @click="generateInviteCode"
              >
                招待コードを発行する
              </button>
            </div>
            <InviteCodeCard
              v-else
              :invitation-code="invitationCode"
              :is-expired="isCodeExpired"
              @regenerate="generateInviteCode"
            />
          </section>

          <!-- メンバー一覧セクション -->
          <section class="space-y-3">
            <h2 class="text-sm font-semibold text-white/70">
              メンバー
              <span class="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {{ members.length }}人
              </span>
            </h2>
            <div class="grid gap-3 sm:grid-cols-2">
              <MemberCard
                v-for="member in members"
                :key="member.id"
                :member="member"
              />
            </div>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>
