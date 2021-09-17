import type { CellClassParams } from '@ag-grid-enterprise/all-modules';
import { defineComponent } from 'vue';
import { transformNumber } from '$helpers/transformNumber';

export const TransformNumberRenderer = defineComponent({
   name: 'TransformNumberRenderer',
   props: ['params'],
   setup: (props) => () => <span>{transformNumber((props.params as CellClassParams).value)}</span>
});
