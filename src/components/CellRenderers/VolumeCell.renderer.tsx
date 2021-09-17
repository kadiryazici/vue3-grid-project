import { TransformNumberRenderer } from '/src/components/CellRenderers/TransformNumber.renderer';
import VolumeIcon from 'virtual:icons/mdi/signal-cellular-2';
import { defineComponent } from 'vue';

export const VolumeCellRenderer = defineComponent({
   name: 'VolumeCellRenderer',
   props: ['params'],
   setup: (props) => () =>
      (
         <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <VolumeIcon style={{ fontSize: '20px', marginRight: '7px', color: 'var(--color-accent)' }} />
            <TransformNumberRenderer params={props.params} />
         </span>
      )
});
