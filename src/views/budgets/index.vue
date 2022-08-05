<script lang="ts" setup>
import { getDatabase, readTransaction } from "../../services/database";

import { Budget, BudgetViewModel, populateBudget } from ".";

import budgetListItem from "./budget-list-item.vue";
import version from "../../services/version";
import { onMounted, ref, watch } from "vue";

const db = await getDatabase();
let budgets = ref([] as BudgetViewModel[]);

async function fetchBudgets() {
  return await Promise.all(
    (
      (await readTransaction(db, "budgets", (store) => {
        return store.getAll();
      })) as Budget[]
    ).map((budget) => populateBudget(budget))
  );
}

watch(version, async () => {
  budgets.value = await fetchBudgets();
});

onMounted(async () => {
  budgets.value = await fetchBudgets();
});
</script>

<template>
  <h1 class="text-3xl font-bold ml-1 mb-2">Budgets</h1>

  <router-link
    v-for="budget of budgets"
    :to="`/budgets/${budget.budget.id}`"
    custom
    v-slot="{ navigate }"
  >
    <budget-list-item @click="navigate" :budget="budget"> </budget-list-item>
  </router-link>
  <router-link to="/budgets/add" custom v-slot="{ navigate }">
    <button
      @click="navigate"
      class="fixed bottom-4 right-4 w-14 h-14 rounded text-white text-4xl font-bold bg-green-600 shadow-lg"
    >
      +
    </button>
  </router-link>
  <router-view class="fixed inset-0"> </router-view>
</template>
