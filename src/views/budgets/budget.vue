<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { format, isAfter } from "date-fns";
import { useRoute } from "vue-router";

import { fetchBudget, populateBudget } from ".";
import { wordFromPeriod } from "../../services/periodService";

const route = useRoute();
const id = Number.parseInt(route.params.id as string);

const budget = await populateBudget(await fetchBudget(id));
const nextBreakdown = budget.breakdowns.filter((date) =>
  isAfter(date, new Date())
)[0];
const periodWord = computed(() => wordFromPeriod(budget.budget.breakdown));
const resetDate = format(nextBreakdown, "EEEE 'the' do MMMM y");
</script>

<template>
  <div class="text-center space-y-8">
    <h1 class="text-2xl font-bold">{{ budget.budget.name || "Default" }}</h1>
    <h2 class="text-xl">
      You have
      <p class="text-2xl font-bold">
        <span
          :class="
            budget.availibleThisBreakdown > 0
              ? 'text-green-600'
              : 'text-red-600'
          "
          >$</span
        >
        {{ budget.availibleThisBreakdown.toFixed(2) }}
      </p>
      availible for the remainder of this {{ periodWord }}
    </h2>
    <h2 class="text-xl">Your funds will roll over {{ resetDate }}</h2>
  </div>
</template>
