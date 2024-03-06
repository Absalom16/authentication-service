import inquirer from "inquirer";
import { login } from "./login.js";
import { register } from "./register.js";

async function promptUser() {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Would you like to login or register?",
      choices: ["Login", "Register"],
    },
  ]);

  if (answer.action === "Login") {
    login();
  } else if (answer.action === "Register") {
    register();
  }
}

promptUser();
