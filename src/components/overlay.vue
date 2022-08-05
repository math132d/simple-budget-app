<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div
    @click="router.replace('/budgets')"
    class="w-full h-full flex justify-center items-center pointer-events-auto bg-slate-900/10"
  >
    <div
      class="w-min h-min shadow-2xl rounded-3xl p-4 pointer-events-auto bg-white"
    >
      <slot></slot>
    </div>
  </div>
</template>
