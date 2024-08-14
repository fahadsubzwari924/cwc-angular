import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'field',
})
export class FieldPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any, ...args: any[]): any {
    const column: any = args[0];
    const fieldExpression: string = column.field;

    const result = fieldExpression.replace(/\{(.*?)\}/g, (_, path: string) => {
      const fieldValue = this.resolveValue(path, value);
      const formatter = this.getFormatter(column.type);
      return formatter.format(fieldValue);
    });

    return result;
  }

  private resolveValue(path: string, obj: any): any {
    return path
      .split('.')
      .reduce((acc: any, part: string) => acc && acc[part], obj);
  }

  private getFormatter(columnType: string): ColumnFormatter {
    switch (columnType) {
      case 'date':
        return new DateFormatter(this.datePipe);
      default:
        return new DefaultFormatter();
    }
  }
}

interface ColumnFormatter {
  format(value: any): string;
}

class DateFormatter implements ColumnFormatter {
  constructor(private datePipe: DatePipe) {}

  format(value: any): string {
    return value
      ? this.datePipe.transform(value, 'dd-MM-yyyy') ?? 'N/A'
      : 'N/A';
  }
}

class DefaultFormatter implements ColumnFormatter {
  format(value: any): string {
    return value ?? 'N/A';
  }
}
