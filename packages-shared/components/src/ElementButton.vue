<script setup lang="ts">
import { ElButton } from "element-plus";

defineProps<{
  label?: string;
  type?: "default" | "primary" | "success" | "warning" | "info" | "danger";
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();
</script>

<template>
  <ElButton
    :type="type || 'primary'"
    :disabled="disabled"
    @click="(event) => emit('click', event)"
  >
    <span v-if="label" class="border p-5">{{ label }}</span>
    <slot v-else />
  </ElButton>
</template>
