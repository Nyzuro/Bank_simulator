const { menu } = require('./modules/menu');
const { connected } = require('./modules/user');

console.clear();
connected();
console.log(`\nWelcome to your bank account`);
console.log("What do you wanna do?\n");
menu();