import { ReportType } from './report-type.model';

/** PrimeNG MultiSelect grouped option row (optionGroupLabel + optionGroupChildren). */
export interface ReportTypeGroupOption {
  label: string;
  items: ReportType[];
}
