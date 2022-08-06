<script lang="ts" setup>
import { getDatabase, readTransaction } from "../../services/database";

import { Budget, BudgetViewModel, populateBudget } from ".";

import budgetListItem from "./budget-list-item.vue";
import version from "../../services/version";
import { onMounted, Ref, ref, watch } from "vue";

const db = await getDatabase();
let expanded: Ref<Number | undefined> = ref(undefined);
let budgets = ref([] as BudgetViewModel[]);

function toggleExpanded(id: Number | undefined) {
  expanded.value = expanded.value === id ? undefined : id;
}

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
  <div class="grid h-full w-full grid-rows-2-a">
    <h1 class="text-center text-xl font-bold uppercase">Budgets</h1>
    <div
      class="-mx-4 -mb-4 grid min-h-0 flex-grow auto-rows-min grid-cols-flexible grid-rows-none gap-8 overflow-auto px-4 pb-4"
    >
      <budget-list-item
        v-for="budget of budgets"
        class="shadow-lg hover:shadow-xl"
        @click="toggleExpanded(budget.budget.id)"
        :budget="budget"
        :expanded="expanded === budget.budget.id"
      />
      <div class="h-12"><!-- some funky spacer --></div>
    </div>
    <div
      class="absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-b from-transparent to-gray-900/40 p-4"
    >
      <router-link to="/budgets/add" custom v-slot="{ navigate }">
        <button
          @click="navigate"
          class="block rounded-full bg-white p-2 text-4xl font-bold leading-zero shadow-lg hover:shadow-xl"
        >
          <ion-icon name="add"></ion-icon>
        </button>
      </router-link>
    </div>
    <router-view class="fixed inset-0"> </router-view>
  </div>
</template>
