export interface StoreData {
  indicators: any[];
  indicatorGroups: any[];
  currentperiod: any;
  currentperiodtype: any;
  currentSelectedIndicator: any;
  currentorgunit: any;
  orgUnits: any[];
  icons: any[];
}

export const INITIAL_STORE_DATA: StoreData = {
  indicators: [],
  indicatorGroups: [],
  currentperiod: '2017Q1',
  currentperiodtype: 'Year',
  currentSelectedIndicator: null,
  currentorgunit: 'm0frOspS7JY',
  orgUnits: null,
  icons: [
    {name: 'table', image: 'table.jpg', action: ''},
    {name: 'column', image: 'bar.png', action: ''},
    {name: 'line', image: 'line.png', action: ''},
    {name: 'combined', image: 'combined.jpg', action: ''},
    {name: 'bar', image: 'column.png', action: ''},
    {name: 'area', image: 'area.jpg', action: ''},
    {name: 'pie', image: 'pie.png', action: ''},
    {name: 'map', image: 'map.jpg', action: ''}
  ]
};
