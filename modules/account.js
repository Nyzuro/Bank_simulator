const readlineSync = require("readline-sync");
const { db } = require('./database');
const { connected } = require('./user');

const green = "\x1b[0;32m";
const reset_green = "\x1b[0m";
const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

function check_balance() {
  if (!current_user) {
    connected();
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  } 
  
  else if (current_user.money > 0) {
    connected();
    console.log(
      `${current_user.username} You have ${green}${current_user.money}$${reset_green} on your account\n`
    );
  } 
  else if (current_user.money < 0) {
    connected();
    console.log(
      `${current_user.username} You have ${red}${current_user.money}$${reset_red} on your account\n`
    );
  } 
  else {
    connected();
    console.log(
      `${current_user.username} You have ${current_user.money}$ on your account\n`
    );
  }
  menu();
}

function deposit() {
  if (!current_user) {
    connected();
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  }

  let deposit = readlineSync.question("How much do you want to deposit? :");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(deposit);

  console.clear()

  if (has_letter) {
    connected();
    console.log("Please write just the number of what you want to deposit\n");
  } 
  
  else {
    const users = db.get("users");
    current_user.money = current_user.money + parseInt(deposit);
    db.set("users", users);
    connected();
    console.log(`You have deposited ${green}${deposit}$${reset_green}\n`);
  }
  menu();
}

function withdrawal() {
  if (!current_user) {
    connected();
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  }

  let withdrawal = readlineSync.question("How much do you want to withdraw?: ");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(withdrawal);

  console.clear()

  if (has_letter) {
    connected();
    console.log("Please write just the number of what you want to deposit\n");
  } 
  
  else {
    const users = db.get("users");
    current_user.money = current_user.money - parseInt(withdrawal);
    db.set("users", users);
    connected();
    console.log(`You have withdrawn ${red}${withdrawal}$${reset_red}\n`);
  }
  menu();
}

module.exports = { check_balance, deposit, withdrawal };