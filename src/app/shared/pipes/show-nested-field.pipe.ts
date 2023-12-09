import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'field',
})
export class FieldPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  transform(value: any, ...args: any[]): any {
    const column: any = args[0];
    let result = value;
    column.field
      .split('.')
      .forEach(
        (f: any) => (result = this.formatColumnValue(column.type, result[f]))
      );
    return result;
  }

  formatColumnValue(columnType: string, columnValue: any) {
    return columnType === 'date'
      ? this.datePipe.transform(columnValue, 'dd-MM-yyyy')
      : columnValue;
  }
}
