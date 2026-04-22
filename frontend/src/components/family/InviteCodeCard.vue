<script setup lang="ts">
import { ref } from 'vue'
import type { IInvitationCode } from '@/types'

// プロパティ定義
defineProps<{
  invitationCode: IInvitationCode
  isExpired: boolean
}>()

// イベント定義
const emit = defineEmits<{
  (e: 'regenerate'): void
}>()

const copied = ref(false)

/** クリップボードにコードをコピーする */
async function copyCode(code: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // clipboard APIが使えない環境のフォールバック
    console.error('clipboard copy failed')
  }
}

/** 有効期限を「残りX時間」形式でフォーマットする */
function formatExpiry(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `残り ${hours}時間 ${minutes}分`
  if (minutes > 0) return `残り ${minutes}分`
  return '期限切れ'
}
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-white/70">招待コード</h3>
      <button
        v-if="!isExpired"
        data-testid="regenerate-btn"
        class="rounded-lg px-3 py-1 text-xs font-medium text-violet-400 transition hover:bg-violet-500/20"
        @click="emit('regenerate')"
      >
        再発行
      </button>
    </div>

    <!-- 期限切れ表示 -->
    <div
      v-if="isExpired"
      data-testid="code-expired"
      class="flex flex-col items-center gap-2 py-4 text-center"
    >
      <span class="text-3xl">⏰</span>
      <p class="text-sm text-white/50">招待コードの有効期限が切れています</p>
      <button
        data-testid="regenerate-btn"
        class="mt-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
        @click="emit('regenerate')"
      >
        新しいコードを発行する
      </button>
    </div>

    <!-- コード表示 -->
    <div v-else class="space-y-3">
      <div class="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3">
        <span
          data-testid="code-display"
          class="flex-1 font-mono text-2xl tracking-[0.3em] text-white font-bold"
        >
          {{ invitationCode.code }}
        </span>
        <button
          data-testid="copy-btn"
          :title="copied ? 'コピーしました！' : 'コードをコピー'"
          class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition"
          :class="copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/70 hover:bg-white/20'"
          @click="copyCode(invitationCode.code)"
        >
          {{ copied ? '✓ コピー済み' : 'コピー' }}
        </button>
      </div>
      <p class="text-xs text-white/40 text-center">
        {{ formatExpiry(invitationCode.expiresAt) }}
      </p>
    </div>
  </div>
</template>
