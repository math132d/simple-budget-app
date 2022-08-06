<script lang="ts" setup>
import { differenceInDays, isAfter } from "date-fns";
import { Ref, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { BudgetViewModel, Expense } from ".";
import { getDatabase, writeTransaction } from "../../services/database";
import { wordFromPeriod } from "../../services/periodService";
import version from "../../services/version";

const today = new Date();

const props = defineProps<{ budget: BudgetViewModel; expanded: Boolean }>();
const { budget, expanded } = toRefs(props);
const expense: Ref<Number | undefined> = ref(undefined);

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

  await writeTransaction(db, "budgets", (store) => {
    if (budget.value.budget.id) {
      store.delete(budget.value.budget.id);
    }
  });

  navigator.vibrate(200);

  version.value = Date.now();
}

async function addExpense() {
  if (expense.value === undefined) return;
  const db = await getDatabase();

  await writeTransaction(db, "expenses", (store) => {
    store.add({
      name: "",
      value: expense.value,
      date: new Date(),
      budget_id: budget.value.budget.id,
    } as Expense);
  });

  version.value = Date.now();
  expense.value = undefined;
}
</script>

<template>
  <div
    class="relative mb-6 flex h-min cursor-pointer select-none flex-col rounded-xl bg-gradient-to-bl p-4 text-slate-50"
    @contextmenu.prevent="remove()"
    :class="{
      'from-green-500 to-green-600': budget.availibleThisBreakdown >= 0,
      'from-red-500 to-red-600': budget.availibleThisBreakdown < 0,
    }"
  >
    <h2 class="mb-2 flex items-center text-lg uppercase">
      <ion-icon class="text-2xl" name="albums"></ion-icon>
      <span class="pl-4"> {{ budget.budget.name || "Default" }}</span>
    </h2>
    <div class="mb-4 grid flex-grow grid-cols-2">
      <div>
        <h3 class="text-sm font-bold uppercase">
          remaining this {{ breakdownWord }}
        </h3>
        <p class="text-xl">
          <span class="font-bold">$</span>
          {{ (budget.availibleThisBreakdown || 0).toFixed(2) }}
        </p>
      </div>
      <div class="text-right">
        <h3 class="text-sm font-bold uppercase">days</h3>
        <p class="text-xl">
          {{ daysUntilNextBreakdown }}
        </p>
      </div>
      <template v-if="expanded">
        <div>
          <h3 class="text-sm font-bold uppercase">total</h3>
          <p class="text-xl">
            <span class="font-bold">$</span>
            {{ (budget.usedThisPeriod || 0).toFixed(2) }} /
            {{ budget.budget.limitPerPeriod.toFixed(2) }}
          </p>
        </div>
      </template>
    </div>
    <form
      class="absolute inset-x-4 -bottom-6 flex h-12 justify-between rounded-full bg-slate-500 shadow-lg hover:bg-slate-600 active:bg-slate-600"
      @click.stop.prevent="addExpense()"
      @submit.stop.prevent="addExpense()"
    >
      <input
        @click.stop
        class="m-1.5 w-24 rounded-full border-none text-sm text-slate-900 focus:ring-4 focus:ring-slate-600"
        type="number"
        name="expense"
        placeholder="0.00"
        v-model="expense"
      />
      <button type="submit">
        <ion-icon class="p-3 text-2xl text-white" name="cash"></ion-icon>
      </button>
    </form>
  </div>
  <!-- <div
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
  </div> -->
</template>
