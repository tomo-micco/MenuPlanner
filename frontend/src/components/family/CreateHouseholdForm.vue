<script setup lang="ts">
import { ref } from 'vue'

// イベント定義
const emit = defineEmits<{
  (e: 'submit', name: string): void
}>()

const householdName = ref('')
const nameError = ref('')

/** バリデーション & 送信 */
function handleSubmit(): void {
  nameError.value = ''
  const trimmed = householdName.value.trim()
  if (!trimmed) {
    nameError.value = '家族名を入力してください'
    return
  }
  if (trimmed.length > 50) {
    nameError.value = '家族名は50文字以内で入力してください'
    return
  }
  emit('submit', trimmed)
}
</script>

<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
    <div>
      <h2 class="text-lg font-bold text-white">家族グループを作成</h2>
      <p class="mt-1 text-sm text-white/50">
        家族グループを作成して、献立・買い物リストを家族で共有しましょう。
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label
          for="household-name"
          class="block text-sm font-medium text-white/70 mb-1.5"
        >
          家族名 <span class="text-rose-400">*</span>
        </label>
        <input
          id="household-name"
          v-model="householdName"
          type="text"
          placeholder="例：田中家"
          maxlength="50"
          class="w-full rounded-xl bg-black/30 border px-4 py-3 text-white placeholder-white/30 outline-none transition focus:ring-2"
          :class="nameError ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-violet-500/50'"
        />
        <p v-if="nameError" class="mt-1.5 text-xs text-rose-400">
          {{ nameError }}
        </p>
      </div>

      <button
        type="submit"
        class="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95"
      >
        グループを作成する
      </button>
    </form>
  </div>
</template>
