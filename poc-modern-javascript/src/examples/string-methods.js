// Modern String methods: repeat, padStart, padEnd

// repeat() - Repeats a string a specified number of times
console.log('=== String.repeat() ===');
console.log('ha'.repeat(3));               // 'hahaha'
console.log('*'.repeat(10));                // '**********'
console.log('Hello '.repeat(5));            // 'Hello Hello Hello Hello Hello '

// Creating patterns
const separator = '-'.repeat(40);
console.log('\n' + separator);
console.log('    SECTION TITLE');
console.log(separator);

// padStart() - Pads the beginning of a string
console.log('\n=== String.padStart() ===');
console.log('5'.padStart(3, '0'));          // '005'
console.log('42'.padStart(5, '0'));         // '00042'
console.log('hello'.padStart(10, '*'));     // '*****hello'
console.log('world'.padStart(10));          // '     world' (default: space)

// Formatting numbers
const invoice = '1234';
console.log('\nInvoice #' + invoice.padStart(8, '0')); // Invoice #00001234

// Aligning text
const items = ['Apple', 'Banana', 'Orange'];
console.log('\nRight-aligned list:');
items.forEach(item => {
  console.log(item.padStart(10));
});

// padEnd() - Pads the end of a string
console.log('\n=== String.padEnd() ===');
console.log('5'.padEnd(3, '0'));            // '500'
console.log('42'.padEnd(5, '0'));           // '42000'
console.log('hello'.padEnd(10, '*'));       // 'hello*****'
console.log('world'.padEnd(10));            // 'world     ' (default: space)

// Creating tables
console.log('\n=== Table Example ===');
const products = [
  { name: 'Laptop', price: '999.99' },
  { name: 'Mouse', price: '29.99' },
  { name: 'Keyboard', price: '79.99' }
];

console.log('Product'.padEnd(15) + 'Price'.padStart(10));
console.log('-'.repeat(25));
products.forEach(p => {
  console.log(p.name.padEnd(15) + ('$' + p.price).padStart(10));
});

// Combining repeat, padStart, and padEnd
console.log('\n=== Combined Usage ===');

// Progress bar
function progressBar(percent, width = 30) {
  const filled = Math.floor(width * percent / 100);
  const bar = '█'.repeat(filled).padEnd(width, '░');
  return `[${bar}] ${percent}%`;
}

console.log('Loading:');
console.log(progressBar(0));
console.log(progressBar(25));
console.log(progressBar(50));
console.log(progressBar(75));
console.log(progressBar(100));

// Credit card masking
function maskCreditCard(number) {
  const last4 = number.slice(-4);
  return last4.padStart(number.length, '*');
}

console.log('\nCredit Card:');
console.log(maskCreditCard('4532123456789012')); // ************9012

// Binary/Hex formatting
console.log('\n=== Number Formatting ===');
const num = 42;
console.log('Decimal:  ' + num.toString().padStart(4, '0'));
console.log('Binary:   ' + num.toString(2).padStart(8, '0'));
console.log('Octal:    ' + num.toString(8).padStart(4, '0'));
console.log('Hex:      ' + num.toString(16).padStart(4, '0').toUpperCase());
