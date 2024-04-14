import axios from "axios";
import inquirer from "inquirer";
import { combinePasswordWithSalt, generateHash, authenticateUser } from "./utilities/helpers.js";

// Function to handle user login
export function login() {
  // Prompt the user for their email using inquirer
  inquirer
    .prompt([
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
    ])
    .then(async (answers) => {
      // Handle user input
      try {
        // Get user data based on the provided email
        const userData = await getUser(answers.email);
        if (userData) {
          // Check if user data exists
          // Prompt the user for their password using inquirer
          inquirer
            .prompt([
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
              // Authenticate the user with the provided password
              const isValid = await authenticateUser(
                userData,
                answers.password
              );
              // Notify the user of the authentication result
              if (isValid) {
                console.log("Successful authentication");
              } else {
                console.log("Failed authentication");
              }
            });
        } else {
          // Notify the user that the user with the provided email was not found
          console.log("User not found");
        }
      } catch (error) {
        // Handle errors
        // Log an error message if an error occurs during user login
        console.error("Error:", error);
      }
    });
}

// Function to get user data based on email
async function getUser(email) {
  try {
    // Make a GET request to retrieve user data from the server based on the provided email
    const response = await axios.get("http://localhost:3000/users", {
      params: {
        email: email,
      },
    });
    // Return the first user data object from the response
    return response.data[0];
  } catch (error) {
    // Handle errors
    // Log an error message if an error occurs while fetching user data
    console.error("Error getting user:", error);
    // Return null to indicate that no user data was found
    return null;
  }
}



