<script lang="ts" setup>
import { differenceInDays, isAfter } from "date-fns";
import { toRefs } from "vue";
import { useRouter } from "vue-router";
import { BudgetViewModel } from ".";
import { getDatabase, writeTransaction } from "../../services/database";
import { wordFromPeriod } from "../../services/periodService";
import version from "../../services/version";
import BudgetListItemValueCell from "./budget-list-item-value-cell.vue";

const router = useRouter();
const today = new Date();

const props = defineProps<{ budget: BudgetViewModel }>();
const { budget } = toRefs(props);

const nextBreakdown =
  budget.value.breakdowns.filter((date) => isAfter(date, today))[0] || today;

const daysUntilNextBreakdown = Math.max(
  differenceInDays(nextBreakdown, today),
  1
);

const breakdownWord = wordFromPeriod(budget.value.budget.breakdown);
const periodWord = wordFromPeriod(budget.value.budget.period);

async function remove() {
  const db = await getDatabase();

  writeTransaction(db, "budgets", (store) => {
    if (budget.value.budget.id) {
      store.delete(budget.value.budget.id);
    }
  });

  navigator.vibrate(200);

  version.value = Date.now();
}
</script>

<template>
  <div
    @contextmenu.prevent="remove()"
    class="flex bg-white hover:bg-slate-50 select-none rounded cursor-pointer"
  >
    <div class="flex-grow m-2">
      <h2 class="text-lg font-bold mb-2">
        {{ budget.budget.name || "Default" }}
      </h2>
      <div class="grid sm:grid-cols-3">
        <BudgetListItemValueCell
          :header="`remaining this ${breakdownWord}`"
          :value="budget.availibleThisBreakdown || 0"
        />
        <BudgetListItemValueCell
          :header="`spent this ${periodWord}`"
          :positive="budget.availibleThisBreakdown >= 0"
          :value="budget.usedThisPeriod"
        />
        <BudgetListItemValueCell
          header="Days Remaining"
          :currency="false"
          :value="daysUntilNextBreakdown"
        />
      </div>
    </div>
    <div
      @click.prevent="router.push(`/budgets/${budget.budget.id}/expense`)"
      class="hover:bg-slate-200 active:bg-slate-300 text-4xl aspect-square flex justify-center items-center px-6 rounded-r"
    >
      <span class="drop-shadow-lg">💸</span>
    </div>
  </div>
</template>
