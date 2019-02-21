

import { OrgUnitFilterModule } from './org-unit-filter/org-unit-filter.module';
import { PeriodFilterModule } from './period-filter/period-filter.module';

export * from './org-unit-filter/org-unit-filter.module';
export * from './period-filter/period-filter.module'
export const modules: any[] = [OrgUnitFilterModule, PeriodFilterModule];
