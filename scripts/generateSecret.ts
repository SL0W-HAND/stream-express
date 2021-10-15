import crypto from 'crypto'
let secret = crypto.randomBytes(64).toString('hex');
console.log('you can use this string to sign your tokens:');
console.log('');
console.log('\x1b[32m%s\x1b[0m', secret);
