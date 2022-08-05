<script lang="ts" setup>
import { onMounted, reactive, Ref, ref } from "vue";
import { useRouter } from "vue-router";
import { Budget } from ".";
import { getDatabase, writeTransaction } from "../../services/database";
import { Period, wordFromPeriod } from "../../services/periodService";
import version from "../../services/version";
import Overlay from "../../components/overlay.vue";

const router = useRouter();

const input_name: Ref<HTMLElement | null> = ref(null);

const periods = [0, 0, 0, 0].map((x, i) => {
  return {
    id: i,
    name: wordFromPeriod(i),
  };
});

let name = ref("");
let budget: Ref<Number | undefined> = ref(undefined);
let period = ref(3);
let breakdown = ref(2);

async function save() {
  const db = await getDatabase();

  await writeTransaction(db, "budgets", (store) => {
    store.add({
      name: name.value,
      limitPerPeriod: budget.value,
      period: period.value,
      breakdown: breakdown.value,
    } as Budget);
  });

  version.value = Date.now();

  router.push("/budgets");
}

onMounted(() => {
  input_name.value?.focus();
});
</script>

<template>
  <Overlay>
    <form class="flex flex-col space-y-4" @click.stop>
      <h1 class="text-3xl font-bold">New Budget</h1>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Name</span>
        <input
          ref="input_name"
          v-model="name"
          class="rounded"
          type="text"
          name="name"
        />
      </label>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Budget</span>
        <input
          v-model="budget"
          placeholder="0"
          class="rounded"
          type="number"
          name="value"
        />
      </label>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Period</span>
        <select v-model="period" class="rounded" name="period">
          <option v-for="period of periods" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="uppercase text-sm">Breakdown</span>
        <select v-model="breakdown" class="rounded" name="period">
          <option v-for="period of periods" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </label>
      <button
        @click="save()"
        type="submit"
        class="px-3 py-3 text-lg bg-green-500 rounded font-bold text-green-50 justify-self-end"
      >
        Save
      </button>
    </form>
  </Overlay>
</template>
