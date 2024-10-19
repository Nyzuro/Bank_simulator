const readlineSync = require("readline-sync");
const { db } = require('./database');

const green = "\x1b[0;32m";
const reset_green = "\x1b[0m";
const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

function connected(current_user) {
  if (!current_user) {
    console.log(`${red}Not connected${reset_red}\n`);
  }
  else {
    console.log(`${green}Connected as ${current_user.username}${reset_green}\n`);
  }
}

async function create_account(current_user) {
  if (current_user) {
    connected(current_user);
    console.log(`${red}Please log out first${reset_red}\n`);
    return current_user;
  }

  let username = readlineSync.question("Username : ");

  const users = db.get("users");
  if (!Array.isArray(users)) {
    db.set("users", []);
  }

  const usernames = users.find((u) => u.username === username);

  if (!usernames) {
    let password = readlineSync.question("Create a password : ");
    db.push("users", { username: username, password: password, money: 0 });

    console.clear();
    connected(current_user);
    console.log("Your account has been created, you can now log in.");
    console.log("Back to the menu...\n");
    return current_user;
  }
  else {
    console.clear();
    connected(current_user);
    console.log(`${red}This username already exist, try another.${reset_red}`);
    return current_user;
  }
}

async function log_in(current_user) {
  if (current_user) {
    connected(current_user);
    console.log(`${red}You are already connected to an account${reset_red}\n`);
    return current_user;
  }

  let log_username = readlineSync.question("\nUsername : ");
  let log_password = readlineSync.question("Password : ");

  const users = db.get("users");
  const user = users.find((u) => u.username === log_username);

  if (!user) {
    console.clear()
    connected(current_user);
    console.log(`${red}User not found, please create an account.${reset_red}`);
    return current_user;
  }

  console.clear();

  if (user.password === log_password) {
    connected(user);
    console.log(`\nWelcome back ${user.username}\n`);
    return user;
  }
  else {
    connected(current_user);
    console.log(`${red}Incorrect password, please try again${reset_red}`);
    return current_user;
  }
}


async function log_out(current_user) {
  if (!current_user) {
    connected(current_user);
    console.log("You are not logged in\n")
    return current_user;
  }

  let log_out = readlineSync.question("Are you sure you want to log out (yes/no): ");
  console.clear();
  connected(current_user);

  if (log_out === "yes") {
    current_user = !current_user;
    console.clear();
    connected(current_user);
    return current_user;
  }
  else if (log_out === "no") {
    console.clear()
    connected(current_user);
    console.log("Back to the menu...\n");
    return current_user;
  }
  else {
    console.clear();
    connected(current_user);
    return current_user;
  }
}

module.exports = { connected, create_account, log_in, log_out, };