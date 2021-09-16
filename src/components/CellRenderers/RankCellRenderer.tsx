import { CellClassParams } from 'ag-grid-community';
import StarIcon from 'virtual:icons/mdi/star';
import { TransformNumberRenderer } from '/src/components/CellRenderers/TransformNumber.renderer';
import { defineComponent } from 'vue';

export const RankCellRenderer = defineComponent({
   name: 'RankCellRenderer',
   props: ['params'],
   setup: (props) => () =>
      (
         <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {(props.params as CellClassParams).value}
            <StarIcon style={{ marginLeft: '7px', color: 'yellow' }} />
         </span>
      )
});