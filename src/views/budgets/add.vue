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
    <form
      class="flex flex-col space-y-4"
      @click.stop
      @submit.stop.prevent="save()"
    >
      <h1 class="text-lg font-bold uppercase">New Budget</h1>
      <label class="flex flex-col">
        <span class="text-sm uppercase">Name</span>
        <input
          ref="input_name"
          v-model="name"
          class="rounded-full border-slate-600 focus:border-slate-600 focus:ring-2 focus:ring-slate-600"
          type="text"
          name="name"
          autocomplete="off"
        />
      </label>
      <label class="flex flex-col">
        <span class="text-sm uppercase">Budget</span>
        <input
          v-model="budget"
          placeholder="0.00"
          class="rounded-full border-slate-600 focus:border-slate-600 focus:ring-2 focus:ring-slate-600"
          type="number"
          name="value"
        />
      </label>
      <label class="flex flex-col">
        <span class="text-sm uppercase">Period</span>
        <select
          v-model="period"
          class="rounded-full border-slate-600 focus:border-slate-600 focus:ring-2 focus:ring-slate-600"
          name="period"
        >
          <option v-for="period of periods" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </label>
      <label class="flex flex-col">
        <span class="text-sm uppercase">Breakdown</span>
        <select
          v-model="breakdown"
          class="rounded-full border-slate-600 focus:border-slate-600 focus:ring-2 focus:ring-slate-600"
          name="period"
        >
          <option v-for="period of periods" :value="period.id">
            {{ period.name }}
          </option>
        </select>
      </label>
      <button
        type="submit"
        class="justify-self-end rounded-full bg-slate-500 px-3 py-3 text-base font-bold text-green-50"
      >
        Save
      </button>
    </form>
  </Overlay>
</template>
