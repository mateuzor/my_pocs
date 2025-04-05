import * as str from './utils/strings.js';
import * as dt from './utils/dates.js';
import * as num from './utils/numbers.js';

window.runTests = () => {
  const result = [];

  result.push('Capitalize: ' + str.capitalize('hello world'));
  result.push('Kebab: ' + str.kebabCase('Hello World'));
  result.push('Format Date: ' + dt.formatDate('2024-12-25'));
  result.push('Days Between: ' + dt.daysBetween('2024-01-01', '2024-01-10'));
  result.push('Currency: ' + num.formatCurrency(1234.5));
  result.push('Rounded: ' + num.round(3.14159));

  document.getElementById('output').textContent = result.join('\n');
};
