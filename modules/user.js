const readlineSync = require("readline-sync");
const { db } = require('./database');
const { menu } = require('./menu');

const green = "\x1b[0;32m";
const reset_green = "\x1b[0m";
const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

let current_user;

function connected() {
	if (!current_user){
		console.log(`${red}Not connected${reset_red}\n`);
	}
	else {
		console.log(`${green}Connected as ${current_user.username}${reset_green}\n`);
	}
}

function create_account() {
  if (current_user){
    connected();
    console.log(`${red}Please log out first${reset_red}\n`);
    menu();
    return; 
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
    connected();
    console.log("Your account has been created, you can now log in.");
    console.log("Back to the menu...\n");
    menu();
    return;
  } 
  else {
    console.clear();
    connected();
    console.log(`${red}This username already exist, try another.${reset_red}`);
    menu();
    return;
  }
}

function log_in() {
  if(current_user){
    connected();
    console.log(`${red}You are already connected to an account${reset_red}\n`);
    menu()
    return;
  }

  let log_username = readlineSync.question("\nUsername : ");
  let log_password = readlineSync.question("Password : ");

  const users = db.get("users");
  const user = users.find((u) => u.username === log_username);

  if (!user) {
    console.clear()
    connected();
    console.log(`${red}User not found, please create an account.${reset_red}`);
    menu();
    return;
  }

  console.clear();

  if (user.password === log_password) {
    current_user = user;
    connected();
    console.log(`\nWelcome back ${current_user.username}\n`);
    menu();
    return;
  } 
  else {
    connected();
    console.log(`${red}Incorrect password, please try again${reset_red}`);
    menu();
    return;
  }
}

function log_out() {
  if (!current_user) {
    connected();
    console.log("You are not logged in\n")
    menu();
  }

  connected();
  let log_out = readlineSync.question("Are you sure you want to log out (yes/no): ");
  
  if (log_out === "yes") {
  current_user = !current_user;
  console.clear();
  connected();
  menu();
  return;
  }
  else if (log_out === "no" ) {
    console.clear()
    connected();
    console.log("Back to the menu...\n");
    menu();
    return;
  }
}

module.exports = { connected, create_account, log_in, log_out };