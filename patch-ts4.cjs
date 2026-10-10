const fs = require('fs');
let checkoutPath = 'src/server/checkout.ts';
if (fs.existsSync(checkoutPath)) {
  let checkout = fs.readFileSync(checkoutPath, 'utf8');
  checkout = checkout.replace(/const body = \{/g, 'const body: any = {');
  fs.writeFileSync(checkoutPath, checkout);
  console.log('Fixed checkout body type');
}
