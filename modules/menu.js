const readlineSync = require("readline-sync");
const { create_account, log_in, log_out } = require('./user');
const { check_balance, deposit, withdrawal } = require('./account');

const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

function menu() {
    let choice = readlineSync.question(
      "1 : Create an account\n2 : Log in\n3 : Check the balance\n4 : Make a deposit\n5 : Make a withdrawal\n6 : Log out\n7 : Stop the program\n"
    );
  
    switch (choice) {
      case "1":
        console.clear();
        create_account();
        break;
      case "2":
        console.clear();
        log_in();
        break;
      case "3":
        console.clear();
        check_balance();
        break;
      case "4":
        console.clear();
        deposit();
        break;
      case "5":
        console.clear();
        withdrawal();
        break;
      case "6":
        console.clear();
        log_out();
        break;
      case "7":
        console.clear();
        quit();
        break;
      default:
        console.clear();
        console.log(`${red}Invalid choice, please try again${reset_red}\n`);
        menu();
        break;
    }
}

module.exports = { menu };