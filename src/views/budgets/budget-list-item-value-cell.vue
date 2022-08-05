<script lang="ts" setup>
import { toRefs } from "vue";

const {
  header,
  value,
  currency = true,
} = defineProps<{
  header: String;
  value: any;
  currency?: boolean;
}>();

function formatCurrency(x: any) {
  const formatter = new Intl.NumberFormat(navigator.language || "en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.formatToParts(x);
}
</script>

<template>
  <div class="text-right mb-2 sm:mb-0">
    <h3 class="uppercase text-xs font-bold">{{ header }}</h3>
    <span class="text-xl">
      <span>
        <template v-if="currency">
          <span
            v-for="part of formatCurrency(value)"
            :class="{
              'font-bold mr-2': ['currency', 'minusSign'].includes(part.type),
              'text-green-600':
                ['currency', 'minusSign'].includes(part.type) && value >= 0,
              'text-red-600':
                ['currency', 'minusSign'].includes(part.type) && value < 0,
            }"
          >
            {{ part.value }}
          </span>
        </template>
        <template v-else>{{ value }}</template>
      </span>
    </span>
  </div>
</template>
