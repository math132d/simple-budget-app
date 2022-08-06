<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div
    @click="router.replace('/budgets')"
    class="pointer-events-auto flex h-full w-full items-center justify-center bg-slate-900/10"
  >
    <div
      class="pointer-events-auto h-min max-h-screen w-min overflow-auto rounded-3xl bg-white p-4 shadow-2xl"
    >
      <slot></slot>
    </div>
  </div>
</template>
