<script lang="ts" setup>
import { Ref, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Expense } from ".";
import { getDatabase, writeTransaction } from "../../services/database";
import version from "../../services/version";
import Overlay from "../../components/overlay.vue";

const route = useRoute();
const router = useRouter();
const id = Number.parseInt(route.params.id as string);

const name = ref("");
const expense: Ref<Number | undefined> = ref(undefined);

async function save() {
  const db = await getDatabase();

  await writeTransaction(db, "expenses", (store) => {
    store.add({
      name: name.value,
      value: expense.value,
      date: new Date(),
      budget_id: id,
    } as Expense);
  });

  version.value = Date.now();
  router.push("/budgets");
}
</script>

<template>
  <Overlay>
    <div class="flex flex-col space-y-4" @click.stop>
      <h1 class="text-3xl font-bold">New Expense</h1>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Name</span>
        <input v-model="name" class="rounded" type="text" name="name" />
      </label>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Expense</span>
        <input
          placeholder="0"
          v-model="expense"
          class="rounded"
          type="number"
          name="value"
        />
      </label>
      <button
        @click="save()"
        class="px-3 py-3 text-lg bg-green-500 rounded font-bold text-green-50 justify-self-end"
      >
        Save
      </button>
    </div>
  </Overlay>
</template>
