import { Suspense, defineComponent } from 'vue';

import GraphRendererTemplate from './GraphRendererTemplate.vue';

export const GraphRendererHeight = 450;

/**
 * Bunun amacı normal GraphRenderTemplate component'ını Suspense ile sarmalamak ve Ag-Grid in prop hatasının önüne geçmek.
 */
export const GraphRenderer = defineComponent({
   name: 'GraphRenderer',
   props: ['params'],
   setup: (props) => () =>
      (
         <Suspense>
            <GraphRendererTemplate params={props.params} />
         </Suspense>
      )
});
