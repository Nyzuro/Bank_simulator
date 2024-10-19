const readlineSync = require("readline-sync");
const { create_account, log_in, log_out, connected } = require('./user');
const { check_balance, deposit, withdrawal, transfer } = require('./account');

const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

let current_user;

async function menu() {
  let choice = readlineSync.question(
    "1 : Create an account\n2 : Log in\n3 : Check the balance\n4 : Make a deposit\n5 : Make a withdrawal\n6 : Make a transfer\n7 : Log out\n"
  );

  switch (choice) {
    case "1":
      console.clear();
      await create_account(current_user);
      menu();
      break;
    case "2":
      console.clear();
      current_user = await log_in(current_user);
      menu();
      break;
    case "3":
      console.clear();
      await check_balance(current_user);
      menu();
      break;
    case "4":
      console.clear();
      current_user = await deposit(current_user);
      menu();
      break;
    case "5":
      console.clear();
      current_user = await withdrawal(current_user);
      menu();
      break;
    case "6":
      console.clear();
      current_user = await transfer(current_user);
      menu();
      break;
    case "7":
      console.clear();
      current_user = await log_out(current_user);
      menu();
      break;
    default:
      console.clear();
      connected(current_user);
      console.log(`${red}Invalid choice, please try again${reset_red}\n`);
      menu();
      break;
  }
}

module.exports = { menu };