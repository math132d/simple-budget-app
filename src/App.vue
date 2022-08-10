<template>
  <div
    class="h-screen w-screen bg-gradient-to-b from-white to-slate-200 p-4 text-slate-800"
  >
    <suspense>
      <router-view></router-view>
    </suspense>
  </div>
</template>
