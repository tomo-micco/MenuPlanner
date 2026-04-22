<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHousehold } from '@/composables/useHousehold'

const router = useRouter()
const { joinHousehold, isLoading, error } = useHousehold()

const code = ref('')
const localError = ref('')

// 8桁英数字
const CODE_REGEX = /^[A-Za-z0-9]{8}$/

/** 送信ハンドラ */
async function handleJoin(): Promise<void> {
  localError.value = ''
  const trimmed = code.value.trim()

  if (!trimmed) {
    localError.value = '招待コードを入力してください'
    return
  }
  if (!CODE_REGEX.test(trimmed)) {
    localError.value = '招待コードは8桁の英数字です'
    return
  }

  await joinHousehold(trimmed.toUpperCase())

  // ストアのエラーがなければ成功 → 設定画面へ遷移
  if (!error.value) {
    router.push('/family')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6">
      <!-- タイトル -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-white">家族グループに参加</h1>
        <p class="text-sm text-white/50">
          家族から共有された招待コードを入力してください。
        </p>
      </div>

      <!-- フォームカード -->
      <div class="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
        <!-- 招待コード入力 -->
        <div>
          <label
            for="invite-code"
            class="block text-sm font-medium text-white/70 mb-1.5"
          >
            招待コード <span class="text-rose-400">*</span>
          </label>
          <input
            id="invite-code"
            v-model="code"
            data-testid="invite-code-input"
            type="text"
            inputmode="text"
            placeholder="例：ABC12345"
            maxlength="8"
            class="w-full rounded-xl border bg-black/30 px-4 py-3 text-center font-mono text-xl tracking-widest text-white uppercase placeholder-white/20 outline-none transition focus:ring-2"
            :class="(localError || error) ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-violet-500/50'"
            @keyup.enter="handleJoin"
          />
        </div>

        <!-- エラー表示 -->
        <p
          v-if="localError || error"
          data-testid="join-error"
          class="text-xs text-rose-400 text-center"
        >
          {{ localError || error }}
        </p>

        <!-- 参加ボタン -->
        <button
          data-testid="join-submit"
          :disabled="isLoading"
          class="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleJoin"
        >
          <span v-if="isLoading">
            <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
            参加中…
          </span>
          <span v-else>グループに参加する</span>
        </button>
      </div>

      <!-- 戻るリンク -->
      <div class="text-center">
        <router-link
          to="/family"
          class="text-sm text-white/40 hover:text-white/70 transition"
        >
          ← 戻る
        </router-link>
      </div>
    </div>
  </div>
</template>
