import type { ColDef } from '@ag-grid-enterprise/all-modules';
import { KeywordResponse } from '$types';
import { RankCellRenderer } from '/src/components/CellRenderers/RankCellRenderer';
import { RedGreenCellRenderer } from '/src/components/CellRenderers/RedGreenCellRenderer';
import { VolumeCellRenderer } from '/src/components/CellRenderers/VolumeCell.renderer';
import { createColorRenderer } from '/src/components/CellRenderers/ColorRenderer';
import { noSortCol } from '/src/configs/agGrid';

type Field = keyof Required<KeywordResponse>;

export const KEYWORD_SEARCH_LIMIT = 10;

export const columnDefs: ColDef[] = [
   {
      field: 'keyword' as Field,
      headerName: 'KEYWORD',
      cellRendererFramework: createColorRenderer('var(--color-keyword-column)'),
      flex: 2,
      ...noSortCol
   },
   {
      field: 'avgSearchVolume' as Field,
      headerName: 'SEARCH VOLUME',
      cellRendererFramework: VolumeCellRenderer
   },
   {
      field: 'rank' as Field,
      headerName: 'RANK',
      cellRendererFramework: RankCellRenderer
   },
   {
      field: 'diffRank' as Field,
      headerName: 'CHANGE',
      cellRendererFramework: RedGreenCellRenderer
   },
   {
      field: 'pixelRank' as Field,
      headerName: 'PX RANK',
      cellRendererFramework: RedGreenCellRenderer
   },
   {
      field: 'diffPixelRank' as Field,
      headerName: 'CHANGE',
      cellRendererFramework: RedGreenCellRenderer
   },
   {
      field: 'landingPage' as Field,
      headerName: 'URL-PAGE',
      flex: 2,
      ...noSortCol,
      cellRendererFramework: createColorRenderer('var(--url-url-column)')
   },
   { field: 'cpc' as Field, headerName: 'CPC-$' }
];
