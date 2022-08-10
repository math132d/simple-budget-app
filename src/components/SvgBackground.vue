<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { ComputedRef, toRefs } from "vue";

function evenRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

const props = defineProps<{ positive: boolean }>();
const { positive } = toRefs(props);

const sign: ComputedRef<"+" | "-"> = computed(() => {
  return positive.value ? "+" : "-";
});

const color = evenRandom(0, 3);

const smallestCircle = evenRandom(20, 60);
const iterations = evenRandom(3, 7);

const x = evenRandom(40, 60);
const y = evenRandom(40, 60);

const classes = {
  "+": [
    [
      "fill-green-400",
      "fill-green-500",
      "fill-green-600",
      "fill-green-600/75",
      "fill-green-700",
      "fill-green-700/75",
    ],
    [
      "fill-sky-400",
      "fill-sky-500",
      "fill-sky-600",
      "fill-sky-600/75",
      "fill-sky-700",
      "fill-sky-700/75",
    ],
    [
      "fill-emerald-400",
      "fill-emerald-500",
      "fill-emerald-600",
      "fill-emerald-600/75",
      "fill-emerald-700",
      "fill-emerald-700/75",
    ],
  ],
  "-": [
    [
      "fill-red-400",
      "fill-red-500",
      "fill-red-600",
      "fill-red-600/75",
      "fill-red-700",
      "fill-red-700/75",
    ],
    [
      "fill-orange-400",
      "fill-orange-500",
      "fill-orange-600",
      "fill-orange-600/75",
      "fill-orange-700",
      "fill-orange-700/75",
    ],
    [
      "fill-amber-400",
      "fill-amber-500",
      "fill-amber-600",
      "fill-amber-600/75",
      "fill-amber-700",
      "fill-amber-700/75",
    ],
  ],
};
</script>

<template>
  <svg>
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :class="classes[sign][color][2]"
    ></rect>
    <g
      :style="{ transform: `translate(${x}%, ${y}%)` }"
      style="transform-origin: center center"
    >
      <circle
        v-for="i in iterations"
        cx="50%"
        cy="50%"
        :x="color"
        :r="smallestCircle * (iterations + 1) - smallestCircle * i"
        class="animated drop-shadow-xl filter"
        :class="classes[sign][color][iterations - i]"
        :style="{
          animationDelay: `${500 * i}ms`,
        }"
      ></circle>
    </g>
  </svg>
</template>

<style>
@keyframes bubble {
  50% {
    transform: scale(65%);
  }
}

.animated {
  transform-origin: center center;
  animation-name: bubble;
  animation-duration: 15s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
