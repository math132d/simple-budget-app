<script lang="ts" setup>
import { getDatabase, writeTransaction } from "../services/database";
import { Period } from "../services/periodService";
import { Expense, Budget } from "./budgets/index";

let db: IDBDatabase;

try {
  db = await getDatabase();
} catch (error) {
  console.error(error);
}

async function addSomething() {
  await writeTransaction(db, "budgets", (store) => {
    store.add({
      limitPerPeriod: Math.random() * 10000,
      period: Period.Month,
      breakdown: Period.Week,
    } as Budget);
  });
}

async function addExpense() {
  await writeTransaction(db, "expenses", (store) => {
    store.add({
      date: new Date(),
      value: Math.random() * 10,
      budget_id: 1,
    } as Expense);
  });
}
</script>

<template>
  <div class="flex flex-col w-full">
    <h1>Home View</h1>
    <button @click="addSomething">Add</button>
    <button @click="addExpense">Add Expense</button>
  </div>
</template>
