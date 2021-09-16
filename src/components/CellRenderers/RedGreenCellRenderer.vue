<script lang="ts">
export default {
   name: 'RedGreenCellRenderer'
};
</script>
<script lang="ts" setup>
import { CellClassParams } from 'ag-grid-community';
import { computed } from 'vue';

type ValueKind = 'above-0' | 'under-0' | 'normal';

// bu propa tip verilemiyor çünkü verildiği zaman Ag-Grid hata veriyor.
const props = defineProps(['params']);
// Bu da tip desteği için kendi yaptığım yöntem
const cell = computed(() => props.params as CellClassParams);
const valueKind = computed((): ValueKind => {
   if (typeof cell.value.value !== 'number') return 'normal';
   if (cell.value.value > 0) return 'above-0';
   if (cell.value.value < 0) return 'under-0';
   return 'normal';
});
</script>

<template>
   <div class="rankcell-wrapper">
      <span :class="[valueKind]" class="rankcell-body">
         <span v-if="valueKind === 'above-0'">+</span>
         <span>{{ cell.value }}</span>
      </span>
   </div>
</template>

<!-- buradaki stil scoped olmamak zorunda çünkü AG-Grid bu componentı farklı bir şekilde derliyor. -->
<style lang="scss">
.rankcell-wrapper {
   @apply w-full h-full;
   .rankcell-body {
      @apply rounded-md;
      padding: 5px;
      &.above-0 {
         color: colors.$green;
         background-color: rgba(colors.$green, 0.1);
      }
      &.under-0 {
         color: colors.$red;
         background-color: rgba(colors.$red, 0.1);
      }
   }
}
</style>
