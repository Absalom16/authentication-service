import axios from "axios";
import inquirer from "inquirer";
import {
  generateRandomSalt,
  combinePasswordWithSalt,
  generateHash,
  addUser, checkEmailExists
} from "./utilities/helpers.js";

// Function to register a new user
export function register() {
  // Prompt the user for name, email, and password using inquirer
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter your name:",
        validate: function (value) {
          if (value.trim() === "") {
            return "Name cannot be empty.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "email",
        message: "Enter your email:",
        validate: function (value) {
          if (value.trim() === "") {
            return "Email cannot be empty.";
          }
          return true;
        },
      },
      {
        type: "password",
        name: "password",
        message: "Enter your password:",
        validate: function (value) {
          if (value.trim() === "") {
            return "Password cannot be empty.";
          }
          return true;
        },
      },
    ])
    .then(async (answers) => {
      // Handle user input
      try {
        // Check if any input fields are empty
        if (
          answers.name.trim() === "" ||
          answers.email.trim() === "" ||
          answers.password.trim() === ""
        ) {
          console.log("All fields are required. Please provide valid input.");
          return; // Exit the registration process
        }

        // Check if the email already exists
        const emailExists = await checkEmailExists(answers.email);
        if (emailExists) {
          console.log("Email already exists. Please choose a different email.");
          return; // Exit the registration process
        }

        // Generate a salt
        const salt = generateRandomSalt();
        // Combine salt with password
        const combinedString = combinePasswordWithSalt(answers.password, salt);
        //generate hashed password
        const hashedPassword = generateHash(combinedString);

        // Create an object containing the user's data along with the encrypted password
        const userData = {
          name: answers.name,
          email: answers.email,
          salt,
          password: hashedPassword,
        };

        // Add the user by making a POST request to the server
        const response = await addUser(userData);
        // Log a success message if the user was added successfully
        console.log("User added successfully:", response.data);
      } catch (error) {
        // Handle errors
        // Log an error message if an error occurs during user registration
        console.error("Error adding user:", error);
      }
    });
}


