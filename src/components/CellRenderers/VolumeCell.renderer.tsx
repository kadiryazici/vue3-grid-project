import { TransformNumberRenderer } from '/src/components/CellRenderers/TransformNumber.renderer';
import VolumeIcon from 'virtual:icons/mdi/signal-cellular-2';
import { defineComponent } from 'vue';

export const VolumeCellRenderer = defineComponent({
   name: 'VolumeCellRenderer',
   props: ['params'],
   setup: (props) => () =>
      (
         <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <VolumeIcon style={{ marginRight: '7px' }} />
            <TransformNumberRenderer params={props.params} />
         </span>
      )
});
