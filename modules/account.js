const readlineSync = require("readline-sync");
const { db } = require('./database');
const { connected } = require('./user');

const green = "\x1b[0;32m";
const reset_green = "\x1b[0m";
const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

async function check_balance(current_user) {
  if (!current_user) {
    connected(current_user);
    console.log(`${red}Please log in first${reset_red}\n`);
    return current_user;
  }

  else if (current_user.money > 0) {
    connected(current_user);
    console.log(
      `${current_user.username} You have ${green}${current_user.money}$${reset_green} on your account\n`
    );
  }
  else if (current_user.money < 0) {
    connected(current_user);
    console.log(
      `${current_user.username} You have ${red}${current_user.money}$${reset_red} on your account\n`
    );
  }
  else {
    connected(current_user);
    console.log(
      `${current_user.username} You have ${current_user.money}$ on your account\n`
    );
  }
  return current_user;
}

async function deposit(current_user) {
  if (!current_user) {
    connected(current_user);
    console.log(`${red}Please log in first${reset_red}\n`);
    return current_user;
  }

  let depositQuestion = readlineSync.question("How much do you want to deposit? :");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(depositQuestion);

  console.clear()

  if (has_letter) {
    connected(current_user);
    console.log("Please write just the number of what you want to deposit\n");
  }
  else {
    const users = db.get("users");
    current_user.money = current_user.money + parseInt(depositQuestion);
    db.set("users", users);
    connected(current_user);
    console.log(`You have deposited ${green}${depositQuestion}$${reset_green}\n`);
  }
  return current_user;
}

async function withdrawal(current_user) {
  if (!current_user) {
    connected(current_user);
    console.log(`${red}Please log in first${reset_red}\n`);;
    return current_user;
  }

  let withdrawal = readlineSync.question("How much do you want to withdraw?: ");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(withdrawal);

  console.clear()

  if (has_letter) {
    connected(current_user);
    console.log("Please write just the number of what you want to deposit\n");
  }

  else {
    const users = db.get("users");
    current_user.money = current_user.money - parseInt(withdrawal);
    db.set("users", users);
    connected(current_user);
    console.log(`You have withdrawn ${red}${withdrawal}$${reset_red}\n`);
  }
  return current_user;
}

async function transfer(current_user) {
  if (!current_user) {
    connected(current_user);
    console.log(`${red}Please log in first${reset_red}\n`);
    return current_user;
  }

  let transferUser = readlineSync.question("Who do you want to make a transfer to (Username): ");
  console.clear();

  const users = db.get("users");
  let receiver = users.find((receiver) => receiver.username === transferUser);

  if (!receiver) {
    connected(current_user);
    console.log(`${red}Username not found${reset_red}\n`);
    return current_user;
  }

  let transfer_amount = readlineSync.question("Indicate the amount of your transfer: ");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(transfer_amount);

  console.clear();

  if (has_letter) {
    connected(current_user);
    console.log("Please write just the number of what you want to tranfer\n");
    return current_user;
  }

  current_user.money = current_user.money - parseInt(transfer_amount);
  receiver.money = receiver.money + parseInt(transfer_amount);
  db.set("users", users);
  connected(current_user);
  console.log(`You have tranfer ${green}${transfer_amount}$${reset_green} to ${green}${receiver.username}${reset_green}\n`);
  return current_user;
}

module.exports = { check_balance, deposit, withdrawal, transfer };