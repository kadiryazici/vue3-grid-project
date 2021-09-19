import { computed, defineComponent, unref } from 'vue';

import type { CellClassParams } from '@ag-grid-enterprise/all-modules';

type ValueKind = 'above-0' | 'under-0' | 'normal';

const getDataType = (num: any): ValueKind => {
   if (typeof num !== 'number') return 'normal';
   if (num > 0) return 'above-0';
   if (num < 0) return 'under-0';
   return 'normal';
};

export const RedGreenCellRenderer = defineComponent({
   name: 'RedGreenCellRenderer',
   props: ['params'],
   setup({ params }) {
      const cell = computed(() => params as CellClassParams);
      const dataType = computed(() => getDataType(unref(cell).value));

      return () => (
         <div class="rankcell-wrapper">
            <span class={['rankcell-body', unref(dataType)]}>
               {unref(dataType) !== 'above-0' ? null : <span>+</span>}
               <span>{unref(cell).value}</span>
            </span>
         </div>
      );
   }
});
