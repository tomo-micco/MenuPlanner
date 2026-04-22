<script setup lang="ts">
import type { IUser } from '@/types'

// プロパティ定義
const props = defineProps<{
  member: IUser
}>()

/** 名前の最初の文字をアバターとして使用する */
const avatarChar = props.member.name.charAt(0)

/** アバター背景色をユーザーIDのハッシュから決定する */
const avatarColors = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
]
const colorIndex =
  props.member.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
  avatarColors.length
const avatarColor = avatarColors[colorIndex]
</script>

<template>
  <div
    class="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 transition hover:bg-white/10"
  >
    <!-- アバター -->
    <div
      data-testid="avatar"
      :class="[avatarColor, 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white']"
    >
      {{ avatarChar }}
    </div>

    <!-- 名前・メール -->
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-semibold text-white">{{ member.name }}</p>
      <p class="truncate text-xs text-white/50">{{ member.email }}</p>
    </div>
  </div>
</template>
