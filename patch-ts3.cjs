const fs = require('fs');
let checkoutPath = 'src/server/checkout.ts';
if (fs.existsSync(checkoutPath)) {
  let checkout = fs.readFileSync(checkoutPath, 'utf8');
  // Troca phone diretamente para any fallback casting
  checkout = checkout.replace(
    /phone: \{ number: body\.payer\.phone\?\.number \|\| '999999999', area_code: body\.payer\.phone\?\.area_code \|\| '11' \}/g,
    "phone: { number: body.payer.phone?.number || '999999999', area_code: body.payer.phone?.area_code || '11' } as any"
  );
  
  // Apagar meta lovables de index
  let rootPath = 'index.html';
  if (fs.existsSync(rootPath)) {
    let index = fs.readFileSync(rootPath, 'utf8');
    index = index.replace(/<meta name="author" content="Lovable" \/>/g, '');
    index = index.replace(/Lovable/g, '');
    fs.writeFileSync(rootPath, index);
  }
  
  // Apagar o firebase se existir
  if (fs.existsSync('src/lib/firebase.ts')) {
    fs.unlinkSync('src/lib/firebase.ts');
  }

  fs.writeFileSync(checkoutPath, checkout);
}
