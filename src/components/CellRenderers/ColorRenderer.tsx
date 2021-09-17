import { defineComponent } from 'vue';

export const createColorRenderer = (color: string) =>
   defineComponent({
      name: 'ColorRenderer',
      props: ['params'],
      setup: (props) => () => <span style={{ color }}>{props.params.value}</span>
   });
