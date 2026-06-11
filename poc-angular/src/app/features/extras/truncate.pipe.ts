import { Pipe, PipeTransform } from '@angular/core';

// A PURE pipe (the default): Angular only re-runs transform() when the input
// reference changes, so it's cheap to use in templates. Standalone — just add
// it to a component's `imports`.
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, max = 20): string {
    return value.length > max ? value.slice(0, max).trimEnd() + '…' : value;
  }
}
