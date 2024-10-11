const readlineSync = require("readline-sync");
const Database = require("easy-json-database");
const db = new Database("./data-users.json", {
  snapshots: {
    enabled: true,
    interval: 24 * 60 * 60 * 1000,
    folder: "./backups/",
  },
});

let current_user;
const green = "\x1b[0;32m";
const reset_green = "\x1b[0m";
const red = "\x1b[0;31m";
const reset_red = "\x1b[0m";

function connected() {
if (!current_user){
  console.log(`${red}Not connected${reset_red}\n`);
}
else {
  console.log(`${green}Connected as ${current_user}${reset_green}\n`);
}
}
connected();

console.log(`\nWelcome to your bank account`);
console.log("What do you wanna do?\n");

function menu() {
  let choice = readlineSync.question(
    "1 : Create an account\n2 : Log in\n3 : Check the balance\n4 : Make a deposit\n5 : Make a withdrawal\n6 : Log out\n"
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
    default:
      console.clear();
      console.log(`${red}Invalid choice, please try again${reset_red}\n`);
      menu();
      break;
  }
}

menu();

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
    connected();
    console.log(`${red}This username already exist, try another.${reset_red}`);
    menu();
    return;
  }
}

function log_in() {
  if(current_user){
    console.log(`${red}You are already connected to an account${reset_red}\n`)
    connected();
    menu()
    return;
  }

  let log_username = readlineSync.question("\nUsername : ");
  let log_password = readlineSync.question("Password : ");

  const users = db.get("users");
  const user = users.find((u) => u.username === log_username);

  if (!user) {
    console.log(`${red}User not found, please create an account.${reset_red}`);
    connected();
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
    console.log(`${red}Incorrect password, please try again${reset_red}`);
    menu();
    return;
  }
}

function check_balance() {
  if (!current_user) {
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  } 
  
  else if (current_user.money > 0) {
    console.log(
      `${current_user.username} You have ${green}${current_user.money}$${reset_green} on your account\n`
    );
  } 
  else if (current_user.money < 0) {
    console.log(
      `${current_user.username} You have ${red}${current_user.money}$${reset_red} on your account\n`
    );
  } 
  else {
    console.log(
      `${current_user.username} You have ${current_user.money}$ on your account\n`
    );
  }
  menu();
}

function deposit() {
  if (!current_user) {
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  }

  let deposit = readlineSync.question("How much do you want to deposit? :");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(deposit);

  console.clear()

  if (has_letter) {
    console.log("Please write just the number of what you want to deposit\n");
  } 
  
  else {
    const users = db.get("users");
    current_user.money = current_user.money + parseInt(deposit);
    db.set("users", users);

    console.log(`You have deposited ${green}${deposit}$${reset_green}\n`);
  }
  menu();
}

function withdrawal() {
  if (!current_user) {
    console.log(`${red}Please log in first${reset_red}\n`);
    menu();
    return;
  }

  let withdrawal = readlineSync.question("How much do you want to withdraw?: ");
  const has_letter = /[a-zA-z!-/:-@[-~]/.test(withdrawal);

  console.clear()

  if (has_letter) {
    console.log("Please write just the number of what you want to deposit\n");
  } 
  
  else {
    const users = db.get("users");
    current_user.money = current_user.money - parseInt(withdrawal);
    db.set("users", users);

    console.log(`You have withdrawn ${red}${withdrawal}$${reset_red}\n`);
  }
  menu();
}

function log_out() {
  let log_out = question("Are you sure you want to log out (yes/no): ");
  if (log_out === "yes") {
  current_user = !current_user;
  menu();
  return;
  }
  else if (log_out === "no" ) {
    console.log("Back to the menu...");
    menu();
    return;
  }
}
