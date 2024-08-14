import { CurrencyPipe, DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'field',
})
export class FieldPipe implements PipeTransform {
  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {}

  transform(value: any, ...args: any[]): any {
    const column: any = args[0];
    const fieldExpression: string = column.field;

    // Check if fieldExpression has curly braces or is just a simple field name
    if (fieldExpression.includes('{')) {
      // Handle expressions with curly braces like "{orderDate}"
      return fieldExpression.replace(/\{(.*?)\}/g, (_, path: string) => {
        const fieldValue = this.resolveValue(path, value);
        const formatter = this.getFormatter(column.type);
        return formatter.format(fieldValue);
      });
    } else {
      // Handle simple field names like "orderDate"
      const fieldValue = this.resolveValue(fieldExpression, value);
      const formatter = this.getFormatter(column.type);
      return formatter.format(fieldValue);
    }
  }

  private resolveValue(path: string, obj: any): any {
    // Traverse the object to get the value based on the path
    return path
      .split('.')
      .reduce((acc: any, part: string) => acc && acc[part], obj);
  }

  private getFormatter(columnType: string): ColumnFormatter {
    switch (columnType) {
      case 'date':
        return new DateFormatter(this.datePipe);
      case 'currency':
        return new CurrencyFormatter(this.currencyPipe);
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

class CurrencyFormatter implements ColumnFormatter {
  constructor(private currencyPipe: CurrencyPipe) {}

  format(value: any): string {
    return value
      ? this.currencyPipe.transform(value, 'PKR', 'symbol-narrow', '1.0-0') ??
          'N/A'
      : 'N/A';
  }
}

class DefaultFormatter implements ColumnFormatter {
  format(value: any): string {
    return value ?? 'N/A';
  }
}
